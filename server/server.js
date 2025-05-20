const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const compression = require("compression");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with optimized settings
const io = socketIO(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : "*",
    methods: ["GET", "POST"],
  },
  connectTimeout: 45000,
  maxHttpBufferSize: 1e6, // 1MB
});

// Enable compression for all HTTP responses
app.use(compression());

// Serve static files with caching
app.use(
  express.static(path.join(__dirname, "../public"), {
    maxAge: "1h",
    etag: true,
  })
);

// Lazy-load sorting algorithms when needed
const algorithmPaths = {
  bubbleSort: "./algorithms/bubbleSort",
  quickSort: "./algorithms/quickSort",
  mergeSort: "./algorithms/mergeSort",
  insertionSort: "./algorithms/insertionSort",
  selectionSort: "./algorithms/selectionSort",
  heapSort: "./algorithms/heapSort",
  shellSort: "./algorithms/shellSort",
  countingSort: "./algorithms/countingSort",
  radixSort: "./algorithms/radixSort",
};

// Cache for loaded algorithms
const sortingAlgorithms = {};

// Rate limiting configuration
const rateLimiter = {
  windowMs: 60000, // 1 minute
  maxRequests: 10, // max 10 sort requests per minute
  clients: new Map(),
};

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Initialize client rate limiting
  rateLimiter.clients.set(socket.id, {
    requests: 0,
    lastReset: Date.now(),
  });

  // Pause/resume mechanism with optimized promise handling
  let sortState = {
    pauseRequested: false,
    resumeResolver: null,
    currentSortJob: null,
  };

  // Optimized pause check function
  async function checkPause() {
    if (sortState.pauseRequested) {
      await new Promise((resolve) => {
        sortState.resumeResolver = resolve;
      });
    }
  }

  // Handle pause request
  socket.on("pauseSort", () => {
    sortState.pauseRequested = true;
  });

  // Handle resume request
  socket.on("resumeSort", () => {
    sortState.pauseRequested = false;
    if (sortState.resumeResolver) {
      sortState.resumeResolver();
      sortState.resumeResolver = null;
    }
  });

  // Handle sort request with rate limiting
  socket.on("startSort", async ({ algorithm, array, speed }) => {
    // Apply rate limiting
    const clientLimit = rateLimiter.clients.get(socket.id);
    const now = Date.now();

    // Reset counter if window has passed
    if (now - clientLimit.lastReset > rateLimiter.windowMs) {
      clientLimit.requests = 0;
      clientLimit.lastReset = now;
    }

    // Check if rate limit exceeded
    if (clientLimit.requests >= rateLimiter.maxRequests) {
      return socket.emit("sortError", {
        message: "Rate limit exceeded. Please try again later.",
      });
    }

    // Increment request counter
    clientLimit.requests++;

    // Cancel any existing sort job
    if (sortState.currentSortJob) {
      sortState.currentSortJob.cancelled = true;
    }

    // Create new sort job
    sortState.currentSortJob = { cancelled: false };
    const currentJob = sortState.currentSortJob;

    // Reset pause state
    sortState.pauseRequested = false;
    if (sortState.resumeResolver) {
      sortState.resumeResolver();
      sortState.resumeResolver = null;
    }

    // Validate input array
    if (!Array.isArray(array) || array.length === 0) {
      return socket.emit("sortError", { message: "Invalid array input" });
    }

    // Validate array size to prevent DoS
    if (array.length > 1000) {
      return socket.emit("sortError", {
        message: "Array too large (max 1000 elements)",
      });
    }

    console.log(
      `Starting ${algorithm} sort on array of length ${array.length}`
    );

    // Map speed to delay
    const delay =
      {
        slow: 1000,
        medium: 500,
        fast: 100,
        ultrafast: 10,
      }[speed] || 500;

    try {
      // Lazy-load the algorithm if not already loaded
      if (!sortingAlgorithms[algorithm]) {
        if (!algorithmPaths[algorithm]) {
          throw new Error(`Algorithm ${algorithm} not supported`);
        }

        try {
          // Verify the algorithm file exists before requiring it
          const algorithmPath = require.resolve(algorithmPaths[algorithm]);
          sortingAlgorithms[algorithm] = require(algorithmPath);

          // Verify the loaded module is a function
          if (typeof sortingAlgorithms[algorithm] !== "function") {
            throw new Error(`Algorithm ${algorithm} is not a valid function`);
          }
        } catch (loadError) {
          console.error(`Failed to load algorithm ${algorithm}:`, loadError);
          throw new Error(`Failed to load algorithm ${algorithm}`);
        }
      }

      const sortFunction = sortingAlgorithms[algorithm];

      // Start sorting and emit each step
      await sortFunction(
        array,
        async (step) => {
          // Check if this sort job was cancelled
          if (currentJob.cancelled) {
            throw new Error("Sort cancelled");
          }

          socket.emit("sortStep", step);
          await checkPause();
        },
        delay
      );

      // Only emit completion if job wasn't cancelled
      if (!currentJob.cancelled) {
        socket.emit("sortComplete", { array });
      }
    } catch (error) {
      // Only emit error if job wasn't cancelled or it's a different error
      if (!currentJob.cancelled || error.message !== "Sort cancelled") {
        console.error("Sorting error:", error);
        socket.emit("sortError", { message: error.message });
      }
    } finally {
      // Clean up if this is still the current job
      if (sortState.currentSortJob === currentJob) {
        sortState.currentSortJob = null;
      }
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Clean up rate limiter data
    rateLimiter.clients.delete(socket.id);

    // Clean up any pending sort jobs
    if (sortState.currentSortJob) {
      sortState.currentSortJob.cancelled = true;
    }

    // Clean up any pending promises
    if (sortState.resumeResolver) {
      sortState.resumeResolver();
      sortState.resumeResolver = null;
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  // Keep the server running despite uncaught exceptions
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Keep the server running despite unhandled rejections
});

// Start server with optimized settings
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Available sorting algorithms: ${Object.keys(algorithmPaths).join(", ")}`
  );
});

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Sorting algorithms
const sortingAlgorithms = {
  bubbleSort: require("./algorithms/bubbleSort"),
  quickSort: require("./algorithms/quickSort"),
  mergeSort: require("./algorithms/mergeSort"),
  insertionSort: require("./algorithms/insertionSort"),
  selectionSort: require("./algorithms/selectionSort"),
  heapSort: require("./algorithms/heapSort"),
  shellSort: require("./algorithms/shellSort"),
  countingSort: require("./algorithms/countingSort"),
  radixSort: require("./algorithms/radixSort"),
};

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  let pauseRequested = false;
  let resumeResolver = null;

  async function checkPause() {
    if (pauseRequested) {
      await new Promise((resolve) => {
        resumeResolver = resolve;
      });
    }
  }

  socket.on("pauseSort", () => {
    pauseRequested = true;
  });

  socket.on("resumeSort", () => {
    pauseRequested = false;
    if (resumeResolver) {
      resumeResolver();
      resumeResolver = null;
    }
  });

  socket.on("startSort", async ({ algorithm, array, speed }) => {
    console.log(`Starting ${algorithm} sort on array:`, array);
    console.log("Available algorithms:", Object.keys(sortingAlgorithms));

    const delay =
      {
        slow: 1000,
        medium: 500,
        fast: 100,
      }[speed] || 500;

    try {
      const sortFunction = sortingAlgorithms[algorithm];
      if (!sortFunction) {
        console.error(
          `Algorithm ${algorithm} not found in available algorithms:`,
          Object.keys(sortingAlgorithms)
        );
        throw new Error(`Algorithm ${algorithm} not found`);
      }

      // Start sorting and emit each step
      await sortFunction(
        array,
        async (step) => {
          socket.emit("sortStep", step);
          await checkPause();
        },
        delay
      );

      // Emit completion
      socket.emit("sortComplete", { array });
    } catch (error) {
      console.error("Sorting error:", error);
      socket.emit("sortError", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

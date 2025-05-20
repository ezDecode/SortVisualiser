# GitHub Pages Deployment Guide

Since GitHub Pages only supports static websites, we need to create a static version of the Sorting Visualizer that can run without the Node.js server. This guide will help you create and deploy a static demo version.

## Creating a Static Version

1. Create a new branch for the static version:

```bash
git checkout -b gh-pages
```

2. Create a static version of the app by modifying the client-side code to use mock data instead of real-time server communication.

3. Create a new file called `static-demo.js` in the public directory:

```javascript
// This is a simplified version that doesn't require a server
// It uses predefined sorting steps for demonstration purposes

// Mock sorting steps for demonstration
const mockSortingSteps = {
  bubbleSort: [
    // Array of predefined steps showing how bubble sort works
    { array: [5, 3, 8, 4, 2], compare: [0, 1], swap: null },
    { array: [3, 5, 8, 4, 2], compare: [1, 2], swap: [0, 1] },
    // ... more steps
  ],
  // Add mock steps for other algorithms
};

// Replace Socket.IO connection with mock functions
const mockSocket = {
  on: (event, callback) => {
    // Store callbacks for manual triggering
    mockSocket.callbacks[event] = callback;
  },
  emit: (event, data) => {
    console.log(`Mock emit: ${event}`, data);
    // Simulate server response
    if (event === "startSort") {
      const { algorithm } = data;
      // Simulate sorting steps with setTimeout
      mockSortingSteps[algorithm].forEach((step, index) => {
        setTimeout(() => {
          mockSocket.callbacks["sortStep"](step);

          // Emit completion after last step
          if (index === mockSortingSteps[algorithm].length - 1) {
            mockSocket.callbacks["sortComplete"]({ array: step.array });
          }
        }, index * 500);
      });
    }
  },
  callbacks: {},
};

// Replace the real socket with our mock
const socket = mockSocket;

// The rest of your visualization code remains the same
```

4. Update your `index.html` to use the static demo script instead of Socket.IO:

```html
<!-- Replace this line -->
<script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
<script src="script.js"></script>

<!-- With these lines for the static demo -->
<script src="static-demo.js"></script>
```

## Deploying to GitHub Pages

1. Push your static version to the gh-pages branch:

```bash
git add .
git commit -m "Add static demo for GitHub Pages"
git push origin gh-pages
```

2. Go to your GitHub repository settings:

   - Navigate to "Settings" > "Pages"
   - Under "Source", select the "gh-pages" branch
   - Click "Save"

3. GitHub will provide you with a URL where your static demo is published (usually `https://yourusername.github.io/sorting-visualizer/`)

## Important Notes

- This static version is for demonstration purposes only
- It doesn't include the actual sorting algorithms running in real-time
- For the full experience with real-time sorting, deploy the complete application to a platform that supports Node.js (Heroku, Render, Railway, etc.)

## Alternative: Use GitHub Pages with a Backend Service

You can also:

1. Deploy the static frontend to GitHub Pages
2. Deploy the backend server to a service like Heroku
3. Update the frontend code to connect to your deployed backend

This way, you get the benefits of free hosting for your frontend on GitHub Pages while still having the full functionality with a real backend.

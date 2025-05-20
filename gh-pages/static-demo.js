// DOM Elements
const algoButtons = document.querySelectorAll(".algo-btn");
const arrayInput = document.getElementById("array-input");
const speedButtons = document.querySelectorAll(".speed-btn");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const randomizeButton = document.getElementById("randomize");
const barsContainer = document.getElementById("bars-container");
const barLabels = document.getElementById("bar-labels");
const comparisonsElement = document.getElementById("comparisons");
const swapsElement = document.getElementById("swaps");

// Mock Socket.IO connection for GitHub Pages demo
const socket = {
  callbacks: {},
  on: function (event, callback) {
    this.callbacks[event] = callback;
  },
  emit: function (event, data) {
    console.log(`Mock emit: ${event}`, data);

    if (event === "startSort") {
      const { algorithm, array, speed } = data;

      // Generate sorting steps based on the algorithm
      const steps = generateSortingSteps(algorithm, array);

      // Calculate delay based on speed
      const delay =
        {
          slow: 1000,
          medium: 500,
          fast: 100,
          ultrafast: 10,
        }[speed] || 500;

      // Simulate server sending steps with timeouts
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        if (isPaused) return;

        if (stepIndex < steps.length) {
          this.callbacks["sortStep"](steps[stepIndex]);
          stepIndex++;
        } else {
          clearInterval(stepInterval);
          this.callbacks["sortComplete"]({
            array: [...array].sort((a, b) => a - b),
          });
        }
      }, delay);

      // Store the interval for pause functionality
      this.currentInterval = stepInterval;
    } else if (event === "pauseSort") {
      isPaused = true;
    } else if (event === "resumeSort") {
      isPaused = false;
    }
  },
};

// State
let isSorting = false;
let isPaused = false;
let comparisons = 0;
let swaps = 0;
let currentAlgo = "bubbleSort";
let currentSpeed = "medium";
let currentArray = [];
let stepBuffer = [];
let processingStep = false;

// Algorithm button click handler
algoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isSorting) return;
    algoButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentAlgo = button.dataset.algo;
  });
});

// Speed button click handler
speedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isSorting) return;
    speedButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentSpeed = button.dataset.speed;
  });
});

// Render bars and labels (no number inside bar)
function renderBars(array, compare, swap) {
  barsContainer.innerHTML = "";
  barLabels.innerHTML = "";
  const maxValue = Math.max(...array);
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / maxValue) * 100}%`;
    if (compare && (index === compare[0] || index === compare[1]))
      bar.classList.add("comparing");
    if (swap && (index === swap[0] || index === swap[1]))
      bar.classList.add("swapping");
    barsContainer.appendChild(bar);
    // Label below
    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = value;
    barLabels.appendChild(label);
  });
}

// Update stats
function updateStats(newComparisons, newSwaps) {
  comparisons = newComparisons;
  swaps = newSwaps;
  comparisonsElement.textContent = comparisons;
  swapsElement.textContent = swaps;
}

// Start button
startButton.addEventListener("click", () => {
  if (isSorting) return;
  const array = arrayInput.value
    .split(",")
    .map((num) => parseInt(num.trim()))
    .filter((num) => !isNaN(num));
  if (array.length === 0 || array.length > 20) {
    alert("Please enter 1-20 numbers, separated by commas");
    return;
  }
  isSorting = true;
  isPaused = false;
  startButton.disabled = true;
  pauseButton.disabled = false;
  randomizeButton.disabled = true;
  algoButtons.forEach((btn) => (btn.disabled = true));
  speedButtons.forEach((r) => (r.disabled = true));
  updateStats(0, 0);
  currentArray = array;
  renderBars(array);
  socket.emit("startSort", {
    algorithm: currentAlgo,
    array: array,
    speed: currentSpeed,
  });
});

// Randomize button
randomizeButton.addEventListener("click", () => {
  if (isSorting) return;
  initializeRandomArray();
});

// Process next step from buffer
async function processNextStep() {
  if (processingStep || isPaused || stepBuffer.length === 0) return;
  processingStep = true;
  const { array, compare, swap } = stepBuffer.shift();
  renderBars(array, compare, swap);
  if (compare) comparisons++;
  if (swap) swaps++;
  updateStats(comparisons, swaps);
  // Wait for the next animation frame for smoothness
  await new Promise((r) => requestAnimationFrame(r));
  processingStep = false;
  if (!isPaused) processNextStep();
}

// Socket.IO event handlers
socket.on("sortStep", (step) => {
  stepBuffer.push(step);
  if (!isPaused) processNextStep();
});

socket.on("sortComplete", ({ array }) => {
  stepBuffer = [];
  processingStep = false;
  // Ensure bars are shown in sorted order
  const sorted = [...array].sort((a, b) => a - b);
  renderBars(sorted);
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar) => {
    bar.classList.add("sorted");
  });
  isSorting = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  randomizeButton.disabled = false;
  algoButtons.forEach((btn) => (btn.disabled = false));
  speedButtons.forEach((r) => (r.disabled = false));
});

socket.on("sortError", ({ message }) => {
  stepBuffer = [];
  processingStep = false;
  alert(`Error: ${message}`);
  isSorting = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
  randomizeButton.disabled = false;
  algoButtons.forEach((btn) => (btn.disabled = false));
  speedButtons.forEach((r) => (r.disabled = false));
});

// Pause button (frontend logic, backend support needed)
pauseButton.addEventListener("click", () => {
  if (!isSorting) return;
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Resume" : "Pause";
  socket.emit(isPaused ? "pauseSort" : "resumeSort");
  if (!isPaused) processNextStep();
});

// Initialize with random array
function initializeRandomArray() {
  const size = 10;
  const array = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1
  );
  arrayInput.value = array.join(",");
  renderBars(array);
}

// Generate mock sorting steps for the static demo
function generateSortingSteps(algorithm, array) {
  const steps = [];
  const arr = [...array];

  // Simple bubble sort implementation for demo
  if (algorithm === "bubbleSort") {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Add comparison step
        steps.push({
          array: [...arr],
          compare: [j, j + 1],
          swap: null,
        });

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

          // Add swap step
          steps.push({
            array: [...arr],
            compare: [j, j + 1],
            swap: [j, j + 1],
          });
        }
      }
    }
  } else {
    // For other algorithms, just create a simple animation
    // In a real implementation, you would add proper algorithm logic here
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      // Add some random comparisons
      const j = Math.floor(Math.random() * (n - 1));
      steps.push({
        array: [...arr],
        compare: [j, j + 1],
        swap: null,
      });

      // Sometimes swap
      if (Math.random() > 0.5) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          compare: [j, j + 1],
          swap: [j, j + 1],
        });
      }
    }

    // Add final sorted array
    const sorted = [...array].sort((a, b) => a - b);
    for (let i = 0; i < n; i++) {
      arr[i] = sorted[i];
      steps.push({
        array: [...arr],
        compare: null,
        swap: null,
      });
    }
  }

  return steps;
}

// Add a notice that this is a static demo
window.addEventListener("DOMContentLoaded", () => {
  const notice = document.createElement("div");
  notice.style.position = "fixed";
  notice.style.bottom = "10px";
  notice.style.right = "10px";
  notice.style.background = "rgba(0,0,0,0.7)";
  notice.style.color = "white";
  notice.style.padding = "8px 12px";
  notice.style.borderRadius = "4px";
  notice.style.fontSize = "14px";
  notice.style.zIndex = "1000";
  notice.textContent = "Static Demo (GitHub Pages)";
  document.body.appendChild(notice);
});

initializeRandomArray();
pauseButton.disabled = true;

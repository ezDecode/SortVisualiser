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

// Socket.IO connection with error handling
const socket = io({
  reconnectionAttempts: 5,
  timeout: 10000,
  transports: ["websocket", "polling"],
});

// Handle connection errors
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  alert("Failed to connect to server. Please refresh the page.");
});

// State
let isSorting = false;
let isPaused = false;
let comparisons = 0;
let swaps = 0;
let currentAlgo = "bubbleSort";
let currentSpeed = "medium";
let currentArray = [];
let pauseResolver = null;
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
  // Use the final sorted array from the server
  renderBars(array);
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
  const size = Math.floor(Math.random() * 6) + 8; // Random size between 8-13

  // Generate array with more diverse values
  const array = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1
  );

  // Ensure some duplicates for interesting sorting scenarios
  if (size > 8) {
    const duplicateIndex = Math.floor(Math.random() * (size - 1));
    array[duplicateIndex + 1] = array[duplicateIndex];
  }

  // Ensure some values are already in order
  if (Math.random() > 0.5 && size > 5) {
    const orderStart = Math.floor(Math.random() * (size - 3));
    for (let i = 0; i < 3; i++) {
      array[orderStart + i] = 20 + i * 5;
    }
  }

  arrayInput.value = array.join(",");
  renderBars(array);
}

initializeRandomArray();
pauseButton.disabled = true;

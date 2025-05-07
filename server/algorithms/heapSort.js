/**
 * Heap Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function heapSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, onStep, delay);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    onStep({
      array: [...arr],
      compare: [0, i],
      swap: [0, i],
    });

    [arr[0], arr[i]] = [arr[i], arr[0]];
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Call max heapify on the reduced heap
    await heapify(arr, i, 0, onStep, delay);
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
}

/**
 * Heapify a subtree rooted with node i
 */
async function heapify(arr, n, i, onStep, delay) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Compare with left child
  if (left < n) {
    onStep({
      array: [...arr],
      compare: [largest, left],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  // Compare with right child
  if (right < n) {
    onStep({
      array: [...arr],
      compare: [largest, right],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  // If largest is not root
  if (largest !== i) {
    onStep({
      array: [...arr],
      compare: [i, largest],
      swap: [i, largest],
    });

    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Recursively heapify the affected sub-tree
    await heapify(arr, n, largest, onStep, delay);
  }
}

module.exports = heapSort;

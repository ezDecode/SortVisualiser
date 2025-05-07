/**
 * Quick Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function quickSort(array, onStep, delay) {
  const arr = [...array];
  await quickSortHelper(arr, 0, arr.length - 1, onStep, delay);
}

/**
 * Helper function for Quick Sort
 */
async function quickSortHelper(arr, low, high, onStep, delay) {
  if (low < high) {
    const pivotIndex = await partition(arr, low, high, onStep, delay);
    await quickSortHelper(arr, low, pivotIndex - 1, onStep, delay);
    await quickSortHelper(arr, pivotIndex + 1, high, onStep, delay);
  }
}

/**
 * Partition function for Quick Sort
 */
async function partition(arr, low, high, onStep, delay) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    // Emit comparison step
    onStep({
      array: [...arr],
      compare: [j, high],
      swap: null,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (arr[j] <= pivot) {
      i++;

      // Emit swap step
      onStep({
        array: [...arr],
        compare: [j, high],
        swap: [i, j],
      });

      [arr[i], arr[j]] = [arr[j], arr[i]];
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Final swap with pivot
  onStep({
    array: [...arr],
    compare: [i + 1, high],
    swap: [i + 1, high],
  });

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  await new Promise((resolve) => setTimeout(resolve, delay));

  return i + 1;
}

module.exports = quickSort;

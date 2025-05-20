/**
 * Bubble Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function bubbleSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Emit comparison step
      await onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: null,
      });

      // Wait for delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        // Emit swap step
        await onStep({
          array: [...arr],
          compare: [j, j + 1],
          swap: [j, j + 1],
        });

        // Wait for delay
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // If no swapping occurred in this pass, array is sorted
    if (!swapped) {
      break;
    }
  }

  // Emit final sorted array
  await onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
}

module.exports = bubbleSort;

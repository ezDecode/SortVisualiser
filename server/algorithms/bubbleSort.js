/**
 * Bubble Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function bubbleSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Emit comparison step
      onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: null,
      });

      // Wait for delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        // Emit swap step
        onStep({
          array: [...arr],
          compare: [j, j + 1],
          swap: [j, j + 1],
        });

        // Wait for delay
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
}

module.exports = bubbleSort;

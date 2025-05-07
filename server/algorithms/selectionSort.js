/**
 * Selection Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function selectionSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find minimum element in unsorted array
    for (let j = i + 1; j < n; j++) {
      // Emit comparison step
      onStep({
        array: [...arr],
        compare: [minIdx, j],
        swap: null,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap the found minimum element with the first element
    if (minIdx !== i) {
      // Emit swap step
      onStep({
        array: [...arr],
        compare: [i, minIdx],
        swap: [i, minIdx],
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
}

module.exports = selectionSort;

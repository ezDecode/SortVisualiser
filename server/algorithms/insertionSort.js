/**
 * Insertion Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function insertionSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Emit comparison step
    onStep({
      array: [...arr],
      compare: [i, j],
      swap: null,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    // Move elements that are greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      // Emit comparison step
      onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: null,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      arr[j + 1] = arr[j];

      // Emit swap step
      onStep({
        array: [...arr],
        compare: [j, j + 1],
        swap: [j, j + 1],
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      j--;
    }
    arr[j + 1] = key;

    // Emit final position update
    onStep({
      array: [...arr],
      compare: null,
      swap: [j + 1, j + 1],
    });

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
}

module.exports = insertionSort;

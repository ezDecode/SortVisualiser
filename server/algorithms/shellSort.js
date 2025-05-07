/**
 * Shell Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function shellSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      // Save arr[i] in temp and make a hole at position i
      const temp = arr[i];
      let j;

      // Shift earlier gap-sorted elements up until the correct location for arr[i] is found
      for (j = i; j >= gap; j -= gap) {
        // Emit comparison step
        onStep({
          array: [...arr],
          compare: [j - gap, i],
          swap: null,
        });

        await new Promise((resolve) => setTimeout(resolve, delay));

        if (arr[j - gap] > temp) {
          // Emit swap step
          onStep({
            array: [...arr],
            compare: [j - gap, j],
            swap: [j, j - gap],
          });

          arr[j] = arr[j - gap];
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }

      // Put temp (the original arr[i]) in its correct location
      if (j !== i) {
        arr[j] = temp;
        // Emit final position update
        onStep({
          array: [...arr],
          compare: null,
          swap: [j, j],
        });
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

module.exports = shellSort;

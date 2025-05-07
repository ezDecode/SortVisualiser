/**
 * Counting Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function countingSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Find the maximum element
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  // Create count array and output array
  const count = new Array(range).fill(0);
  const output = new Array(n).fill(0);

  // Store count of each element
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;

    // Emit counting step
    onStep({
      array: [...arr],
      compare: [i, i],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Change count[i] so that count[i] now contains actual position of this element in output array
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const value = arr[i] - min;
    const position = count[value] - 1;

    output[position] = arr[i];
    count[value]--;

    // Emit placement step
    onStep({
      array: [...output],
      compare: [i, position],
      swap: [position, position],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Copy the output array to arr
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];

    // Emit final position update
    onStep({
      array: [...arr],
      compare: null,
      swap: [i, i],
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

module.exports = countingSort;

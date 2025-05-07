/**
 * Radix Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function radixSort(array, onStep, delay) {
  const arr = [...array];
  const n = arr.length;

  // Find the maximum number to know number of digits
  const max = Math.max(...arr);

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(arr, n, exp, onStep, delay);
  }

  // Emit final sorted array
  onStep({
    array: [...arr],
    compare: null,
    swap: null,
  });
}

/**
 * A function to do counting sort of arr[] according to the digit represented by exp
 */
async function countingSortForRadix(arr, n, exp, onStep, delay) {
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  // Store count of occurrences in count[]
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;

    // Emit counting step
    onStep({
      array: [...arr],
      compare: [i, i],
      swap: null,
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Change count[i] so that count[i] now contains actual position of this digit in output[]
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    const position = count[digit] - 1;

    output[position] = arr[i];
    count[digit]--;

    // Emit placement step
    onStep({
      array: [...output],
      compare: [i, position],
      swap: [position, position],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Copy the output array to arr[]
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
}

module.exports = radixSort;

/**
 * Merge Sort implementation with step-by-step visualization
 * @param {number[]} array - Array to sort
 * @param {function} onStep - Callback function for each step
 * @param {number} delay - Delay between steps in milliseconds
 */
async function mergeSort(array, onStep, delay) {
  const arr = [...array];
  await mergeSortHelper(arr, 0, arr.length - 1, onStep, delay);
}

/**
 * Helper function for Merge Sort
 */
async function mergeSortHelper(arr, left, right, onStep, delay) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Sort first and second halves
    await mergeSortHelper(arr, left, mid, onStep, delay);
    await mergeSortHelper(arr, mid + 1, right, onStep, delay);

    // Merge the sorted halves
    await merge(arr, left, mid, right, onStep, delay);
  }
}

/**
 * Merge function for Merge Sort
 */
async function merge(arr, left, mid, right, onStep, delay) {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  // Create temporary arrays
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;

  // Merge the temporary arrays back
  while (i < n1 && j < n2) {
    // Emit comparison step
    onStep({
      array: [...arr],
      compare: [left + i, mid + 1 + j],
      swap: null,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }

    // Emit update step
    onStep({
      array: [...arr],
      compare: null,
      swap: [k, k],
    });

    await new Promise((resolve) => setTimeout(resolve, delay));
    k++;
  }

  // Copy remaining elements
  while (i < n1) {
    arr[k] = L[i];
    onStep({
      array: [...arr],
      compare: null,
      swap: [k, k],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    onStep({
      array: [...arr],
      compare: null,
      swap: [k, k],
    });
    await new Promise((resolve) => setTimeout(resolve, delay));
    j++;
    k++;
  }
}

module.exports = mergeSort;

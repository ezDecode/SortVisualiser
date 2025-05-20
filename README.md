# Sorting Algorithm Visualizer

An interactive web application that visualizes various sorting algorithms in real-time. Watch how different sorting algorithms work and compare their performance through an intuitive visual interface.

## Features

- **Multiple Sorting Algorithms:**

  - Bubble Sort
  - Quick Sort
  - Merge Sort
  - Insertion Sort
  - Selection Sort
  - Heap Sort
  - Shell Sort
  - Counting Sort
  - Radix Sort

- **Interactive Controls:**

  - Custom array input
  - Random array generation
  - Adjustable sorting speed (Slow, Medium, Fast)
  - Pause/Resume functionality

- **Real-time Visualization:**
  - Step-by-step sorting process
  - Comparison and swap highlighting
  - Performance metrics (comparisons and swaps)
  - Bar height representation of values
  - Sorted graph display after algorithm completion

## Technologies Used

- **Frontend:**

  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Socket.IO Client

- **Backend:**
  - Node.js
  - Express.js
  - Socket.IO

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ezDecode/SortVisualiser.git
   cd SortVisualiser
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server/server.js
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Input Array:**

   - Enter numbers manually (comma-separated)
   - Use the "Randomize" button to generate a random array
   - Maximum 20 numbers allowed

2. **Select Algorithm:**

   - Choose from 9 different sorting algorithms
   - Each algorithm has its own visualization pattern

3. **Adjust Speed:**

   - Slow: 1000ms delay
   - Medium: 500ms delay
   - Fast: 100ms delay

4. **Start Sorting:**
   - Click "Start" to begin visualization
   - Use "Pause" to pause the sorting process
   - Watch the comparisons and swaps in real-time
   - View the final sorted graph after algorithm completion

## Project Structure

```
SortVisualiser/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── fonts/
├── server/
│   ├── server.js
│   └── algorithms/
│       ├── bubbleSort.js
│       ├── quickSort.js
│       ├── mergeSort.js
│       ├── insertionSort.js
│       ├── selectionSort.js
│       ├── heapSort.js
│       ├── shellSort.js
│       ├── countingSort.js
│       └── radixSort.js
├── package.json
├── package-lock.json
├── .gitignore
├── LICENSE
└── vercel.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various sorting algorithm visualizations
- Built with modern web technologies
- Special thanks to the open-source community

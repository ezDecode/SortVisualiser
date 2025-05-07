# 🧮 Sorting Algorithm Visualizer

A real-time web-based visualization tool for sorting algorithms, built with vanilla JavaScript, Node.js, Express, and Socket.IO. This interactive application helps you understand how different sorting algorithms work by providing step-by-step visual representations.

![Sorting Algorithm Visualizer](https://img.shields.io/badge/Sorting-Visualizer-3498db.svg)
![License](https://img.shields.io/badge/License-MIT-2ecc71.svg)

## ✨ Features

- **Interactive Visualization** of sorting algorithms in real-time
- **Multiple Algorithms** supported:
  - Bubble Sort
  - Quick Sort
  - Merge Sort
- **Real-time Updates** using WebSocket communication via Socket.IO
- **Customizable Input** - create your own arrays or generate random ones
- **Adjustable Speed** - slow, medium, or fast visualization
- **Pause & Resume** functionality to study the sorting process
- **Statistics Tracking** - monitor comparisons and swaps in real-time
- **Responsive Design** with smooth animations for all device sizes
- **GitHub Pages Support** with automatic synchronization

## 🚀 Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sorting-visualizer.git
cd sorting-visualizer
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

## 💻 Development

For development with auto-reload:

```bash
npm run dev
```

To sync changes from docs/ to GitHub Pages deployment:

```bash
npm run sync-docs
```

## 🔍 How It Works

The application uses a client-server architecture:

### Backend (Node.js + Express + Socket.IO)

- The server hosts the static files and provides real-time communication through WebSockets
- Each sorting algorithm is implemented as a separate module in the `server/algorithms` directory
- The server processes sorting operations and emits step-by-step updates to clients
- Sorting operations can be paused and resumed through Socket.IO events

### Frontend (HTML + CSS + JavaScript + Socket.IO Client)

- The UI provides controls for array input, algorithm selection, and visualization speed
- Bars represent array elements with heights proportional to their values
- Color-coding indicates the current state of elements:
  - Blue: Default state
  - Red: Elements being compared
  - Yellow: Elements being swapped
  - Green: Sorted elements
- Real-time statistics show the number of comparisons and swaps performed

## 📖 Algorithm Details

### Bubble Sort

- Time Complexity: O(n²)
- Space Complexity: O(1)
- A simple comparison algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

### Quick Sort

- Time Complexity: O(n log n) average, O(n²) worst case
- Space Complexity: O(log n)
- Uses a divide-and-conquer strategy with a pivot element to partition the array.

### Merge Sort

- Time Complexity: O(n log n)
- Space Complexity: O(n)
- A stable, divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them.

## 📱 Usage

1. Enter numbers in the input field (comma-separated, max 20 elements)
2. Select a sorting algorithm (Bubble Sort, Quick Sort, or Merge Sort)
3. Choose sorting speed (Slow, Medium, or Fast)
4. Click "Start" to begin visualization
5. Use "Pause/Resume" to control the process
6. Monitor comparisons and swaps in real-time
7. Click "Randomize" to generate a new random array

## 🛠️ Technologies Used

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Fonts**: Satoshi-Medium (custom font for better UI)
- **Deployment**: GitHub Pages compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

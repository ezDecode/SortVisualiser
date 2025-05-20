/**
 * Script to prepare files for GitHub Pages deployment
 *
 * This script:
 * 1. Creates a 'gh-pages' directory
 * 2. Copies all necessary files for the static demo
 * 3. Renames index-static.html to index.html
 */

const fs = require("fs");
const path = require("path");

// Create gh-pages directory if it doesn't exist
const ghPagesDir = path.join(__dirname, "gh-pages");
if (!fs.existsSync(ghPagesDir)) {
  fs.mkdirSync(ghPagesDir);
  console.log("Created gh-pages directory");
}

// Copy public files to gh-pages directory
const publicDir = path.join(__dirname, "public");
const filesToCopy = ["styles.css", "static-demo.js", "index-static.html"];

// Copy each file
filesToCopy.forEach((file) => {
  const sourcePath = path.join(publicDir, file);
  const destPath = path.join(
    ghPagesDir,
    file === "index-static.html" ? "index.html" : file
  );

  try {
    const content = fs.readFileSync(sourcePath, "utf8");
    fs.writeFileSync(destPath, content, "utf8");
    console.log(
      `Copied ${file} to gh-pages directory${
        file === "index-static.html" ? " (renamed to index.html)" : ""
      }`
    );
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
  }
});

// Copy fonts directory if it exists
const fontsDir = path.join(publicDir, "fonts");
const ghPagesFontsDir = path.join(ghPagesDir, "fonts");

if (fs.existsSync(fontsDir)) {
  // Create fonts directory in gh-pages if it doesn't exist
  if (!fs.existsSync(ghPagesFontsDir)) {
    fs.mkdirSync(ghPagesFontsDir);
  }

  // Copy font files
  const fontFiles = fs.readdirSync(fontsDir);
  fontFiles.forEach((file) => {
    const sourcePath = path.join(fontsDir, file);
    const destPath = path.join(ghPagesFontsDir, file);

    try {
      const content = fs.readFileSync(sourcePath);
      fs.writeFileSync(destPath, content);
      console.log(`Copied font file ${file} to gh-pages/fonts directory`);
    } catch (error) {
      console.error(`Error copying font file ${file}:`, error);
    }
  });
}

console.log("\nGitHub Pages files prepared successfully!");
console.log("\nTo deploy to GitHub Pages:");
console.log("1. Commit these changes");
console.log("2. Push the gh-pages directory contents to the gh-pages branch:");
console.log("   git subtree push --prefix gh-pages origin gh-pages");
console.log("\nOr manually:");
console.log(
  "1. Create and checkout a gh-pages branch: git checkout -b gh-pages"
);
console.log("2. Copy the contents of the gh-pages directory to the root");
console.log("3. Commit and push to GitHub");
console.log("4. Go back to your main branch: git checkout main");

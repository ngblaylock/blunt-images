const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2); // The first two items are 'node' and 'index.js'
const configFilePath = args[0];

if (!configFilePath) {
  console.error("Usage: node index.js -f /path/to/config/file.js");
  process.exit(1);
}

const config = require(configFilePath);
console.log(config);

// Array of folder paths to watch
const folderPaths = ["./images", "./other_images"];

// Function to log the path of the added picture file
function logAddedPicture(filePath) {
  console.log("Added picture:", filePath);
}

// Function to check if a file has a valid image extension
function isImageFile(fileName) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
}

// Function to handle changes in the folder
function handleFolderChange(folderPath, eventType, fileName) {
  if (eventType === "rename" && fileName) {
    const filePath = path.join(folderPath, fileName);
    // Check if the added item is a file and has a valid image extension
    fs.promises
      .stat(filePath)
      .then((stats) => {
        if (stats.isFile() && isImageFile(fileName)) {
          logAddedPicture(filePath);
        }
      })
      .catch((err) => {
        console.error("Error reading file stats:", err);
      });
  }
}

// Watch each folder path for changes
folderPaths.forEach((folderPath) => {
  fs.promises.watch(
    folderPath,
    { encoding: "utf-8" },
    (eventType, fileName) => {
      handleFolderChange(folderPath, eventType, fileName);
    }
  );
});

console.log(
  `Watching folders ${folderPaths.join(", ")} for picture additions...`
);

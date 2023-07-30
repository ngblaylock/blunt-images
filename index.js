const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const args = process.argv.slice(2); // The first two items are 'node' and 'index.js'
const configFilePath = args[0];

if (!configFilePath) {
  console.error("Usage: node index.js -f /path/to/config/file.js");
  process.exit(1);
}

const bluntConfig = require(configFilePath);

// Get the directory of the config file
const configDir = path.dirname(configFilePath);


// Function to check if a file has a valid image extension
function isImageFile(fileName) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
}

// Watch each folder path for changes using chokidar
bluntConfig.forEach((config) => {
  const absoluteInputPath = path.resolve(configDir, config.input);
  console.log(absoluteInputPath);
  console.log(
    `Watching folders ${absoluteInputPath} for picture additions...`
  );

  // Create the chokidar watcher for each folder path
  const watcher = chokidar.watch(absoluteInputPath, { ignored: /^\./, persistent: true });

  // Add event listeners for 'add' and 'unlink' events
  watcher.on("add", (filePath) => {
    // Check if the added item is a file and has a valid image extension
    const fileName = path.basename(filePath);
    if (fs.existsSync(filePath) && isImageFile(fileName)) {
      console.log("Added picture:", filePath, config);
    }
  });

  watcher.on("unlink", (filePath) => {
    console.log("File removed:", filePath);
  });
});

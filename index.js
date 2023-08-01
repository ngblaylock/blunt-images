const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const sharp = require("sharp");
const fsExtra = require("fs-extra");
const args = process.argv.slice(2);
const configFilePath = args[0];

if (!configFilePath) {
  console.error("Usage: node index.js -f /path/to/config/file.js");
  process.exit(1);
}

const bluntConfig = require(configFilePath);

// Get the directory of the config file
const configDir = path.dirname(configFilePath);

// Delete all output folders before running the script to start with a blank slate.
bluntConfig.forEach((config) => {
  const outputDir = path.resolve(configDir, config.output);
  if (fs.existsSync(outputDir)) {
    fsExtra.removeSync(outputDir);
    console.log(`Deleted output folder: ${outputDir}`);
  }
});

// Function to check if a file has a valid image extension
const isImageFile = (fileName) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
};

const runSharp = (filePath, config) => {
  console.log("Running sharp on ", filePath);
  const fileName = path.basename(filePath);
  const outputDir = path.resolve(configDir, config.output);
  
  // Check if the output directory exists; if not, create it
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (err) {
      console.error("Error creating output directory:", err);
      return;
    }
  }
  
  config.sizes.forEach(size => {
    options = {...config, ...size }
    console.log(options);
    if(!options.prefix){
      options.prefix = (options.width || '') + (options.width && options.height ? 'x' : '') + (options.height || '');
    }
    const outputPath = path.join(outputDir, `${options.prefix}_${fileName}`);
    
    sharp(filePath)
      .resize(options)
      .toFile(outputPath, (err) => {
        if (err) {
          console.error("Error processing image:", err);
        } else {
          console.log("Image saved at:", outputPath);
        }
      });
  })
};

// Watch each folder path for changes using chokidar
bluntConfig.forEach((config) => {
  const absoluteInputPath = path.resolve(configDir, config.input);
  console.log(absoluteInputPath);
  console.log(`Watching folders ${absoluteInputPath} for picture additions...`);

  // Create the chokidar watcher for each folder path
  const watcher = chokidar.watch(absoluteInputPath, {
    ignored: /^\./,
    persistent: true,
  });

  // Add event listeners for 'add' and 'unlink' events
  watcher.on("add", (filePath) => {
    // Check if the added item is a file and has a valid image extension
    const fileName = path.basename(filePath);
    if (fs.existsSync(filePath) && isImageFile(fileName)) {
      runSharp(filePath, config);
    }
  });

  watcher.on("unlink", (filePath) => {
    console.log("File removed:", filePath);
  });
});

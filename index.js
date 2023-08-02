const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const sharp = require("sharp");
const chalk = require('chalk');
const fsExtra = require("fs-extra");
const args = process.argv.slice(2);
const configFilePath = args[0];

if (!configFilePath) {
  console.error(chalk.red("Usage: node /path/to/@ngblaylock/blunt-images /path/to/config/file.js"));
  process.exit(1);
}

// Resolve the absolute path of the config file relative to the current working directory
const resolvedConfigFilePath = path.resolve(process.cwd(), configFilePath);
const bluntConfig = require(resolvedConfigFilePath);

// Get the directory of the config file
const configDir = path.dirname(resolvedConfigFilePath);

// Delete all output folders before running the script to start with a blank slate.
bluntConfig.forEach((config) => {
  const outputDir = path.resolve(configDir, config.output);
  if (fs.existsSync(outputDir)) {
    fsExtra.removeSync(outputDir);
    console.info(chalk.blue(`Resetting output folder:`), outputDir);
  }
});

// Function to check if a file has a valid image extension
const isImageFile = (fileName) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
};

const runSharp = (filePath, config) => {
  const fileName = path.basename(filePath);
  const outputDir = path.resolve(configDir, config.output);
  
  // Check if the output directory exists; if not, create it
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (err) {
      console.error(chalk.red("Error creating output directory:", err));
      return;
    }
  }
  
  config.sizes.forEach(size => {
    options = {...config, ...size }
    if(!options.prefix){
      options.prefix = (options.width || '') + (options.width && options.height ? 'x' : '') + (options.height || '');
    }
    const outputPath = path.join(outputDir, `${options.prefix}_${fileName}`);
    
    sharp(filePath)
      .resize(options)
      .toFile(outputPath, (err) => {
        if (err) {
          console.error(chalk.red("Error processing image:"), err);
        } else {
          console.info(chalk.green("Image saved:"), outputPath);
        }
      });
  })
};

// Watch each folder path for changes using chokidar
bluntConfig.forEach((config) => {
  const absoluteInputPath = path.resolve(configDir, config.input);
  console.info(chalk.magenta(`Watching folders:`), absoluteInputPath);

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
    console.info(chalk.yellow("File removed:"), filePath);
  });
});

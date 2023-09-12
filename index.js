const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const sharp = require("sharp");
const chalk = require("chalk");
const fsExtra = require("fs-extra");
const glob = require("glob").glob;
const args = process.argv.slice(2);
const configFilePath = args[0];
const watch = args.some((arg) => arg == "--watch" || arg == "-w");
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

if (!configFilePath) {
  console.error(
    chalk.red(
      "Usage: node /path/to/node_modules/@ngblaylock/blunt-images /path/to/config/file.js"
    )
  );
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
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
};

// This is where the sizes are created
const runSharp = (filePath, config) => {
  const fileName = path.basename(filePath);
  const inputDir = path.resolve(configDir, config.input);
  let outputDir = path.resolve(configDir, config.output);
  if (config.preserveFileStructure) {
    let joinedPath = filePath
      .replace(inputDir, "")
      .split("/")
      .slice(0, -1)
      .join("/");
    outputDir = path.join(outputDir, joinedPath);
  }

  // Check if the output directory exists; if not, create it
  if (!fs.existsSync(outputDir)) {
    try {
      fs.mkdirSync(outputDir, { recursive: true });
    } catch (err) {
      console.error(chalk.red("Error creating output directory:", err));
      return;
    }
  }

  if (config.includeOriginal) {
    const outputPath = path.join(outputDir, fileName);
    let fileFormat = path.extname(fileName).toLowerCase().split(".").pop();
    let toFormatOptions = { quality: 80, progressive: true };
    if (fileFormat === "jpeg" || fileFormat === "jpg") {
      toFormatOptions.mozjpeg = true;
      fileFormat === "jpeg";
    }
    sharp(filePath)
      .toFormat(fileFormat, toFormatOptions) // Adjust options as needed
      .toFile(outputPath, (err) => {
        if (err) {
          console.error(chalk.red("Error processing image:"), err);
        } else {
          console.info(chalk.green("Image saved:"), outputPath);
        }
      });
  }

  // For each size in the configuration, do the following.
  config.sizes.forEach((size) => {
    options = { ...config.sharpOptions, ...size };
    if (!options.prefix) {
      options.prefix =
        (options.width || "") +
        (options.width && options.height ? "x" : "") +
        (options.height || "");
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
  });
};

// Generate a JSON file for each set of images
const generateJson = (config) => {
  let data = [];
  const outputDir = path.resolve(configDir, config.output);
  let files = fs.readdirSync(outputDir).filter((file) => isImageFile(file));

  (async () => {
    const promises = files.map(async (file) => {
      const metadata = await sharp(path.join(outputDir, file)).metadata();
      return {
        filename: file,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      };
    });

    const data = await Promise.all(promises);

    const jsonData = JSON.stringify(data, null, 2);
    const outputPath = path.join(outputDir, "_metadata.json");

    fs.writeFile(outputPath, jsonData, "utf8", (err) => {
      if (err) {
        console.error(chalk.red("Error writing JSON file:", err));
      }
    });
  })();
};

// Watch each folder path for changes using chokidar
bluntConfig.forEach(async (config) => {
  const absoluteInputPath = path.resolve(configDir, config.input);

  if (watch) {
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
        setTimeout(() => {
          generateJson(config);
        }, 3000);
      }
    });

    watcher.on("unlink", (filePath) => {
      console.info(chalk.yellow("File removed:"), filePath);
      setTimeout(() => {
        generateJson(config);
      }, 3000);
    });
  } else {
    // Not Watching
    console.log("Get all nested files", absoluteInputPath);
    const pattern = imageExtensions.join(",").replaceAll(".", "");

    // Use glob to list image files recursively
    const imageFiles = await glob(`${absoluteInputPath}/**/*.{${pattern}}`);
    imageFiles.forEach((fileName) => {
      runSharp(fileName, config);
    });
    setTimeout(() => {
      generateJson(config);
    }, 3000);
  }
});

const fs = require('fs');
const path = require('path');

// Get the current working directory
const currentDir = process.cwd();

// Check if 'blunt.config.js' exists in the current directory
const configFilePath = path.join(currentDir, 'blunt.config.js');

if (fs.existsSync(configFilePath)) {
  console.log('blunt.config.js exists at:', configFilePath);
  // Do something with the config file, if needed
} else {
  console.error("blunt.config.js not found in the current directory.");
  process.exit(1);
}
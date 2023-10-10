const fs = require('fs');
const path = require('path');

const traverseDir = (dir, level = 0) => {
  // Get all files and folders in directory
  const files = fs.readdirSync(dir);

  // Log each file and folder
  files.forEach(file => {
    console.log('  '.repeat(level) + '├─ ' + file);

    // Check if it's a directory
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // Recurse into the folder
      traverseDir(filePath, level + 1);
    }
  });
};

exports.handler = async function (event, context) {
  const year = event.queryStringParameters.year;
  const dirPath = path.join(__dirname, "..", "images", year);

  // Log current directory
  console.log("Current directory: ", __dirname);
  fs.readdir(__dirname, (err, files) => {
    files.forEach(file => {
      console.log(" - ", file);
    });
  });

  // Log root directory
  console.log("\nRoot directory: ", process.cwd());
  fs.readdir(process.cwd(), (err, files) => {
    files.forEach(file => {
      console.log(" - ", file);
    });
  });

  // Log directory path
  console.log("\nYear Path: ", dirPath);

  // Log entire directory structure starting from root
  console.log("\nEntire Directory Structure:");
  traverseDir(process.cwd());

  try {
    const files = fs.readdirSync(dirPath);
    return {
      statusCode: 200,
      body: JSON.stringify(files)
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

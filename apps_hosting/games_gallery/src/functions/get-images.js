const fs = require('fs');
const path = require('path');

const traverseDir = (dir, level = 0) => {
  try {
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
  } catch (error) {
    if (error.code === 'EACCES') {
      console.warn(`⚠️ Warning: Permission denied to access ${dir}`);
    } else {
      console.error(`⚠️ Error reading ${dir}: ${error.message}`);
    }
  }
};

exports.handler = async function (event, context) {
  const year = event.queryStringParameters.year;
  

  // Log current directory
  console.log("Current directory: ", __dirname);
  const rootDirName = fs.readdirSync(__dirname);
  console.log(rootDirName);
  console.log("---")

  // Log current directory - 1
  const DirName_minus1 = path.join(__dirname, "..");
  console.log("Current directory - 1: ", DirName_minus1);
  const rootDirName_minus1 = fs.readdirSync(DirName_minus1);
  console.log(rootDirName_minus1);
  console.log("---")

  // Log root directory
  console.log("Root directory: ", process.cwd());
  const rootDirContent = fs.readdirSync(process.cwd());
  console.log(rootDirContent);
  console.log("---")

  // Log Year path
  const yearPath = path.join(__dirname, "..", "images", year);
  console.log("Year Path: ", yearPath);
  console.log("---")

  // Log Absolute Year path
  const absoluteYearPath = path.resolve(yearPath);
  console.log("Absolute Year Path:", absoluteYearPath);
  console.log("---")

  // Log entire directory structure starting from root
  // console.log("Entire Directory Structure (var):");
  // traverseDir(DirName_minus1);
  // console.log("---")

  try {
    const files = fs.readdirSync(yearPath);
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

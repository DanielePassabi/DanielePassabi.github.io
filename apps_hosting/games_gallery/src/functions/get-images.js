const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  const year = event.queryStringParameters.year;
  const dirPath = path.join(__dirname, "..", "images", year);
  console.log("dirPath: ", dirPath)

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

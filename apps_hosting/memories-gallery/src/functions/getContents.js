const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    let directory = event.queryStringParameters.directory || '';
    directory = directory.replace(/^\//, '');  // Remove leading slash if present

    const dirPath = path.join(__dirname, '../functions/pictures', directory);

    console.log(`Requested directory: ${directory}`);
    console.log(`Resolved path: ${dirPath}`);

    try {
        const contents = fs.readdirSync(dirPath).map(name => {
            const filePath = path.join(dirPath, name);
            const isDirectory = fs.statSync(filePath).isDirectory();
            return {
                name,
                type: isDirectory ? 'folder' : 'image'
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(contents)
        };
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to read directory' })
        };
    }
};

const fs = require("fs");
const PATH = require("path");
const mime = require("mime");


function getFiles(baseDir = "./") {
    const files = new Map();
    
    fs
        .readdirSync(baseDir)
        .forEach((fileName) => {
            const path = PATH.resolve(baseDir, fileName);
            const descriptor = fs.openSync(path, "r");
            const stat = fs.fstatSync(descriptor);
            const contentType = mime.getType(path);

            files.set(`/${fileName}`, {
                descriptor,
                headers: {
                    "content-length": stat.size,
                    "last-modified": stat.mtime.toUTCString(),
                    "content-type": contentType
                }
            });
        })

    return files;
}

module.exports = {
    getFiles
}

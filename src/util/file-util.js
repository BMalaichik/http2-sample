const fs = require("fs");
const path = require("path");
const mime = require("mime");


function getFiles(baseDir = "./") {
    const files = new WeakMap();
    
    fs
        .readdirSync(baseDir)
        .forEach((fileName) => {
            const path = fs.join(baseDir, fileName);
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

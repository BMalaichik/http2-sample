const path = require("path");
const fileUtil = require("../util/file-util");
const { HTTP2_HEADER_PATH } = require("http2");


const resources = fileUtil.getFiles("./res");
const INDEX_FILES = ["/bundle.js"];
const DEFAULT_RESOURCE = "/index.html";

function push(stream, path) {
    const file = resources.get(path);
    console.log("path: ", path);
    console.log(file);
    if (!file) {
        return;
    }

    stream.push({ [HTTP2_HEADER_PATH]: path }, (pushStream) => {
        pushStream.respondWithFD(file.descriptor, file.headers);
    });
}

function handleRequest(req) {
    const reqPath = req.path === "/" || !req.path ? DEFAULT_RESOURCE : req.path;
    const file = resources.get(reqPath);

    if (!file) {
        req.respond({
            'content-type': 'text/html',
            ':status': 404
          });
        req.end('<h1>Not found</h1>');

        return;
    }

    if (reqPath === "/index.html") {
        INDEX_FILES.forEach((file) => push(req, file));
    } else {
        req.respondWithFD(file.descriptor, file.headers);
    }
}


module.exports = {
    push,
    handleRequest
}

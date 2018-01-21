const path = require("path");
const fileUtil = require("../util/file-util");
const { HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = require("http2").constants;


const resources = fileUtil.getFiles("./res");
const INDEX_FILES = ["/bundle.js"];
const DEFAULT_RESOURCE = "/index.html";

function push(req, path) {
    const file = resources.get(path);

    if (!file) {
        return;
    }

    req.stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (pushStream) => {
        pushStream.respondWithFD(file.descriptor, file.headers);
    });
}

function handleRequest(req, res, next) {
    let reqPath = req.headers[HTTP2_HEADER_PATH];

    if (!reqPath || reqPath === "/") {
        reqPath = DEFAULT_RESOURCE;
    }

    const file = resources.get(reqPath);

    if (!file) {
        req.stream.respond({
            [HTTP2_HEADER_STATUS]: 404
        });
        req.stream.end(`${reqPath} not found :(`);

        return;
    }

    if (reqPath === "/index.html") {
        INDEX_FILES.forEach((file) => push(req, file));
    }

    req.stream.respondWithFD(file.descriptor, file.headers);
}


module.exports = {
    push,
    handleRequest
}

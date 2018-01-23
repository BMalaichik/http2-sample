const fs = require("fs");
const path = require("path");
const fileUtil = require("../util/file-util");
const { HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = require("http2").constants;


// TODO: replace getFiles impl with file read stream piped to response stream
// const resources = fileUtil.getFiles("./res");
const INDEX_FILES = ["/bundle.js"];
const DEFAULT_RESOURCE = "/index.html";

function push(req, res, path) {
    const fileStream = fileUtil.lookupFile(path);

    respond(req, res, path, fileStream);
}

function respond(req, res, path, fileStream) {
    if (!fileStream) {
        console.error("No stream provided to response");

        return;
    }


    res.stream.pushStream(
        {
            [HTTP2_HEADER_PATH]: path
        },
        (pushStream) => {
            fileStream.pipe(pushStream);
            fileStream.on("finish", pushStream.end)
        });

}

function handleRequest(req, res, next) {
    let reqPath = req.headers[HTTP2_HEADER_PATH];

    if (!reqPath || reqPath === "/") {
        reqPath = DEFAULT_RESOURCE;
    }

    const fileStream = fileUtil.lookupFile(reqPath);

    if (!fileStream) {
        req.stream.respond({
            [HTTP2_HEADER_STATUS]: 404
        });
        req.stream.end(`${reqPath} not found :(`);

        return;
    }

    if (reqPath === "/index.html") {
        INDEX_FILES.forEach((file) => push(req, res, file));
    }

    fileStream.pipe(req.stream);
    fileStream.on("finish", req.stream.end);
    // respond(req, res, reqPath, fileStream);
}


module.exports = {
    handleRequest
}

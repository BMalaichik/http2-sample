const path = require("path");
const fileUtil = require("../util/file-util");
const publicFiles = fileUtil.getFiles();

function push(stream, path) {
    const file = publicFiles.get(path);

    if (!file) {
        return;
    }

    stream.push({ [HTTP2_HEADER_PATH]: path }, (pushStream) => {
        pushStream.respondWithFD(file.descriptor, file.headers);
    });
}

function handleRequest(req, res, next) {
    const reqPath = req.path === "/" ? "/index.html" : req.path;
    const file = publicFiles.get(reqPath);

    if (!file) {
        res.status(404).send();

        return;
    }

    if (reqPath === "/index.html") {
        INDEX_FILES.forEach((file) => push(res.stream, file));
    }
}


module.exports = {
    push,
    handleRequest
}

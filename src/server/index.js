const http2, { HTTP2_HEADER_PATH } = require("http2");
const { handleRequest, push } = require("./util");

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, "../res");

const server = http2.createServer(handleRequest);
const INDEX_FILES = ["/bundle.js"];

server.listen(PORT, (err) => {
    if (err) throw err;

    console.log("listening on " + PORT);
});

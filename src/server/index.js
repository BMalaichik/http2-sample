const fs = require("fs");
const PATH  = require("path");
const http2 = require("http2");
const { handleRequest, push } = require("./util");


const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = PATH.join(__dirname, "../res");

const server = http2.createSecureServer({
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem')
}, handleRequest);


server.listen(PORT, (err) => {
    if (err) throw err;

    console.log("listening on " + PORT);
});

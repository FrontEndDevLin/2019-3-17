/**
 * Created by X on 2019/3/17
 */

function HttpAPIServEntry() {
    this.NetStart = function () {
        const http = require("http");
        let HTTPAPIHandle = require("./HTTPAPIHandle");
        let port = require("./ConfigParser").Parse("port", "http-API");

        http.createServer((req, res) => {
            HTTPAPIHandle.OnParse(req, res);
        }).listen(port, () => {
            console.log(`HTTP-API server is listening on ${port}`);
        });
    }
}

module.exports = new HttpAPIServEntry();
/**
 * Created by X on 2019/3/17
 */

function HttpAPIServEntry() {
    this.NetStart = function () {
        const http = require("http");
        let ConfParser = require("./ConfigParser");
        let port = ConfParser.Parse("port", "http-API");

        let qs = require("querystring");

        http.createServer((req, res) => {
            let handle = req.url.split("?")[0].toLowerCase();
            res.setHeader('Access-Control-Allow-Origin', '*');
            switch (handle) {
                case "/login": {
                    let paramStr = req.url.split("?")[1];
                    let param = qs.parse(paramStr);
                    let name = param["name"], pwd = param["pwd"];
                    let data = {};
                    if (name == "admin" && pwd == "123") {
                        data = { "code": 200, "msg": "succ" };
                    } else {
                        data = { "code": 400, "msg": "fail" };
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                } break;

                default:
                    break;
            }
        }).listen(port, () => {
            console.log(`HTTP-API server is listen on ${port}`);
        });
    }
}

module.exports = new HttpAPIServEntry();
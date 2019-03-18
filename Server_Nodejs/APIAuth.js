/**
 * Created by X on 2019/3/18
 */

let qs = require("querystring");
function Auth() {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnAuth = function (req, res, handle) {
        let query = url.parse(req.url).query;
        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        switch (handle) {
            case 'login': {
                GetPostData(req, function (param) {
                    let phone = param["phone"], pwd = param["pwd"];
                    MySQL.GetOne("member", { "phone": phone, "pwd": pwd }, ["_id", "name", "level"], (err, memberInfo) => {
                        if (err) throw err;
                        let data = {};
                        if (memberInfo) {
                            data = { "code": 200, "msg": "succ" };
                            // req.session.dc_uid = memberInfo["_id"];
                            // req.session.dc_name = memberInfo["name"];
                            // req.session.dc_level = memberInfo["level"];
                        } else {
                            data = { "code": 400, "msg": "fail" };
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(data));
                    });
                })
            } break;

            default:
                break;
        }
        // let query = url.parse(req.url).query;
        // let param = qs.parse(query);
    }
}

function GetPostData(req, callback) {
    let str = "";
    req.on("data", res => {
        str += res;
    });
    req.on("end", () => {
        return callback(qs.parse(str.toString()));
    });
}

module.exports = new Auth();
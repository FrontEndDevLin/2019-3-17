/**
 * Created by X on 2019/3/20
 */

let qs = require("querystring");
let NS = require("./NameSpace");

function Vip() {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnVip = function (req, res, handle) {
        let query = url.parse(req.url).query;
        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        switch (handle) {
            case 'getVipList': {
                
            } break;
            case 'addVip': {
                
            } break;
            default:
                break;
        }
    }
}

module.exports = new Vip();
/**
 * Created by X on 2019/3/18
 */

function HTTPAPIHandle() {
    const url = require("url");
    let Auth = require("./APIAuth");
    let Cloth = require("./APICloth");
    let Vip = require("./APIVip");
    let ConfParser = require("./ConfigParser");

    this.OnParse = function (req, res) {
        let path = url.parse(req.url).pathname.toLowerCase();
        let pathArr = path.split("/");
        let router = pathArr[1], handle = pathArr[2];
        if ( !(router && handle) ) {
            return;
        }
        res.setHeader('Access-Control-Allow-Origin', ConfParser.Parse("cors", "acc-host"));
        // res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        switch (router) {
            case "auth": {
                Auth.OnAuth(req, res, handle);
            } break;
            case "cloth": {
                Cloth.OnCloth(req, res, handle);
            } break;
            case "vip": {
                Vip.OnVip(req, res, handle);
            } break;
            default:
                break;
        }
    }
}

module.exports = new HTTPAPIHandle();
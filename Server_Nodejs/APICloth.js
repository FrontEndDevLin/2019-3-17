/**
 * Created by X on 2019/3/18
 */

let qs = require("querystring");
let NS = require("./NameSpace");

function Cloth() {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnCloth = function (req, res, handle) {
        let query = url.parse(req.url).query;
        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        switch (handle) {
            case 'getpricelist': {
                let phone = param["phone"], pwd = param["pwd"];
            } break;
            case 'addcommodit': {
                if (!NS.MethodFilter(req, res, "get")) return;
                let title = param["title"], price = parseInt(param["price"]) || 10, 
                    type = parseInt(param["type"]) || 0;
                let sql = `INSERT INTO commodit VALUES(NULL, ?, ?, ?, DEFAULT)`;
                MySQL.GetPool().query(sql, [title, price, type], (err, result) => {
                    if (err) throw err;
                    let data = {};
                    if (result && result.affectedRows == 1) {
                        data = NS.Build(200, "添加成功");
                    } else {
                        data = NS.Build(400, "添加失败");;
                    }
                    NS.Send(res, data);
                })
            } break;
            default:
                break;
        }
    }
}

module.exports = new Cloth();
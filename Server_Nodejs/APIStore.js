/**
 * Created by X on 2019/3/22
 */

let qs = require("querystring");
let NS = require("./NameSpace");

function Store () {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnStore = function (req, res, handle) {
        let query = url.parse(req.url).query;
        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        switch (handle) {
            case 'addstore': {
                let session_id = NS.GetCookieParam(req)["session_id"];
                let level = NS.sessionMap.get(session_id)["dc_level"];
                if (level != 99) {
                    return NS.Send(res, NS.Build(403, "拒绝访问"))
                }
                if (!NS.MethodFilter(req, res, "post")) return;
                NS.GetPostData(req, (postParam) => {
                    let name = postParam["storeName"], intro = postParam["intro"] || "";
                    if (!name) {
                        return NS.Send(res, NS.Build(403, "缺少参数"))
                    }

                    let selSql = `SELECT _id FROM store WHERE name=? and del=?`;
                    MySQL.Query(selSql, [name, 1], (err, result) => {
                        if (err) throw err;
                        if (result && result.length >= 1) {
                            return NS.Send(res, NS.Build(400, "店铺名重复"))
                        } else {
                            let sql = `INSERT INTO store VALUES(NULL, ?, ?, DEFAULT)`;
                            MySQL.Query(sql, [name, intro], (err, result) => {
                                if (err) throw err;
                                let data;
                                if (result && result.affectedRows == 1) {
                                    data = NS.Build(200, "添加成功");
                                } else {
                                    data = NS.Build(400, "添加失败");
                                }
                                NS.Send(res, data);
                            })
                        }
                    })
                })
            } break;
        
            default:
                break;
        }
    }
}

module.exports = new Store();
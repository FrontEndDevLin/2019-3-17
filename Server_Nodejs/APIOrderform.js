/**
 * Created by X on 2019/3/23
 */

let qs = require("querystring");
let NS = require("./NameSpace");

function Orderform() {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnOrderform = function (req, res, handle) {
        let session_id = NS.GetCookieParam(req)["session_id"];
        let uid = NS.sessionMap.get(session_id)["dc_uid"];

        let query = url.parse(req.url).query;

        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        switch (handle) {
            case 'createform': {
                if (!NS.MethodFilter(req, res, "post")) return;
                NS.GetPostData(req, (postParam) => {
                    let mark = postParam["mark"], phone = postParam["vipPhone"], color = postParam["color"];
                    if (!mark || !phone || !color) {
                        return NS.Send(res, NS.Build(400, "缺少参数"))
                    }
                    let vname, vid;
                    let vipSql = `SELECT _id, name FROM vip WHERE phone=?`;
                    MySQL.Query(vipSql, [phone], (err, result) => {
                        if (err) throw err;
                        if (result && result.length) {
                            vname = result[0]["name"];
                            vid = result[0]["_id"];
                            let clothSql = "INSERT INTO clothes VALUES(NULL, 0, ?, ?, ?, DEFAULT)";
                            MySQL.Query(clothSql, [mark, color, vid], (err, result) => {
                                if (err) throw err;
                                if (result && result.affectedRows == 1) {
                                    let storeSql = "SELECT store FROM member WHERE _id=?";
                                    let clothId = result.insertId;
                                    MySQL.Query(storeSql, [uid], (err, result) => {
                                        if (err) throw err;
                                        if (result && result[0]) {
                                            let storeId = result[0]["store"];
                                            let formSql = "INSERT INTO orderform VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT, DEFAULT, DEFAULT)";
                                            MySQL.Query(formSql, [NS.GetRandomStr(), vname, phone, uid, storeId, new Date().getTime(), clothId], (err, result) => {
                                                if (err) throw err;
                                                if (result.affectedRows == 1) {
                                                    NS.Send(res, NS.Build(200, "订单创建成功"))
                                                } else {
                                                    NS.Send(res, NS.Build(406, "未知错误3"))
                                                }
                                            })
                                        } else {
                                            NS.Send(res, NS.Build(406, "未知错误2"))
                                        }
                                    })
                                } else {
                                    NS.Send(res, NS.Build(406, "未知错误1"))
                                }
                            })
                        } else {
                            NS.Send(res, NS.Build(400, "会员不存在，请先添加该会员"))
                        }
                    })
                })
            } break;
            default:
                break;
        }
    }
}

module.exports = new Orderform();
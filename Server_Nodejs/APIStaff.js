/**
 * Created by X on 2019/3/22
 */

let qs = require("querystring");
let NS = require("./NameSpace");

function Staff () {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnStaff = function (req, res, handle) {
        let query = url.parse(req.url).query;
        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        let session_id = NS.GetCookieParam(req)["session_id"];
        let level = NS.sessionMap.get(session_id)["dc_level"];
        if (!level || level == 0) {
            return NS.Send(res, NS.Build(403, "拒绝访问"))
        }

        switch (handle) {
            case 'canaddstaff': {
                if (!NS.MethodFilter(req, res, "get")) return;
                let sql = `SELECT _id, name FROM store WHERE del=?`;
                MySQL.Query(sql, [1], (err, result) => {
                    if (err) throw err;
                    if (result && result.length >= 1) {
                        NS.Send(res, NS.Build(200, "可添加", result))
                    } else {
                        NS.Send(res, NS.Build(403, "请先添加店铺"))
                    }
                })
            } break;
            case 'addstaff': {
                if (!NS.MethodFilter(req, res, "post")) return;
                NS.GetPostData(req, function (postParam) {
                    let name = postParam["name"], phone = postParam["phone"], pwd = postParam["pwd"], 
                        store = postParam["storeId"], ident = postParam["identity"] || "staff";

                    let staffLv = ident == "manager" ? 9 : 0;
                    if (staffLv == 9) {
                        if (level == 9) {
                            return NS.Send(res, NS.Build(403, "拒绝访问"))
                        }
                    }

                    if (!name || !phone || !pwd || !store) {
                        return NS.Send(res, NS.Build(406, "参数错误"))
                    }

                    let existSql = `SELECT _id FROM member WHERE name=? OR phone=?`;
                    MySQL.Query(existSql, [name, phone], (err, result) => {
                        if (err) throw err;
                        if (result && result.length >= 1) {
                            return NS.Send(res, NS.Build(409, "员工名或手机号码重复"))
                        }

                        let selSql = `SELECT _id FROM store WHERE _id=? AND del=?`;
                        MySQL.Query(selSql, [store, 1], (err, result) => {
                            if (err) throw err;
                            if (result && result.length >= 1) {
                                let fs = require("fs");
                                let avatars = fs.readdirSync("./res/avatar/default");
                                let long = avatars.length;
                                let insSql = `INSERT INTO member VALUES(NULL, ?, DEFAULT, ?, DEFAULT, ?, md5(?), ?, ?, ?, DEFAULT, DEFAULT)`;
                                MySQL.Query(insSql, [name, phone, staffLv, pwd, "avatar/default/" + avatars[parseInt(Math.random() * long)], store, new Date().getTime()], (err, result) => {
                                    if (err) throw err;
                                    if (result && result.affectedRows == 1) {
                                        NS.Send(res, NS.Build(200, "添加成功"))
                                    } else {
                                        NS.Send(res, NS.Build(400, "添加失败"))
                                    }
                                })
                            } else {
                                NS.Send(res, NS.Build(409, "店铺不存在"))
                            }
                        })
                    })


                })
            } break;
        
            default:
                break;
        }
    }
}

module.exports = new Staff();
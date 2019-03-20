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
            case 'getviplist': {
                if (!NS.MethodFilter(req, res, "get")) return;

            } break;
            case 'addvip': {
                if (!NS.MethodFilter(req, res, "post")) return;
                NS.GetPostData(req, function (postParam) {
                    // console.log(postParam);name, phone, 
                    let vName = postParam.name, vPhone = postParam.phone;
                    if (!(vName && vPhone)) {
                        return NS.Send(res, NS.Build(403, "缺少参数"));
                    }
                    MySQL.Query(`SELECT _id FROM vip WHERE phone=?`, [vPhone], (err, result) => {
                        if (err) throw err;
                        if (result) {
                            if (result.length == 0) {
                                let sql = `INSERT INTO vip VALUES(NULL, ?, ?, DEFAULT, ?, DEFAULT, DEFAULT)`;
                                MySQL.Query(sql, [vName, vPhone, new Date().getTime()], (err, result) => {
                                    if (err) throw err;
                                    let data;
                                    if (result && result.affectedRows == 1) {
                                        data = NS.Build(200, "添加成功");
                                    } else {
                                        data = NS.Build(400, "添加失败");;
                                    }
                                    NS.Send(res, data);
                                })
                            } else {
                                return NS.Send(res, NS.Build(412, "手机号码已存在"));
                            }
                        } else {
                            return NS.Send(res, NS.Build(412, "手机号码已存在"));
                        }
                    })
                });
            } break;
            default:
                break;
        }
    }
}

module.exports = new Vip();
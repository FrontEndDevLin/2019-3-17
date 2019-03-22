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
                let pno = param["pno"] || 1, field = param["field"] || "type", sort = param["sort"] || "-1";
                let pageSize = 12;
                let progress = 0;
                let rspData = { pno: 1, listCount: '', pCount: '', items: [] };
                let sqlCnt = `SELECT count(_id) AS listCount FROM commodit WHERE del=?`;
                MySQL.Query(sqlCnt, [1], (err, result) => {
                    if (err) throw err;
                    if (result[0] && result[0]["listCount"] >= 0) {
                        let count = result[0]["listCount"];
                        Object.assign(rspData, {
                            listCount: count,
                            pCount: Math.ceil(count / pageSize)
                        });
                        progress += 50;
                        if (progress == 100) {
                            NS.Send(res, NS.Build(200, "查询成功", rspData))
                        }
                    } else {
                        NS.Send(res, NS.Build(406, "参数错误"))
                    }
                });

                field = field == "type" ? "type" : "price";
                sort = sort == "1" ? "" : "DESC";
                let sqlSel = `SELECT title, price, type FROM Commodit WHERE del=? 
                ORDER BY ${field} ${sort} LIMIT ?, ?`;
                MySQL.Query(sqlSel, [1, (pno - 1) * pageSize, pageSize], (err, result) => {
                    if (err) throw err;
                    if (result) {
                        rspData["items"] = result;
                        progress += 50;
                        if (progress == 100) {
                            NS.Send(res, NS.Build(200, "查询成功", rspData))
                        }
                    } else {
                        NS.Send(res, NS.Build(406, "参数错误"));
                    }
                });
            } break;
            case 'addcommodit': {
                if (!NS.MethodFilter(req, res, "get")) return;
                let title = param["title"], price = parseInt(param["price"]) || 10, 
                    type = parseInt(param["type"]) || 0;
                let sql = `INSERT INTO commodit VALUES(NULL, ?, ?, ?, DEFAULT)`;
                MySQL.Query(sql, [title, price, type], (err, result) => {
                    if (err) throw err;
                    let data = {};
                    if (result && result.affectedRows == 1) {
                        data = NS.Build(200, "添加成功");
                    } else {
                        data = NS.Build(400, "添加失败");
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
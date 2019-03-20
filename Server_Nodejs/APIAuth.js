/**
 * Created by X on 2019/3/18
 */

let qs = require("querystring");
let NS = require("./NameSpace");
let fs = require("fs");

function Auth() {
    let url = require("url");
    let MySQL = require("./MySQLInterface");

    this.OnAuth = function (req, res, handle) {
        let query = url.parse(req.url).query;
        let param;
        if (req.method == "GET") {
            param = qs.parse(query);
        }
        handle = handle.toLowerCase();
        switch (handle) {
            case 'login': {
                if (!NS.MethodFilter(req, res, "post")) return;
                NS.GetPostData(req, function (param) {
                    let phone = param["phone"], pwd = param["pwd"];
                    let sql = `SELECT _id, name, level, avatar FROM member WHERE phone=? and pwd=md5(?)`;
                    let paramArr = [phone, pwd];
                    MySQL.Query(sql, paramArr, (err, memberInfo) => {
                        if (err) throw err;
                        let data;
                        if (memberInfo && memberInfo[0]) {
                            data = NS.Build(200, "登录成功");
                            let option = {
                                dc_uid: memberInfo[0]["_id"],
                                dc_name: memberInfo[0]["name"],
                                dc_level: memberInfo[0]["level"],
                                dc_avatar: memberInfo[0]["avatar"]
                            }
                            let session_id = NS.sessionMap.save(option);
                            res.setHeader('Set-Cookie', `session_id=${session_id};httpOnly=true;path=/`);
                            // console.log(NS.sessionMap.get(session_id));
                        } else {
                            data = NS.Build(400, "用户名或密码错误");
                        }
                        NS.Send(res, data);
                    });
                });
            } break;
            case 'checklogin': {
                if (!NS.MethodFilter(req, res, "post")) return;
                let CookieParam = NS.GetCookieParam(req);
                let rspData;
                if (CookieParam) {
                    let session_id = CookieParam["session_id"];
                    if (session_id) {
                        let userInfo = NS.sessionMap.get(session_id);
                        if (userInfo) {
                            userInfo = JSON.parse(JSON.stringify(userInfo));
                            let avatar = userInfo["dc_avatar"];
                            if (avatar) {
                                fs.readFile(`./res/${avatar}`, "base64", (err, data) => {
                                    if (err) throw err;
                                    if (data) {
                                        data = "data:image/jpg;base64," + data;
                                        userInfo["dc_avatar"] = data;
                                    } else {
                                        data = "data:image/jpg;base64," + fs.readFileSync(`./res/avatar/default/default_001.jpg`, "base64");
                                        userInfo["dc_avatar"] = data;
                                    }
                                    rspData = NS.Build(200, "已登录", userInfo);
                                    NS.Send(res, rspData);
                                })
                            } else {
                                userInfo["dc_avatar"] = "data:image/jpg;base64," + fs.readFileSync(`./res/avatar/default/default_001.jpg`, "base64");
                                rspData = NS.Build(200, "已登录", userInfo);
                                NS.Send(res, rspData);
                            }
                        } else {
                            rspData = NS.Build(406, "未登录");
                            NS.Send(res, rspData);
                        }
                    } else {
                        rspData = NS.Build(406, "未登录");
                        NS.Send(res, rspData);
                    }
                } else {
                    rspData = NS.Build(406, "未登录");
                    NS.Send(res, rspData);
                }
            } break;
            case 'logout': {
                if (!NS.MethodFilter(req, res, "post")) return;
                let CookieParam = NS.GetCookieParam(req);
                let data;
                if (CookieParam) {
                    let session_id = CookieParam["session_id"];
                    if (session_id) {
                        NS.sessionMap.clean(session_id);
                        data = NS.Build(200, "注销成功")
                    } else {
                        data = NS.Build(200, "注销成功2")
                    }
                } else {
                    data = NS.Build(200, "注销成功3")
                }
                NS.Send(res, data);
            } break;
            case 'getselfinfo': {
                if (!NS.MethodFilter(req, res, "get")) return;
                let cookieParam = NS.GetCookieParam(req);
                // console.log(cookieParam);
                if (!cookieParam) {
                    NS.Send(res, NS.Build(403, "未登录"));
                    return;
                }
                let session_id = cookieParam["session_id"];
                if (session_id && NS.sessionMap.get(session_id)) {
                    let userInfo = NS.sessionMap.get(session_id);
                    userInfo = JSON.parse(JSON.stringify(userInfo));
                    let uid = userInfo["dc_uid"];
                    let sql = `SELECT gender, phone, email, store, intro, rgt FROM member WHERE _id=?`
                    MySQL.Query(sql, [ uid ], (err, memberInfo) => {
                        if (err) throw err;
                        let rspData = null;
                        if (memberInfo && memberInfo[0]) {
                            Object.assign(userInfo, memberInfo[0]);
                            if (userInfo["dc_avatar"]) {
                                userInfo["dc_avatar"] =  "data:image/jpg;base64," + fs.readFileSync(`./res/${userInfo["dc_avatar"]}`, "base64");
                            }
                            rspData = NS.Build(200, "查询成功", userInfo);
                        } else {
                            rspData = NS.Build(404, "未知用户");
                        }
                        NS.Send(res, rspData);
                    });
                } else {
                    NS.Send(res, NS.Build(403, "未登录"));
                }
            } break;
            default:
                break;
        }
    }
}

module.exports = new Auth();
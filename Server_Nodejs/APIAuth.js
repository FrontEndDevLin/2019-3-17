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
        switch (handle) {
            case 'login': {
                if (!NS.MethodFilter(req, res, "post")) return;
                NS.GetPostData(req, function (param) {
                    let phone = param["phone"], pwd = param["pwd"];
                    MySQL.GetOne("member", { "phone": phone, "pwd": pwd }, ["_id", "name", "level", "avatar"], (err, memberInfo) => {
                        if (err) throw err;
                        let data;
                        if (memberInfo) {
                            data = NS.Build(200, "登录成功");
                            let option = {
                                dc_uid: memberInfo["_id"],
                                dc_name: memberInfo["name"],
                                dc_level: memberInfo["level"],
                                dc_avatar: memberInfo["avatar"]
                            }
                            let session_id = NS.sessionMap.save(option);
                            res.setHeader('Set-Cookie', `session_id=${session_id};httpOnly=true`);
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
            default:
                break;
        }
    }
}

module.exports = new Auth();
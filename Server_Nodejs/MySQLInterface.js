/**
 * Created by X on 2019/3/18
 */

const MySQL = require("mysql");

function MySQLInterface() {
    let confParser = require("./ConfigParser");
    let dbConfig = confParser.Parse("database");
    // console.log(dbConfig);
    let pool = MySQL.createPool({
        host: dbConfig["host"],
        user: dbConfig["user"],
        password: dbConfig["password"],
        port: dbConfig["port"],
        database: dbConfig["name"],
        connectionLimit: 25
    });

    this.GetPool = function () {
        return pool;
    }

    this.GetOne = function (tableName, selector, option, callback) {
        let sql = "SELECT ";
        let optionString = "";
        if (option) {
            for (let opt of option) {
                opt = optionString ? `, ${opt}` : opt;
                optionString += opt;
            }
        } else {
            optionString += "*";
        }
        sql += `${optionString} FROM ${tableName}`;
        let selectorString = "", selectorValArr = [];
        if (selector) {
            for (let key in selector) {
                selectorValArr.push(selector[key]);
                if (key == "pwd") {
                    key = selectorString ? ` AND ${key} = md5(?)` : ` WHERE ${key} = md5(?)`;
                } else {
                    key = selectorString ? ` AND ${key} = ?` : ` WHERE ${key} = ?`;
                }
                selectorString += key;
            }
        }
        sql += selectorString;
        pool.query(sql, selectorValArr, function (err, result) {
            return callback(err, result[0]);
        })
    }
}

module.exports = new MySQLInterface();
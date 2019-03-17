/**
 * Created by X on 2019/3/17
 */

function ConfigParser () {
    let path = "./sys/config.ini";
    const fs = require("fs");
    const ini = require("ini");

    this.Parse = function (sectionName, keyName) {
        let config = ini.parse(fs.readFileSync(path, "utf-8"));
        return config[sectionName][keyName] || null;
    }
}

module.exports = new ConfigParser();
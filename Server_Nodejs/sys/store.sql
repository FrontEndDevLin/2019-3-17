SET NAMES UTF8;
DROP DATABASE IF EXISTS dryCleaner;
CREATE DATABASE dryCleaner CHARSET = UTF8;
USE dryCleaner;

CREATE Table Member(   # 成员
    _id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) UNIQUE,
    gender TINYINT DEFAULT 0,	# 1->male 2->female 
    phone BIGINT NOT NULL UNIQUE,
    email VARCHAR(64) DEFAULT '',
    level TINYINT DEFAULT 0,	# 99->boss 9->shop manager
    pwd VARCHAR(32) NOT NULL,
    avatar VARCHAR(256) NOT NULL,
    store TINYINT NOT NULL,
    rgt BIGINT NOT NULL,
    intro VARCHAR(512) DEFAULT '',
    salary INT DEFAULT 2000,
    del TINYINT DEFAULT 1
);

CREATE Table Store(    # 分店
    _id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) UNIQUE,
    intro VARCHAR(512) DEFAULT '',
    rgt BIGINT NOT NULL,
    own INT DEFAULT 0,  # 属于
    del TINYINT DEFAULT 1
);
INSERT INTO Store VALUES(NULL, "1号店", DEFAULT, 1552902178513, 2, DEFAULT);

CREATE Table Vip(  # 会员
    _id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32),
    phone BIGINT NOT NULL UNIQUE,
    gender TINYINT DEFAULT 0,	# 1->male 2->female 
    rgt BIGINT NOT NULL,
    count INT DEFAULT 0,   # 积分
    del TINYINT DEFAULT 1
);

CREATE Table Orderform(    # 订单
    _id INT PRIMARY KEY AUTO_INCREMENT,
    ordernum VARCHAR(32),
    user VARCHAR(32),
    phone BIGINT NOT NULL,
    accept INT NOT NULL, # 受理人
    accepted TINYINT DEFAULT 0,
    accepttime BIGINT,
    complete TINYINT DEFAULT 0,
    del TINYINT DEFAULT 1
);

CREATE Table Commodit(     # 价格表
    _id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(16) UNIQUE,
    price SMALLINT DEFAULT 10,
    type TINYINT DEFAULT 0,
    del TINYINT DEFAULT 1
);

CREATE Table Clothes(
    _id INT PRIMARY KEY AUTO_INCREMENT,
    type TINYINT NOT NULL,
    mark VARCHAR(128) DEFAULT '',
    color VARCHAR(32) DEFAULT '',
    vipid INT NOT NULL,
    del TINYINT DEFAULT 1
);

CREATE Table Recyclebin(
    _id INT PRIMARY KEY AUTO_INCREMENT,
    fromtb VARCHAR(64) NOT NULL,
    type INT,
    fromid INT NOT NULL,
    t BIGINT NOT NULL
);

CREATE Table Config(
    _id INT PRIMARY KEY AUTO_INCREMENT,
    logo VARCHAR(256),
    title VARCHAR(64),
    page404 VARCHAR(256)
);

INSERT INTO Member VALUES(null, "CEO", 1, 13622222222, DEFAULT, 99, md5("123abc"), "avatar/default/default_003.jpg", 0, 1552902178513, DEFAULT, DEFAULT, DEFAULT);
INSERT INTO Member VALUES(null, "Lin", 1, 13633333333, DEFAULT, 9, md5("123abc"), "avatar/default/default_002.jpg", 1, 1552902178513, DEFAULT, DEFAULT, DEFAULT);
INSERT INTO Member VALUES(null, "Jiangjiang", 2, 13644444444, DEFAULT, 0, md5("123abc"), "avatar/default/default_005.jpg", 1, 1552902178513, DEFAULT, DEFAULT, DEFAULT);
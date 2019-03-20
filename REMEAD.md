# 洗衣店后台管理系统

## 功能模块

### 登录
- 登录功能 `权限分配`

### 首页今日统计
- 统计今日各项数据功能

### 个人资料
- 显示个人资料信息，可修改

### 历史统计
- 按条件筛选

### 衣物管理
- 库存衣物 `增加、移除`
- 历史衣物
- 价格表（详情）

### 订单管理
- 查看订单

### 会员管理
- 会员列表
- 优惠促销

### 员工管理
- 展示店长、员工信息
- 添加员工

### 右上角通知信息
- 显示上级通知

### 网站管理
- 网站信息 `logo 公告`
- 404
- help
- about us

### 回收站
- 恢复和永久删除功能


## 开发技术
> Vue + Element-ui + Node.js + Mysql

## 数据库设计 Mysql
```
    Table Member(   // 成员
        _id: number,
        name: string,
        gender: number,
        phone: number,
        email: string,
        level: number,
        pwd: md5(string),
        avatar: string,
        store: number,
        rgt: date,
        del: boolean
    );

    Table Store(    // 分店
        _id: number,
        name: string,
        del: boolean
    );

    Table Vip(  // 会员
        _id: number,
        name: string,
        phone: number,
        gender: number,
        rgt: date,
        count: number,   // 积分
        del: boolean
    );

    Table Orderform(    // 订单
        _id: number,
        ordernum: number,
        user: string,
        phone: number,
        accept: number, // 受理人
        accepted: boolean,
        accepttime: date,
        complete: boolean,
        del: boolean
    );

    Table Commodit(     // 价格表
        _id: number,
        title: string,
        price: number,
        type: number,
        del: boolean
    );

    Table Clothes(
        _id: number,
        type: number,
        mark: string,
        color: string,
        vipid: number,
        del: boolean
    );

    Table Recyclebin(
        _id: number,
        from: string,
        type: number,
        fromid: number,
        time: date
    );

    Table Config(
        _id: number,
        logo: string,
        title: string,
        page404: string
    )
```

## API
添加价格表项目
```
    http://192.168.2.108:4449/cloth/addcommodit
    method: get
    param: {
        title: '长袖', // unique
        price: 20,   // default 10
        type: 0     // default 0  0代表织物类 基本只有这个
    }
```

登录
```
    http://192.168.2.108:4449/auth/login
    method: post
    param: {
        phone: 
        pwd:
    }
    withCredentials: true
```

检查登录
```
    http://192.168.2.108:4449/auth/checklogin
    method: post,
    withCredentials: true
```

注销
```
    http://192.168.2.108:4449/auth/logout
    method: post,
    withCredentials: true
```

个人信息
```
    http://192.168.2.108:4449/auth/getselfinfo
    method: get,
    withCredentials: true
```

功能:
1. 登录/注销
2. 今日数据统计(echart)
3. 个人信息(可修改，上传头像)
4. 历史数据统计(可筛选日期)
5. 衣服管理
    添加/移除衣物
    查看历史衣物
    价格表(可添加，删除)
6. 订单管理
    查看订单(处理订单)
7. 会员管理
    会员列表(可添加会员)
    优惠促销(根据会员积分)
8. 店铺管理(仅CEO可见)
    店铺列表(可修改)
    添加店铺
8. 员工管理(CEO、店长可见)
    店长管理(仅CEO可见)
    员工管理(CEO、店长可见)
9. 系统管理(CEO、店长可见)
    全体通知(CEO可见)
    店铺通知(CEO、店长可见)
    网站信息(logo, 标题)
10. 回收站
    恢复和永久删除
11. 右上角通知
    有新通知时, 右上角闪烁
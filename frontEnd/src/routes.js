import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import indexPage from './views/index/index.vue'
import userPage from './views/user/user.vue'
import historyPage from './views/history/history.vue'
import manageHistory from './views/manage/history.vue'
import manageStock from './views/manage/stock.vue'
import orderPage from './views/order/order.vue'
import memberList from './views/member/list.vue'
import memberFlash from './views/member/flash.vue'
import staffMsg from './views/staff/msg.vue'
import staffAdd from './views/staff/add.vue'
import webNotfound from './views/webAdmin/404.vue'
import webAbout from './views/webAdmin/about.vue'
import webAdvertise from './views/webAdmin/advertise.vue'
import webHelp from './views/webAdmin/help.vue'
import recovery from './views/recovery/recovery.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    // start
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-home',
        leaf: true,//只有一个节点
        children: [
            { path: '/', component: indexPage, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-circle',
        leaf: true,//只有一个节点
        children: [
            { path: '/user', component: userPage, name: '个人资料' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-history',
        leaf: true,//只有一个节点
        children: [
            { path: '/history', component: historyPage, name: '历史统计' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '衣物管理',
        iconCls: 'fa fa-asterisk',
        children: [
            { path: '/manage_history', component: manageHistory, name: '库存衣物' },
            { path: '/manage_stock', component: manageStock, name: '历史衣物' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-reorder',
        leaf: true,//只有一个节点
        children: [
            { path: '/order', component: orderPage, name: '订单管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员管理',
        iconCls: 'fa fa-diamond',
        children: [
            { path: '/member_list', component: memberList, name: '会员列表' },
            { path: '/member_flash', component: memberFlash, name: '优惠促销' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '员工管理',
        iconCls: 'fa fa-anchor',
        children: [
            { path: '/staff_msg', component: staffMsg, name: '展示店长、员工信息' },
            { path: '/staff_add', component: staffAdd, name: '添加员工' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '网站管理',
        iconCls: 'fa fa-cubes',
        children: [
            { path: '/web_advertise', component: webAdvertise, name: '网站信息 `logo 公告`' },
            { path: '/web_help', component: webHelp, name: 'help' },
            { path: '/web_about', component: webAbout, name: 'about us' },
            { path: '/web_notfound', component: webNotfound, name: '404' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-trash',
        leaf: true,//只有一个节点
        children: [
            { path: '/recovery', component: recovery, name: '回收站' }
        ]
    },

    // end
    // test
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航一',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/main', component: Main, name: '主页', hidden: true },
    //         { path: '/table', component: Table, name: 'Table' },
    //         { path: '/form', component: Form, name: 'Form' },
    //         { path: '/user', component: user, name: '列表' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(Router);

export default new Router({
    mode: 'hash',

    routes: [
        {
            publicPath:'/',
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/modmanger',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Modmanger.vue'),
                    meta: { title: '模组管理' }
                },
                {
                    path: '/pluginmanger',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Pluginmanger.vue'),
                    meta: { title: '插件管理' }
                },
                {
                    path: '/filesystem',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Filesystem.vue'),
                    meta: { title: '文件系统' }
                },
                {
                    path: '/adminmanger',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/Adminmanger.vue'),
                    meta: { title: '管理员管理' }
                },
                {
                    path: '/usermanger',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/Usermanger.vue'),
                    meta: { title: '成员管理' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },

            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

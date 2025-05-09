import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/baseManagement',
    component: Layout,
    redirect: '/baseManagement/userManager',
    name: 'BaseManagement',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'userManager',
        name: 'UserManager',
        component: () => import('@/views/system/baseManagement/userManager/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'departManager',
        name: 'DepartManager',
        component: () => import('@/views/system/baseManagement/departManager/index'),
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'logManager',
        name: 'LogManager',
        component: () => import('@/views/system/baseManagement/logManager/index'),
        meta: { title: '日志管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/textbookManagementDetails',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/textbookManagementDetails',
        name: 'TextbookManagementDetails',
        component: () => import('@/views/system/textbookManagement/components/TextbookManagementDetails.vue'),
        meta: { title: '教材管理明细' }
      }
    ]
  },

  {
    path: '/textbookReservationDetail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/textbookReservationDetail',
        name: 'TextbookReservationDetail',
        component: () => import('@/views/system/textbookReservation/components/textbookReservationDetail.vue'),
        meta: { title: '教材预订明细' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/textbookReservation',
    component: Layout,
    meta: { roles: ['admin', 'JYS', 'XSFZR'] }, // 添加权限拦截
    children: [
      {
        path: 'index',
        name: 'TextbookReservation',
        component: () => import('@/views/system/textbookReservation/index'),
        meta: { title: '教材预订', icon: 'form', roles: ['admin', 'JYS', 'XSFZR'] }
      }
    ]
  },

  {
    path: '/textbookCollection',
    component: Layout,
    redirect: '/textbookCollection/collect',
    name: 'TextbookCollection',
    meta: {
      title: '教材领取',
      icon: 'nested',
      roles: ['admin', 'JCK', 'XSFZR', 'CKGLY']
    },
    children: [
      {
        path: 'collect',
        name: 'Collect',
        component: () => import('@/views/system/textbookCollection/collect/index.vue'),
        meta: { title: '教材领取', icon: 'form', roles: ['admin', 'JCK', 'XSFZR'] }
      },
      {
        path: 'refund',
        name: 'Refund',
        component: () => import('@/views/system/textbookCollection/refund/index.vue'),
        meta: { title: '教材退换', icon: 'form', roles: ['admin', 'JCK', 'XSFZR', 'CKGLY'] }
      }
    ]
  },

  {
    path: '/payment',
    component: Layout,
    roles: ['admin', 'XSFZR'],
    children: [
      {
        path: 'index',
        name: 'Payment',
        component: () => import('@/views/system/payment/index'),
        meta: { title: '教材费支付', icon: 'form', roles: ['admin', 'XSFZR'] }
      }
    ]
  },

  {
    path: '/textbookManagement',
    component: Layout,
    roles: ['JYS'],
    children: [
      {
        path: 'index',
        name: 'TextbookManagement',
        component: () => import('@/views/system/textbookManagement/index'),
        meta: { title: '教材管理', icon: 'table', roles: ['admin', 'JYS'] }
      }
    ]
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

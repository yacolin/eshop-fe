// config/routes.ts
export default [
  {
    name: '登录',
    path: '/login',
    component: './Login',
    layout: false,
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    path: '/access',
    icon: 'LockOutlined',
    component: './Access',
  },
  // {
  //   name: ' CRUD 示例',
  //   path: '/table',
  //   icon: 'TableOutlined',
  //   component: './Table',
  // },
  {
    name: 'INVENTORY',
    icon: 'UserOutlined',
    path: '/inventory',
    routes: [
      {
        name: '库存',
        path: '/inventory/inventory',
        component: './Inventory',
      },
      {
        name: '产品',
        path: '/inventory/product',
        icon: 'ProductOutlined',
        component: './Product',
      },
      {
        name: '产品(游标)',
        path: '/inventory/product-cursor',
        component: './ProductCursor',
      },
      {
        name: '分类',
        path: '/inventory/category',
        component: './Category',
      },
    ],
  },
  {
    name: 'SALES',
    icon: 'ShoppingCartOutlined',
    path: '/sales',
    routes: [
      {
        name: '订单',
        path: '/sales/order',
        component: './Order',
      },
      {
        name: '订单项',
        path: '/sales/orderitem',
        component: './OrderItem',
      },
    ],
  },
  {
    name: 'USER',
    icon: 'TeamOutlined',
    path: '/user',
    routes: [
      {
        name: '用户信息',
        path: '/user/user-info',
        component: './UserInfo',
      },
      {
        name: '角色管理',
        path: '/user/role',
        component: './Role',
      },
      {
        name: '权限管理',
        path: '/user/permission',
        component: './Permission',
      },
    ],
  },
];

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
      // {
      //   name: '库存',
      //   path: '/inventory/inventory',
      //   component: './Inventory',
      // },
      {
        name: '产品',
        path: '/inventory/product',
        icon: 'ProductOutlined',
        component: './Product',
      },
      // {
      //   name: '分类',
      //   path: '/inventory/category',
      //   component: './Category',
      // },
    ],
  },
  // {
  //   name: 'ORDER',
  //   path: '/order',
  //   icon: 'ProductOutlined',
  //   component: './Order',
  // },
];

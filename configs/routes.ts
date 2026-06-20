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
    name: 'REVIEW',
    icon: 'StarOutlined',
    path: '/review',
    access: 'canManageReviews',
    routes: [
      {
        name: '评论审核',
        path: '/review/manage',
        component: './Review',
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
        access: 'isLoggedIn',
      },
      {
        name: '我的评论',
        path: '/user/my-reviews',
        component: './MyReviews',
        access: 'isLoggedIn',
      },
      {
        name: '角色管理',
        path: '/user/role',
        component: './Role',
        access: 'canManageRoles',
      },
      {
        path: '/user/role/assign-permission',
        component: './Role/AssignPermission',
        access: 'canManageRoles',
      },
      {
        name: '权限管理',
        path: '/user/permission',
        component: './Permission',
        access: 'canManagePermissions',
      },
    ],
  },
];

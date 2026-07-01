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
    name: '商品中心',
    icon: 'ShopOutlined',
    path: '/product',
    routes: [
      {
        name: '产品',
        path: '/product/product',
        icon: 'ProductOutlined',
        component: './Product',
      },
      {
        name: '分类',
        path: '/product/category',
        component: './Category',
      },
      {
        name: '品牌',
        path: '/product/brand',
        component: './Brand',
      },
      {
        name: 'SKU',
        path: '/product/sku',
        component: './Sku',
      },
      {
        name: '属性',
        path: '/product/attribute',
        component: './Attribute',
      },
    ],
  },
  {
    name: '库存中心',
    icon: 'DatabaseOutlined',
    path: '/inventory',
    routes: [
      {
        name: '库存',
        path: '/inventory/inventory',
        component: './Inventory',
      },
    ],
  },
  {
    name: '交易中心',
    icon: 'BarChartOutlined',
    path: '/market',
    routes: [
      {
        name: '订单管理',
        path: '/market/order',
        component: './Trade',
      },
      {
        name: '促销活动',
        path: '/market/promotion',
        component: './Market/Promotion',
      },
      {
        name: '优惠券管理',
        path: '/market/coupon',
        component: './Market/Coupon',
      },
    ],
  },
  {
    name: '评论中心',
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
    name: '用户中心',
    icon: 'TeamOutlined',
    path: '/user',
    routes: [
      {
        name: '角色管理',
        path: '/user/role',
        component: './Role',
        access: 'canManageRoles',
      },
      {
        name: '分配权限',
        path: '/user/role/assign-permission',
        component: './Role/AssignPermission',
        access: 'canManageRoles',
        hideInMenu: true,
      },
      {
        name: '地址管理',
        path: '/user/address',
        component: './Address',
        access: 'isLoggedIn',
      },
      {
        name: '权限管理',
        path: '/user/permission',
        component: './Permission',
        access: 'canManagePermissions',
      },
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
    ],
  },
  {
    name: '基础中心',
    icon: 'SettingOutlined',
    routes: [
      {
        name: '通知管理',
        path: '/user/notification',
        component: './Notification',
        access: 'isLoggedIn',
      },
    ],
  },
];

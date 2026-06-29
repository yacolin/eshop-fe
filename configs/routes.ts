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
    name: '库存管理',
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
    name: '商品管理',
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
    name: '评论管理',
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
    name: '运营管理',
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
    name: '用户中心',
    icon: 'TeamOutlined',
    path: '/user',
    routes: [
      {
        name: '地址管理',
        path: '/user/address',
        component: './Address',
        access: 'isLoggedIn',
      },
      {
        name: '通知管理',
        path: '/user/notification',
        component: './Notification',
        access: 'isLoggedIn',
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
      {
        name: '角色管理',
        path: '/user/role',
        component: './Role',
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

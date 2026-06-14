declare namespace API {
  type AddToCartDTO = {
    product_id: number;
    quantity: number;
    sku?: string;
  };

  type CartItemResponse = {
    id?: number;
    /** 商品单价，单位：分 */
    price?: number;
    product_id?: number;
    product_name?: string;
    quantity?: number;
    sku?: string;
    /** 库存状态 */
    stock?: number;
  };

  type CartResponse = {
    id?: number;
    items?: CartItemResponse[];
    total_items?: number;
    /** 总价，单位：分 */
    total_price?: number;
    user_id?: number;
  };

  type Category = {
    children?: Category[];
    created_at?: string;
    description?: string;
    id?: number;
    name?: string;
    parent?: Category;
    /** 父分类ID，支持层级结构 */
    parent_id?: number;
    updated_at?: string;
  };

  type CategoryListResult = {
    list?: Category[];
    total?: number;
  };

  type CreateCategoryDTO = {
    description?: string;
    name: string;
    parent_id?: number;
  };

  type CreateInventoryDTO = {
    product_id: number;
    /** 初始物理库存量 */
    quantity: number;
    /** 低库存预警阈值(默认0) */
    threshold?: number;
  };

  type CreateOrderDTO = {
    /** 可选，默认 CNY */
    currency?: string;
    customer_id: string;
    items: CreateOrderItemDTO[];
  };

  type CreateOrderItemDTO = {
    product_id: string;
    quantity: number;
    /** 单价，单位：分 */
    unit_price: number;
  };

  type CreatePaymentRequest = {
    amount: number;
    callback_url?: string;
    currency: string;
    metadata?: string;
    order_id: number;
    payment_method: string;
    return_url?: string;
  };

  type CreatePermissionRequest = {
    action: string;
    category?: string;
    description?: string;
    display_name: string;
    name: string;
    resource: string;
    sort?: number;
  };

  type CreateProductDTO = {
    category_ids?: number[];
    description?: string;
    name: string;
    price: number;
    sku: string;
  };

  type CreateRefundRequest = {
    order_id: number;
    payment_id: number;
    refund_amount: number;
    refund_reason: string;
  };

  type CreateRoleRequest = {
    description?: string;
    display_name: string;
    is_system?: boolean;
    name: string;
    sort?: number;
    status?: number;
  };

  type deleteCartsItemsItemIdParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
    /** 购物车项ID */
    item_id: number;
  };

  type deleteCartsParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
  };

  type deleteCategoriesIdParams = {
    /** 分类ID */
    id: number;
  };

  type deleteOrdersIdParams = {
    /** 订单ID */
    id: number;
  };

  type deletePermissionsIdParams = {
    /** 权限ID */
    id: string;
  };

  type deleteProductsIdParams = {
    /** 产品ID */
    id: number;
  };

  type deleteRolesIdParams = {
    /** 角色ID */
    id: string;
  };

  type deleteRolesIdPermissionsParams = {
    /** 角色ID */
    id: string;
  };

  type deleteUsersUserIdRolesRoleIdParams = {
    /** 用户ID */
    user_id: string;
    /** 角色ID */
    role_id: string;
  };

  type getCartsParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
  };

  type getCategoriesIdChildrenParams = {
    /** 父分类ID */
    id: number;
  };

  type getCategoriesIdParams = {
    /** 分类ID */
    id: number;
  };

  type getCategoriesParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 分类名称模糊搜索 */
    name?: string;
  };

  type getInventoriesParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 产品名称模糊搜索 */
    product_name?: string;
    /** SKU精确搜索 */
    sku?: string;
  };

  type getInventoriesProductProductIdParams = {
    /** 产品ID */
    productId: number;
  };

  type getOrdersIdItemsParams = {
    /** 订单ID */
    id: number;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getOrdersIdParams = {
    /** 订单ID */
    id: number;
  };

  type getOrdersItemsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 订单ID筛选 */
    order_id?: number;
    /** 排序字段 (id, order_id, amount) */
    sort_by?: string;
    /** 排序方向 (asc/desc) */
    order?: string;
  };

  type getOrdersParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 用户ID过滤 */
    customer_id?: number;
    /** 订单状态过滤 */
    status?: string;
  };

  type getOrdersPaymentOrderIdParams = {
    /** 订单ID */
    order_id: number;
  };

  type getPaymentMethodsParams = {
    /** 页码，默认1 */
    page?: number;
    /** 每页数量，默认20 */
    page_size?: number;
  };

  type getPaymentsIdParams = {
    /** 支付ID */
    id: number;
  };

  type getPaymentsParams = {
    /** 订单ID */
    order_id?: number;
    /** 支付方式 */
    payment_method?: string;
    /** 支付状态 */
    status?: string;
    /** 开始日期 */
    start_date?: string;
    /** 结束日期 */
    end_date?: string;
    /** 页码，默认1 */
    page?: number;
    /** 每页数量，默认20 */
    page_size?: number;
    /** 排序字段，默认created_at */
    sort_by?: string;
    /** 排序方向，默认desc */
    order?: string;
  };

  type getPermissionsIdParams = {
    /** 权限ID */
    id: string;
  };

  type getPermissionsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
    /** 分类 */
    category?: string;
    /** 资源 */
    resource?: string;
    /** 角色 */
    role?: string;
  };

  type getProductsCacheIdParams = {
    /** 商品ID */
    id: number;
  };

  type getProductsCacheParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 排序字段 (id, name, price) */
    sort_by?: string;
    /** 排序方向 (asc, desc) */
    order?: string;
  };

  type getProductsCategoryCategoryIdParams = {
    /** 分类ID */
    category_id: number;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getProductsEnrichedParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 产品名称模糊搜索 */
    name?: string;
    /** SKU精确搜索 */
    sku?: string;
  };

  type getProductsIdDetailParams = {
    /** 产品ID */
    id: number;
  };

  type getProductsIdEnrichedParams = {
    /** 产品ID */
    id: number;
  };

  type getProductsIdParams = {
    /** 产品ID */
    id: number;
  };

  type getProductsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 产品名称模糊搜索 */
    name?: string;
    /** SKU精确搜索 */
    sku?: string;
  };

  type getRefundsParams = {
    /** 支付ID */
    payment_id?: number;
    /** 订单ID */
    order_id?: number;
    /** 退款状态 */
    status?: string;
    /** 开始日期 */
    start_date?: string;
    /** 结束日期 */
    end_date?: string;
    /** 页码，默认1 */
    page?: number;
    /** 每页数量，默认20 */
    page_size?: number;
    /** 排序字段，默认created_at */
    sort_by?: string;
    /** 排序方向，默认desc */
    order?: string;
  };

  type getRolesIdParams = {
    /** 角色ID */
    id: string;
  };

  type getRolesNameNameParams = {
    /** 角色名称 */
    name: string;
  };

  type getRolesParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    page_size?: number;
  };

  type getUsersUserIdOrdersParams = {
    /** 用户ID */
    user_id: number;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getUsersUserIdParams = {
    /** 用户ID */
    user_id: number;
  };

  type getUsersUserIdRolesParams = {
    /** 用户ID */
    user_id: string;
  };

  type getWsParams = {
    /** JWT Token */
    token: string;
    /** 最后收到的消息序列号（重连时使用） */
    last_seq?: number;
  };

  type Inventory = {
    created_at?: string;
    id?: number;
    product_id?: number;
    /** 实际物理库存。卖出一件减一 */
    quantity?: number;
    /** 已预订(下单未支付)数量。下单+1, 支付/取消-1 */
    reserved?: number;
    /** 库存状态: instock / lowstock / outofstock */
    status?: string;
    /** 低库存预警阈值。quantity<=threshold 时自动标为 lowstock */
    threshold?: number;
    updated_at?: string;
  };

  type InventoryListResult = {
    list?: Inventory[];
    total?: number;
  };

  type ListPermissionsResponse = {
    page?: number;
    page_size?: number;
    permissions?: Permission[];
    total?: number;
  };

  type ListRolesResponse = {
    page?: number;
    page_size?: number;
    roles?: Role[];
    total?: number;
  };

  type LoginResponse = {
    access_token?: string;
    expires_at?: number;
    /** 是否新用户 */
    is_new_user?: boolean;
    refresh_token?: string;
    token_type?: string;
    user_id?: number;
    username?: string;
  };

  type OnlineStatsResponse = {
    /** 连接数 */
    connections?: number;
    /** 在线用户数 */
    online_users?: number;
  };

  type OrderItemListResult = {
    list?: OrderItemResponse[];
    total?: number;
  };

  type OrderItemResponse = {
    /** 单项小计，单位：分 */
    amount?: number;
    id?: number;
    order_id?: number;
    product_id?: string;
    quantity?: number;
    /** 单价，单位：分 */
    unit_price?: number;
  };

  type OrderListResult = {
    list?: OrderResponse[];
    total?: number;
  };

  type OrderResponse = {
    created_at?: string;
    currency?: string;
    customer_id?: string;
    id?: number;
    items?: OrderItemResponse[];
    status?: string;
    /** 订单总金额，单位：分 */
    total_amount?: number;
    updated_at?: string;
  };

  type PasswordLoginRequest = {
    password: string;
    username: string;
  };

  type patchOrdersIdStatusParams = {
    /** 订单ID */
    id: number;
  };

  type patchPaymentsIdStatusParams = {
    /** 支付ID */
    id: number;
  };

  type patchRefundsIdStatusParams = {
    /** 退款ID */
    id: number;
  };

  type PaymentListResponse = {
    page?: number;
    payments?: PaymentResponse[];
    size?: number;
    total?: number;
  };

  type PaymentMethodListResponse = {
    page?: number;
    page_size?: number;
    payment_methods?: PaymentMethodResponse[];
    total?: number;
  };

  type PaymentMethodResponse = {
    code?: string;
    created_at?: string;
    description?: string;
    id?: number;
    name?: string;
    status?: number;
  };

  type PaymentResponse = {
    amount?: number;
    created_at?: string;
    currency?: string;
    id?: number;
    order_id?: number;
    paid_at?: string;
    payment_method?: string;
    payment_url?: string;
    qrcode?: string;
    status?: string;
    transaction_id?: string;
  };

  type Permission = {
    /** 操作：create, read, update, delete 等 */
    action?: string;
    /** 分类：business, system, admin 等 */
    category?: string;
    created_at?: string;
    /** 描述 */
    description?: string;
    /** 显示名称，如：创建订单 */
    display_name?: string;
    id?: number;
    /** 权限名称，如：order:create */
    name?: string;
    /** 资源：order, product, user 等 */
    resource?: string;
    /** 排序 */
    sort?: number;
    /** 1:启用 2:禁用 */
    status?: number;
    updated_at?: string;
  };

  type PhoneLoginRequest = {
    phone: string;
    verify_code: string;
  };

  type postCartsItemsParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
  };

  type postOrdersIdCancelParams = {
    /** 订单ID */
    id: number;
  };

  type postRolesIdPermissionsParams = {
    /** 角色ID */
    id: string;
  };

  type postUsersUserIdRolesParams = {
    /** 用户ID */
    user_id: string;
  };

  type Product = {
    created_at?: string;
    description?: string;
    id?: number;
    name?: string;
    /** 价格，单位：分 */
    price?: number;
    sku?: string;
    updated_at?: string;
  };

  type ProductCategoryBrief = {
    id?: number;
    name?: string;
  };

  type ProductDetailDTO = {
    categories?: ProductCategoryBrief[];
    created_at?: string;
    description?: string;
    id?: number;
    name?: string;
    price?: number;
    quantity?: number;
    reserved?: number;
    sku?: string;
    status?: string;
    threshold?: number;
    updated_at?: string;
  };

  type ProductListResult = {
    list?: Product[];
    total?: number;
  };

  type ProductWithCategoryDTO = {
    categories?: ProductCategoryBrief[];
    created_at?: string;
    description?: string;
    id?: number;
    name?: string;
    price?: number;
    sku?: string;
    updated_at?: string;
  };

  type ProductWithCategoryListResult = {
    list?: ProductWithCategoryDTO[];
    total?: number;
  };

  type putCartsItemsItemIdParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
    /** 购物车项ID */
    item_id: number;
  };

  type putCategoriesIdParams = {
    /** 分类ID */
    id: number;
  };

  type putInventoriesIdParams = {
    /** 库存ID */
    id: number;
  };

  type putOrdersIdParams = {
    /** 订单ID */
    id: number;
  };

  type putPermissionsIdParams = {
    /** 权限ID */
    id: string;
  };

  type putProductsIdParams = {
    /** 产品ID */
    id: number;
  };

  type putRolesIdParams = {
    /** 角色ID */
    id: string;
  };

  type ReconnectRequest = {
    /** 客户端最后收到的消息序列号 */
    last_seq: number;
  };

  type ReconnectResponse = {
    /** 缓存最大序列号 */
    cached_max_seq?: number;
    /** 缓存最小序列号 */
    cached_min_seq?: number;
    /** 服务端当前序列号 */
    current_seq?: number;
    /** 客户端上报的序列号 */
    last_seq?: number;
    /** 提示信息 */
    message?: string;
    /** 补发消息数量 */
    message_count?: number;
    /** 需要补发的消息列表 */
    messages?: any[];
    /** 是否需要全量同步 */
    need_full_sync?: boolean;
    /** 是否需要增量同步 */
    need_incremental?: boolean;
    /** 状态：ok, sync_required */
    status?: string;
  };

  type RefreshTokenRequest = {
    refresh_token: string;
  };

  type RefundListResult = {
    list?: RefundResponse[];
    total?: number;
  };

  type RefundResponse = {
    created_at?: string;
    id?: number;
    order_id?: number;
    payment_id?: number;
    refund_amount?: number;
    refund_reason?: string;
    status?: string;
    transaction_id?: string;
  };

  type RegisterRequest = {
    email?: string;
    password?: string;
    phone?: string;
    /** 注册方式：password, phone, email */
    provider: string;
    username?: string;
  };

  type ReleaseInventoryDTO = {
    product_id: number;
    /** 释放数量 */
    quantity: number;
  };

  type ReserveInventoryDTO = {
    product_id: number;
    /** 预占数量 */
    quantity: number;
  };

  type Response = {
    code?: number;
    data?: any;
    message?: string;
    trace_id?: string;
  };

  type Role = {
    created_at?: string;
    description?: string;
    display_name?: string;
    id?: number;
    is_system?: boolean;
    name?: string;
    permissions?: Permission[];
    sort?: number;
    status?: number;
    updated_at?: string;
  };

  type SessionResponse = {
    /** 首次连接时间 */
    connected_at?: string;
    /** 会话是否存在 */
    exists?: boolean;
    /** 最后活跃时间 */
    last_active_at?: string;
    /** 最后收到的消息序列号 */
    last_seq?: number;
    /** 重连次数 */
    reconnect_count?: number;
    /** 用户ID */
    user_id?: number;
  };

  type TestPushRequest = {
    /** 级别: info/warning/error */
    level?: string;
    /** 通知内容 */
    message: string;
    /** 目标: all(默认) 或 user_id */
    target?: string;
    /** 通知标题 */
    title: string;
  };

  type UpdateCartItemDTO = {
    quantity: number;
  };

  type UpdateCategoryDTO = {
    description?: string;
    name?: string;
    parent_id?: number;
  };

  type UpdateInventoryDTO = {
    /** 调整后物理库存 */
    quantity?: number;
    /** 调整后预占量(谨慎使用) */
    reserved?: number;
    /** 调整后预警阈值 */
    threshold?: number;
  };

  type UpdateOrderDTO = {
    product_id?: number;
    quantity?: number;
    status?: string;
    total_price?: number;
    user_id?: number;
  };

  type UpdateOrderStatusDTO = {
    status: string;
  };

  type UpdatePaymentStatusRequest = {
    failure_reason?: string;
    status: string;
    transaction_id?: string;
  };

  type UpdatePermissionRequest = {
    category?: string;
    description?: string;
    display_name?: string;
    sort?: number;
    status?: number;
  };

  type UpdateProductDTO = {
    category_ids?: number[];
    description?: string;
    name?: string;
    price?: number;
  };

  type UpdateRoleRequest = {
    description?: string;
    display_name?: string;
    sort?: number;
    status?: number;
  };

  type UpdateUserInfoRequest = {
    address?: string;
    avatar?: string;
    bio?: string;
    birthday?: string;
    city?: string;
    country?: string;
    gender?: number;
    language?: string;
    nickname?: string;
    province?: string;
    timezone?: string;
    zip_code?: string;
  };

  type User = {
    created_at?: string;
    id?: number;
    status?: number;
    updated_at?: string;
    user_info?: UserInfo;
  };

  type UserInfo = {
    address?: string;
    avatar?: string;
    bio?: string;
    birthday?: string;
    city?: string;
    country?: string;
    created_at?: string;
    /** 0:未知 1:男 2:女 */
    gender?: number;
    id?: number;
    language?: string;
    nickname?: string;
    province?: string;
    timezone?: string;
    updated_at?: string;
    user_id?: number;
    zip_code?: string;
  };

  type WechatLoginRequest = {
    appid: string;
    code: string;
    source?: string;
  };
}

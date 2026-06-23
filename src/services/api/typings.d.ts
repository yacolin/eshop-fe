declare namespace API {
  type ActivityCursorResult = {
    has_more?: boolean;
    list?: FlashActivity[];
    next_cursor?: number;
  };

  type AddToCartDTO = {
    quantity: number;
    sku_id: number;
  };

  type AttributeListResult = {
    list?: AttributeResponse[];
    total?: number;
  };

  type AttributeResponse = {
    created_at?: string;
    id?: number;
    name?: string;
    sort_order?: number;
    updated_at?: string;
  };

  type AttributeValueItem = {
    value?: string;
    value_id?: number;
  };

  type AttributeValueResponse = {
    attribute_id?: number;
    created_at?: string;
    id?: number;
    sort_order?: number;
    updated_at?: string;
    value?: string;
  };

  type BatchCreateInventoryDTO = {
    /** 统一初始物理库存量 */
    quantity: number;
    sku_ids: number[];
    /** 统一低库存预警阈值 */
    threshold?: number;
  };

  type BatchCreateSkuDTO = {
    skus: BatchCreateSkuItem[];
  };

  type BatchCreateSkuItem = {
    attr_value_ids: number[];
    image?: string;
    name: string;
    price: number;
    sku_code: string;
  };

  type BatchCreateSkuResult = {
    failed?: number;
    skus?: SkuResponse[];
    success?: number;
    total?: number;
  };

  type CachedProductItem = {
    id?: number;
    min_price?: number;
    name?: string;
  };

  type CartItemResponse = {
    id?: number;
    /** 商品单价，单位：分 */
    price?: number;
    product_id?: number;
    product_name?: string;
    quantity?: number;
    sku?: string;
    sku_id?: number;
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

  type CategoryAttributeResponse = {
    attribute_id?: number;
    attribute_name?: string;
  };

  type CategoryDistDTO = {
    /** 分类名称 */
    category?: string;
    /** 商品数量 */
    value?: number;
  };

  type CategoryListResult = {
    list?: Category[];
    total?: number;
  };

  type ClaimCouponDTO = {
    coupon_id: number;
  };

  type CouponListResult = {
    list?: CouponResponse[];
    total?: number;
  };

  type CouponResponse = {
    coupon_type?: string;
    created_at?: string;
    description?: string;
    end_time?: string;
    id?: number;
    max_discount?: number;
    min_amount?: number;
    name?: string;
    remain_stock?: number;
    scope?: string;
    scope_value?: string;
    start_time?: string;
    status?: string;
    total_stock?: number;
    updated_at?: string;
    user_limit?: number;
    valid_days?: number;
    value?: number;
  };

  type CreateAttributeDTO = {
    name: string;
    sort_order?: number;
  };

  type CreateAttributeValueDTO = {
    attribute_id: number;
    sort_order?: number;
    value: string;
  };

  type CreateCategoryDTO = {
    description?: string;
    name: string;
    parent_id?: number;
  };

  type CreateCouponDTO = {
    coupon_type: 'fixed' | 'percentage' | 'voucher';
    description?: string;
    end_time: string;
    max_discount?: number;
    min_amount?: number;
    name: string;
    scope: 'global' | 'category' | 'product';
    scope_value?: string;
    start_time: string;
    total_stock: number;
    user_limit?: number;
    valid_days?: number;
    value: number;
  };

  type CreateInventoryDTO = {
    /** 初始物理库存量 */
    quantity: number;
    sku_id: number;
    /** 低库存预警阈值(默认0) */
    threshold?: number;
  };

  type CreateOrderDTO = {
    /** 可选，默认 CNY */
    currency?: string;
    customer_id: string;
    items: CreateOrderItemDTO[];
    /** 可选，使用的用户优惠券ID */
    user_coupon_id?: number;
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
  };

  type CreatePromotionDTO = {
    description?: string;
    end_time: string;
    name: string;
    promo_type: 'time_discount' | 'full_reduce';
    rule: string;
    scope: 'all' | 'category' | 'product';
    scope_value?: string;
    sort_order?: number;
    start_time: string;
  };

  type CreateRefundRequest = {
    order_id: number;
    payment_id: number;
    refund_amount: number;
    refund_reason: string;
  };

  type CreateReviewReq = {
    content?: string;
    media?: ReviewMedia[];
    order_item_id: number;
    product_id: number;
    rating: number;
  };

  type CreateRoleRequest = {
    description?: string;
    display_name: string;
    is_system?: boolean;
    name: string;
    sort?: number;
    status?: number;
  };

  type CreateSkuDTO = {
    image?: string;
    name: string;
    price: number;
    product_id: number;
    sku_code: string;
    spec?: Record<string, any>;
  };

  type DashboardResponse = {
    category_dist?: CategoryDistDTO[];
    inventory_status_dist?: StatusDistDTO[];
    order_status_dist?: StatusDistDTO[];
    order_trend?: OrderTrendDTO[];
    payment_method_dist?: MethodDistDTO[];
    summary?: SummaryDTO;
    top_products?: TopProductDTO[];
  };

  type deleteAdminReviewsIdParams = {
    /** 评论ID */
    id: number;
  };

  type deleteAttributesIdParams = {
    /** 属性ID */
    id: number;
  };

  type deleteAttributeValuesIdParams = {
    /** 属性值ID */
    id: number;
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

  type deleteNotificationsIdParams = {
    /** 通知ID */
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

  type deleteReviewsIdParams = {
    /** 评论ID */
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

  type deleteSkusIdParams = {
    /** SKU ID */
    id: number;
  };

  type deleteUsersUserIdRolesRoleIdParams = {
    /** 用户ID */
    user_id: string;
    /** 角色ID */
    role_id: string;
  };

  type FlashActivity = {
    created_at?: string;
    end_time?: string;
    flash_price?: number;
    id?: number;
    product_id?: number;
    sold_stock?: number;
    start_time?: string;
    status?: string;
    total_stock?: number;
    updated_at?: string;
  };

  type getAdminReviewsPendingParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getAttributesIdParams = {
    /** 属性ID */
    id: number;
  };

  type getAttributesIdValuesParams = {
    /** 属性ID */
    id: number;
  };

  type getAttributesParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getCartsParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
  };

  type getCategoriesIdAttributesParams = {
    /** 品类ID */
    id: number;
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

  type getCouponsIdParams = {
    /** 优惠券模板ID */
    id: number;
  };

  type getCouponsMineParams = {
    /** 状态过滤：unused/used/expired */
    status?: string;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    page_size?: number;
  };

  type getCouponsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    page_size?: number;
  };

  type getFlashActivitiesCursorParams = {
    /** 游标（上一页最后一条的 ID，首次查询传 0） */
    cursor?: number;
    /** 每页条数 */
    size?: number;
    /** 筛选状态：pending/active/finished */
    status?: string;
  };

  type getInventoriesEnrichedParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** SKU名称模糊搜索 */
    sku_name?: string;
    /** SKU精确搜索 */
    sku?: string;
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

  type getInventoriesSkuSkuIdParams = {
    /** SKU ID */
    skuId: number;
  };

  type getNotificationsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    page_size?: number;
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
    /** 订单号筛选 */
    order_no?: string;
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
    /** 订单号搜索 */
    order_no?: string;
    /** 订单状态过滤 */
    status?: string;
    /** 排序字段 (total_price, created_at) */
    sort_by?: string;
    /** 排序方向 (asc/desc) */
    order?: string;
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
    /** 排序字段（sort/created_at/name） */
    sort_by?: 'sort' | 'created_at' | 'name';
    /** 排序方向 */
    order?: 'asc' | 'desc';
  };

  type getProductsCacheCursorParams = {
    /** 游标（上一页最后一条的 ID，首次查询传 0） */
    cursor?: number;
    /** 每页条数 */
    size?: number;
    /** 分类ID筛选 */
    category_id?: number;
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

  type getProductsCursorParams = {
    /** 游标（上一页最后一条的 ID，首次查询传 0） */
    cursor?: number;
    /** 每页条数 */
    size?: number;
    /** 产品名称模糊搜索 */
    name?: string;
    /** SKU精确搜索 */
    sku?: string;
    /** 分类ID筛选 */
    category_id?: number;
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

  type getProductsIdAttributesParams = {
    /** 产品ID */
    id: number;
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

  type getProductsIdRatingParams = {
    /** 产品ID */
    id: number;
  };

  type getProductsIdReviewsParams = {
    /** 产品ID */
    id: number;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
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

  type getPromotionsIdParams = {
    /** 促销活动ID */
    id: number;
  };

  type getPromotionsIdProductsParams = {
    /** 促销活动ID */
    id: number;
  };

  type getPromotionsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    page_size?: number;
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

  type getReviewsMeParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
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

  type getSkusIdParams = {
    /** SKU ID */
    id: number;
  };

  type getSkusParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 产品ID（可选） */
    product_id?: number;
    /** SKU名称模糊搜索 */
    name?: string;
    /** SKU编码精确搜索 */
    sku_code?: string;
    /** 最低价格（分） */
    price_min?: number;
    /** 最高价格（分） */
    price_max?: number;
    /** 排序字段 (id, name, price, created_at) */
    sort_by?: string;
    /** 排序方向 (asc, desc) */
    order?: string;
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
    /** 实际物理库存。卖出一件减一 */
    quantity?: number;
    /** 已预订(下单未支付)数量。下单+1, 支付/取消-1 */
    reserved?: number;
    sku_id?: number;
    /** 库存状态: instock / lowstock / outofstock */
    status?: string;
    /** 低库存预警阈值。quantity<=threshold 时自动标为 lowstock */
    threshold?: number;
    updated_at?: string;
  };

  type InventoryEnrichedItem = {
    created_at?: string;
    id?: number;
    quantity?: number;
    reserved?: number;
    sku_id?: number;
    sku_name?: string;
    status?: string;
    threshold?: number;
    updated_at?: string;
  };

  type InventoryEnrichedResult = {
    list?: InventoryEnrichedItem[];
    total?: number;
  };

  type InventoryListResult = {
    list?: Inventory[];
    total?: number;
  };

  type LinkProductsDTO = {
    discount: number;
    product_ids: number[];
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

  type MediaType = 'image' | 'video';

  type MethodDistDTO = {
    /** 显示标签 */
    label?: string;
    /** 支付方式编码 */
    method?: string;
    /** 数量 */
    value?: number;
  };

  type ModerateReviewReq = {
    /** 拒绝/隐藏原因（可选，记录用） */
    reason?: string;
    status: 'approved' | 'rejected' | 'hidden';
  };

  type NotificationListResult = {
    list?: NotificationResponse[];
    total?: number;
  };

  type NotificationResponse = {
    content?: string;
    created_at?: string;
    id?: number;
    is_read?: boolean;
    read_at?: string;
    title?: string;
    type?: NotificationType;
    user_id?: number;
  };

  type NotificationType = 'system' | 'order' | 'payment' | 'flash' | 'admin';

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
    order_no?: string;
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
    /** 使用的优惠券模板ID */
    coupon_id?: number;
    created_at?: string;
    currency?: string;
    customer_id?: string;
    /** 优惠金额，单位：分 */
    discount_amount?: number;
    id?: number;
    items?: OrderItemResponse[];
    order_no?: string;
    status?: string;
    /** 订单总金额（已扣优惠），单位：分 */
    total_amount?: number;
    updated_at?: string;
  };

  type OrderTrendDTO = {
    /** 金额（分） */
    amount?: number;
    /** 订单数 */
    count?: number;
    /** 日期 (MM-DD) */
    date?: string;
  };

  type PasswordLoginRequest = {
    password: string;
    username: string;
  };

  type patchAdminReviewsIdModerateParams = {
    /** 评论ID */
    id: number;
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

  type postAdminPromotionsIdProductsParams = {
    /** 促销活动ID */
    id: number;
  };

  type postAdminReviewsIdReplyParams = {
    /** 评论ID */
    id: number;
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

  type postProductsIdSkusBatchParams = {
    /** 产品ID */
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
    min_price?: number;
    name?: string;
    updated_at?: string;
  };

  type ProductAttributeItem = {
    attribute_id?: number;
    attribute_name?: string;
    values?: AttributeValueItem[];
  };

  type ProductAttributeUpdateItem = {
    attribute_id: number;
    value_ids: number[];
  };

  type ProductCacheCursorResult = {
    has_more?: boolean;
    list?: CachedProductItem[];
    next_cursor?: number;
  };

  type ProductCategoryBrief = {
    id?: number;
    name?: string;
  };

  type ProductCursorResult = {
    /** 是否还有更多数据 */
    has_more?: boolean;
    list?: Product[];
    /** 下一页游标值（无更多数据时为 0） */
    next_cursor?: number;
  };

  type ProductDetailDTO = {
    categories?: ProductCategoryBrief[];
    created_at?: string;
    description?: string;
    id?: number;
    min_price?: number;
    name?: string;
    quantity?: number;
    reserved?: number;
    skus?: SkuResponse[];
    status?: string;
    threshold?: number;
    updated_at?: string;
  };

  type ProductListResult = {
    list?: Product[];
    total?: number;
  };

  type ProductRatingResp = {
    average_rating?: number;
    product_id?: number;
    rating_1_count?: number;
    rating_2_count?: number;
    rating_3_count?: number;
    rating_4_count?: number;
    rating_5_count?: number;
    review_count?: number;
  };

  type ProductResponse = {
    created_at?: string;
    description?: string;
    id?: number;
    min_price?: number;
    name?: string;
    updated_at?: string;
  };

  type ProductWithCategoryDTO = {
    categories?: ProductCategoryBrief[];
    created_at?: string;
    description?: string;
    id?: number;
    min_price?: number;
    name?: string;
    updated_at?: string;
  };

  type ProductWithCategoryListResult = {
    list?: ProductWithCategoryDTO[];
    total?: number;
  };

  type ProductWithSkusResponse = {
    product?: ProductResponse;
    skus?: SkuResponse[];
  };

  type PromotionListResult = {
    list?: PromotionResponse[];
    total?: number;
  };

  type PromotionResponse = {
    created_at?: string;
    description?: string;
    end_time?: string;
    id?: number;
    name?: string;
    promo_type?: string;
    rule?: string;
    scope?: string;
    scope_value?: string;
    sort_order?: number;
    start_time?: string;
    status?: string;
    updated_at?: string;
  };

  type putAdminCouponsIdParams = {
    /** 优惠券模板ID */
    id: number;
  };

  type putAdminPromotionsIdParams = {
    /** 促销活动ID */
    id: number;
  };

  type putAdminPromotionsIdStatusParams = {
    /** 促销活动ID */
    id: number;
  };

  type putAttributesIdParams = {
    /** 属性ID */
    id: number;
  };

  type putAttributeValuesIdParams = {
    /** 属性值ID */
    id: number;
  };

  type putCartsItemsItemIdParams = {
    /** 用户ID */
    user_id?: number;
    /** 会话ID */
    session_id?: string;
    /** 购物车项ID */
    item_id: number;
  };

  type putCategoriesIdAttributesParams = {
    /** 品类ID */
    id: number;
  };

  type putCategoriesIdParams = {
    /** 分类ID */
    id: number;
  };

  type putInventoriesIdParams = {
    /** 库存ID */
    id: number;
  };

  type putNotificationsIdReadParams = {
    /** 通知ID */
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

  type putProductsIdAttributesParams = {
    /** 产品ID */
    id: number;
  };

  type putProductsIdParams = {
    /** 产品ID */
    id: number;
  };

  type putRolesIdParams = {
    /** 角色ID */
    id: string;
  };

  type putSkusIdParams = {
    /** SKU ID */
    id: number;
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
    /** 释放数量 */
    quantity: number;
    sku_id: number;
  };

  type ReplyReviewReq = {
    reply: string;
  };

  type ReserveInventoryDTO = {
    /** 预占数量 */
    quantity: number;
    sku_id: number;
  };

  type Response = {
    code?: number;
    data?: any;
    message?: string;
    trace_id?: string;
  };

  type ReviewListResp = {
    list?: ReviewResp[];
    total?: number;
  };

  type ReviewMedia = {
    /** 缩略图地址（视频封面/图片缩略） */
    thumbnail?: string;
    /** 媒体类型 */
    type?: MediaType;
    /** 资源地址 */
    url?: string;
  };

  type ReviewMediaDTO = {
    thumbnail?: string;
    type?: MediaType;
    url?: string;
  };

  type ReviewResp = {
    content?: string;
    created_at?: string;
    id?: number;
    media?: ReviewMediaDTO[];
    order_item_id?: number;
    order_no?: string;
    product_id?: number;
    rating?: number;
    reply?: string;
    reply_at?: string;
    status?: ReviewStatus;
    updated_at?: string;
    user_avatar?: string;
    user_id?: number;
    user_name?: string;
  };

  type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

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

  type SendSystemNotificationDTO = {
    content: string;
    title: string;
    /** 0 表示全体 */
    user_id?: number;
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

  type SetCategoryAttributesDTO = {
    attribute_ids: number[];
  };

  type SkuListResult = {
    list?: SkuResponse[];
    total?: number;
  };

  type SkuResponse = {
    created_at?: string;
    id?: number;
    image?: string;
    name?: string;
    price?: number;
    product_id?: number;
    sku_code?: string;
    spec?: Record<string, any>;
    updated_at?: string;
  };

  type StatusDistDTO = {
    /** 显示标签 */
    label?: string;
    /** 状态编码 */
    status?: string;
    /** 数量 */
    value?: number;
  };

  type SummaryDTO = {
    /** 库存告警数 */
    low_stock_count?: number;
    /** 总订单数 */
    total_orders?: number;
    /** 商品总数 */
    total_products?: number;
    /** 总营收（分） */
    total_revenue?: number;
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

  type TopProductDTO = {
    /** 销售额（分） */
    amount?: number;
    /** 销量 */
    count?: number;
    /** 商品名称 */
    name?: string;
  };

  type UnreadCountResponse = {
    count?: number;
  };

  type UpdateAttributeDTO = {
    name?: string;
    sort_order?: number;
  };

  type UpdateAttributeValueDTO = {
    sort_order?: number;
    value?: string;
  };

  type UpdateCartItemDTO = {
    quantity: number;
  };

  type UpdateCategoryDTO = {
    description?: string;
    name?: string;
    parent_id?: number;
  };

  type UpdateCouponDTO = {
    description?: string;
    end_time?: string;
    max_discount?: number;
    min_amount?: number;
    name?: string;
    scope?: 'global' | 'category' | 'product';
    scope_value?: string;
    start_time?: string;
    status?: 'active' | 'inactive';
    user_limit?: number;
    valid_days?: number;
    value?: number;
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

  type UpdateProductAttributesDTO = {
    attributes: ProductAttributeUpdateItem[];
  };

  type UpdateProductDTO = {
    category_ids?: number[];
    description?: string;
    name?: string;
  };

  type UpdatePromotionDTO = {
    description?: string;
    end_time?: string;
    name?: string;
    rule?: string;
    scope?: 'all' | 'category' | 'product';
    scope_value?: string;
    sort_order?: number;
    start_time?: string;
    status?: 'pending' | 'active' | 'cancelled';
  };

  type UpdateRoleRequest = {
    description?: string;
    display_name?: string;
    sort?: number;
    status?: number;
  };

  type UpdateSkuDTO = {
    image?: string;
    name?: string;
    price?: number;
    sku_code?: string;
    spec?: Record<string, any>;
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

  type UseCouponDTO = {
    order_amount: number;
    order_no: string;
    user_coupon_id: number;
  };

  type User = {
    created_at?: string;
    id?: number;
    status?: number;
    updated_at?: string;
    user_info?: UserInfo;
  };

  type UserCouponListResult = {
    list?: UserCouponResponse[];
    total?: number;
  };

  type UserCouponResponse = {
    coupon_code?: string;
    coupon_description?: string;
    coupon_id?: number;
    coupon_min_amount?: number;
    /** 冗余展示优惠券信息 */
    coupon_name?: string;
    coupon_type?: string;
    coupon_value?: number;
    created_at?: string;
    expire_at?: string;
    id?: number;
    order_no?: string;
    status?: string;
    used_at?: string;
    user_id?: number;
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

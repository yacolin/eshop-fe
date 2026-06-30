declare namespace API {
  type AddItemReq = {
    quantity: number;
    sku_id: number;
  };

  type Address = {
    city?: string;
    consignee?: string;
    country?: string;
    created_at?: string;
    detail?: string;
    district?: string;
    id?: number;
    is_default?: boolean;
    phone?: string;
    province?: string;
    tag?: string;
    updated_at?: string;
    user_id?: number;
    zip_code?: string;
  };

  type AddressInfo = {
    city?: string;
    consignee: string;
    detail_addr?: string;
    district?: string;
    phone: string;
    province?: string;
    zip_code?: string;
  };

  type AddressListResult = {
    list?: Address[];
    total?: number;
  };

  type Attribute = {
    category_id?: number;
    created_at?: string;
    id?: number;
    /** 1-文本 2-单选 3-多选 4-数字 */
    input_type?: number;
    is_sku_spec?: number;
    name?: string;
    required?: number;
    searchable?: number;
    sort_order?: number;
    status?: number;
    unit?: string;
    updated_at?: string;
    /** 可选值 JSON 数组 */
    values?: string;
  };

  type Brand = {
    created_at?: string;
    description?: string;
    english_name?: string;
    first_letter?: string;
    id?: number;
    logo_url?: string;
    name?: string;
    sort_order?: number;
    status?: number;
    updated_at?: string;
  };

  type BrandListResult = {
    list?: Brand[];
    total?: number;
  };

  type Cart = {
    created_at?: string;
    expired_at?: string;
    id?: number;
    item_count?: number;
    session_id?: string;
    total_amount?: number;
    updated_at?: string;
    user_id?: number;
  };

  type Category = {
    created_at?: string;
    icon_url?: string;
    id?: number;
    level?: number;
    name?: string;
    parent_id?: number;
    path?: string;
    sort_order?: number;
    status?: number;
    updated_at?: string;
  };

  type CategoryBrandDetail = {
    brand_id?: number;
    brand_name?: string;
    english_name?: string;
    first_letter?: string;
    logo_url?: string;
    sort_order?: number;
  };

  type CategoryDistDTO = {
    category?: string;
    value?: number;
  };

  type CategoryListResult = {
    list?: Category[];
    total?: number;
  };

  type CheckPermissionsReq = {
    permission_names: string[];
  };

  type CheckPermissionsResult = {
    permissions?: Record<string, any>;
  };

  type ClaimCouponReq = {
    promotion_id: number;
  };

  type CreateAddressReq = {
    city: string;
    consignee: string;
    country?: string;
    detail: string;
    district: string;
    is_default?: boolean;
    phone: string;
    province: string;
    tag?: 'home' | 'office' | 'company' | 'other';
    zip_code?: string;
  };

  type CreateAttributeReq = {
    category_id: number;
    input_type?: 1 | 2 | 3 | 4;
    is_sku_spec?: 0 | 1;
    name: string;
    required?: 0 | 1;
    searchable?: 0 | 1;
    sort_order?: number;
    unit?: string;
    /** JSON */
    values?: string;
  };

  type CreateBrandReq = {
    description?: string;
    english_name?: string;
    first_letter?: string;
    logo_url?: string;
    name: string;
    sort_order?: number;
    status?: 0 | 1;
  };

  type CreateCategoryReq = {
    icon_url?: string;
    name: string;
    parent_id?: number;
    sort_order?: number;
  };

  type CreateOrderItem = {
    quantity: number;
    sku_id: number;
  };

  type CreateOrderReq = {
    address: AddressInfo;
    buyer_remark?: string;
    coupon_id?: number;
    items: CreateOrderItem[];
    source?: string;
  };

  type CreatePaymentReq = {
    amount: number;
    channel?: string;
    order_id: number;
    order_no: string;
    order_type?: string;
    payment_method: string;
  };

  type CreatePermissionReq = {
    action: string;
    category?: string;
    description?: string;
    display_name: string;
    name: string;
    resource: string;
    sort_order?: number;
  };

  type CreateProductAttrItem = {
    attribute_id: number;
    value: string;
  };

  type CreatePromotionReq = {
    benefit_type?: 1 | 2 | 3 | 4 | 5;
    benefit_value?: number;
    condition_type?: 1 | 2 | 3 | 4;
    condition_value?: number;
    end_time: string;
    is_stackable?: 0 | 1;
    per_user_limit?: number;
    /** Products */
    product_ids?: number[];
    promo_code?: string;
    promo_name: string;
    promo_type: 1 | 2 | 3 | 4 | 5 | 6;
    /** Rule */
    rule_name?: string;
    stack_priority?: number;
    start_time: string;
    total_quantity?: number;
  };

  type CreateRefundReq = {
    amount: number;
    payment_no: string;
    reason?: string;
  };

  type CreateReviewReq = {
    content?: string;
    is_anonymous?: boolean;
    logistics_rating?: number;
    order_id: number;
    order_item_id?: number;
    overall_rating: number;
    quality_rating?: number;
    service_rating?: number;
    sku_id?: number;
    spu_id: number;
  };

  type CreateRoleReq = {
    description?: string;
    display_name: string;
    is_system?: boolean;
    name: string;
    sort_order?: number;
    status?: 0 | 1;
  };

  type CreateSKUItem = {
    barcode?: string;
    cost_price?: number;
    height?: number;
    image?: string;
    length?: number;
    market_price?: number;
    max_purchase_qty?: number;
    min_purchase_qty?: number;
    price: number;
    sku_code: string;
    spec?: Record<string, any>;
    volume?: number;
    weight?: number;
    width?: number;
  };

  type CreateSKUReq = {
    barcode?: string;
    cost_price?: number;
    height?: number;
    image?: string;
    length?: number;
    market_price?: number;
    price: number;
    product_id: number;
    sku_code: string;
    spec: string;
    volume?: number;
    weight?: number;
    width?: number;
  };

  type CreateSPUReq = {
    attributes?: CreateProductAttrItem[];
    brand_id?: number;
    category_id: number;
    created_by?: string;
    description?: string;
    images?: string[];
    main_image: string;
    mobile_description?: string;
    name: string;
    skus: CreateSKUItem[];
    sort_order?: number;
    subtitle?: string;
    unit?: string;
    video_url?: string;
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

  type DeductStockReq = {
    operator?: string;
    quantity: number;
    reference_id?: string;
    sku_id: number;
  };

  type deleteAddressesIdParams = {
    /** 地址ID */
    id: number;
  };

  type deleteAdminReviewsIdParams = {
    /** 评价ID */
    id: number;
  };

  type deleteAttributesIdParams = {
    /** 属性ID */
    id: number;
  };

  type deleteBrandsIdParams = {
    /** 品牌ID */
    id: number;
  };

  type deleteCartsParams = {
    /** SKU ID */
    sku_id: number;
  };

  type deleteCategoriesIdParams = {
    /** 类目ID */
    id: number;
  };

  type deleteNotificationsIdParams = {
    /** 通知ID */
    id: number;
  };

  type deletePermissionsIdParams = {
    /** 权限ID */
    id: number;
  };

  type deleteProductsIdParams = {
    /** 商品ID */
    id: number;
  };

  type deletePromotionsIdParams = {
    /** 促销ID */
    id: number;
  };

  type deleteReviewsIdParams = {
    /** 评价ID */
    id: number;
  };

  type deleteRolesIdParams = {
    /** 角色ID */
    id: number;
  };

  type deleteSkusIdParams = {
    /** SKU ID */
    id: number;
  };

  type Description = {
    created_at?: string;
    description?: string;
    id?: number;
    mobile_description?: string;
    product_id?: number;
    updated_at?: string;
  };

  type FlashBuyReq = {
    product_id: number;
    promotion_id: number;
    quantity: number;
    sku_id: number;
  };

  type FlashConfirmReq = {
    address_id?: number;
    token: string;
  };

  type getAddressesIdParams = {
    /** 地址ID */
    id: number;
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

  type getAttributesParams = {
    /** 类目ID */
    category_id: number;
  };

  type getAttributesSearchableParams = {
    /** 类目ID */
    category_id: number;
  };

  type getAttributesSkuSpecParams = {
    /** 类目ID */
    category_id: number;
  };

  type getBrandsIdParams = {
    /** 品牌ID */
    id: number;
  };

  type getBrandsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 品牌名称模糊搜索 */
    name?: string;
    /** 首字母筛选 */
    first_letter?: string;
    /** 状态 1-启用 0-禁用 */
    status?: number;
  };

  type getCategoriesIdBrandsParams = {
    /** 类目ID */
    id: number;
  };

  type getCategoriesIdChildrenParams = {
    /** 父类目ID */
    id: number;
  };

  type getCategoriesIdParams = {
    /** 类目ID */
    id: number;
  };

  type getCategoriesLevelLevelParams = {
    /** 层级（1-3） */
    level: number;
  };

  type getCategoriesParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 类目名称模糊搜索 */
    name?: string;
    /** 状态 1-启用 0-禁用 */
    status?: number;
    /** 层级 1-3 */
    level?: number;
  };

  type getCouponsMeParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getInventoriesLogsParams = {
    /** SKU ID */
    sku_id: number;
    /** 变更类型 */
    change_type?: string;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getInventoriesStockParams = {
    /** SKU ID */
    sku_id: number;
  };

  type getNotificationsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getOrdersOrderNoParams = {
    /** 订单号 */
    order_no: string;
  };

  type getOrdersParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getPaymentsIdParams = {
    /** 支付ID */
    id: number;
  };

  type getPermissionsIdParams = {
    /** 权限ID */
    id: number;
  };

  type getPermissionsParams = {
    category?: string;
    /** 页码，最小 1 */
    page?: number;
    resource?: string;
    role_id?: number;
    /** 每页条数，范围 1..1000 */
    size?: number;
  };

  type getProductsIdParams = {
    /** 商品ID */
    id: number;
  };

  type getProductsIdRatingParams = {
    /** 商品SPU ID */
    id: number;
  };

  type getProductsIdReviewsParams = {
    /** 商品SPU ID */
    id: number;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getProductsParams = {
    /** 每页条数 */
    size?: number;
    /** 游标（首次请求不传，后续使用上次返回的 cursor） */
    cursor?: string;
    /** 商品名称模糊搜索 */
    name?: string;
    /** 类目ID */
    category_id?: number;
    /** 品牌ID */
    brand_id?: number;
    /** 状态 0-草稿 1-待审 2-上架 3-下架 4-封禁 */
    status?: number;
    /** 最低价格（分） */
    price_min?: number;
    /** 最高价格（分） */
    price_max?: number;
  };

  type getPromotionsIdParams = {
    /** 促销ID */
    id: number;
  };

  type getPromotionsParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getReviewsMeParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getRolesIdParams = {
    /** 角色ID */
    id: number;
  };

  type getRolesParams = {
    /** 页码 */
    page?: number;
    /** 每页条数 */
    size?: number;
  };

  type getSkusCodeCodeParams = {
    /** SKU 编码 */
    code: string;
  };

  type getSkusIdParams = {
    /** SKU ID */
    id: number;
  };

  type getSkusParams = {
    /** 产品 ID */
    product_id?: number;
    /** SKU 编码 */
    sku_code?: string;
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
    in_transit?: number;
    last_counted_at?: string;
    last_counted_by?: string;
    max_threshold?: number;
    quantity?: number;
    reserved?: number;
    sku_id?: number;
    status?: string;
    threshold?: number;
    updated_at?: string;
    warehouse_id?: number;
  };

  type InventoryLog = {
    after_quantity?: number;
    after_reserved?: number;
    before_quantity?: number;
    before_reserved?: number;
    change_amount?: number;
    change_type?: string;
    created_at?: string;
    id?: number;
    note?: string;
    operator?: string;
    reference_id?: string;
    sku_id?: number;
    warehouse_id?: number;
  };

  type InventoryLogListResult = {
    list?: InventoryLog[];
    total?: number;
  };

  type LockStockReq = {
    operator?: string;
    quantity: number;
    reference_id?: string;
    sku_id: number;
  };

  type LoginResponse = {
    access_token?: string;
    expires_at?: number;
    is_new_user?: boolean;
    refresh_token?: string;
    token_type?: string;
    user_id?: number;
    username?: string;
  };

  type MethodDistDTO = {
    label?: string;
    method?: string;
    value?: number;
  };

  type ModerateReviewReq = {
    reason?: string;
    status: 1 | 2;
  };

  type NotificationListResult = {
    list?: NotificationResp[];
    total?: number;
  };

  type NotificationResp = {
    category?: number;
    channel?: number;
    content?: string;
    content_template?: string;
    created_at?: number;
    created_by?: number;
    icon_url?: string;
    id?: number;
    is_processed?: boolean;
    is_read?: boolean;
    priority?: number;
    process_result?: string;
    processed_at?: number;
    read_at?: number;
    redirect_url?: string;
    target_id?: number;
    target_type?: string;
    template_params?: string;
    title?: string;
    updated_at?: number;
    user_id?: number;
  };

  type OnlineStatsResponse = {
    /** 连接数 */
    connections?: number;
    /** 在线用户数 */
    online_users?: number;
  };

  type Order = {
    buyer_remark?: string;
    city?: string;
    closed_at?: string;
    completed_at?: string;
    consignee?: string;
    coupon_id?: number;
    coupon_snapshot?: string;
    created_at?: string;
    delivered_at?: string;
    detail_addr?: string;
    discount_amount?: number;
    district?: string;
    id?: number;
    order_no?: string;
    paid_at?: string;
    pay_amount?: number;
    payment_method?: string;
    payment_status?: string;
    phone?: string;
    province?: string;
    seller_remark?: string;
    shipped_at?: string;
    shipping_fee?: number;
    source?: string;
    status?: string;
    total_amount?: number;
    updated_at?: string;
    user_id?: number;
    zip_code?: string;
  };

  type OrderListResult = {
    list?: Order[];
    total?: number;
  };

  type OrderTrendDTO = {
    amount?: number;
    count?: number;
    date?: string;
  };

  type PasswordLoginReq = {
    password: string;
    username: string;
  };

  type patchAdminReviewsIdModerateParams = {
    /** 评价ID */
    id: number;
  };

  type Payment = {
    amount?: number;
    channel?: string;
    created_at?: string;
    currency?: string;
    failure_reason?: string;
    id?: number;
    order_id?: number;
    order_no?: string;
    order_type?: string;
    paid_at?: string;
    payment_method?: string;
    payment_no?: string;
    status?: string;
    transaction_id?: string;
    updated_at?: string;
  };

  type PaymentCallbackReq = {
    channel?: string;
    failure_reason?: string;
    payment_no: string;
    raw_body?: string;
    status: 'success' | 'failed';
    transaction_id: string;
  };

  type Permission = {
    action?: string;
    category?: string;
    created_at?: string;
    description?: string;
    display_name?: string;
    id?: number;
    name?: string;
    resource?: string;
    sort_order?: number;
    status?: number;
    updated_at?: string;
  };

  type PermissionListResult = {
    list?: Permission[];
    total?: number;
  };

  type postAdminReviewsIdReplyParams = {
    /** 评价ID */
    id: number;
  };

  type postCartsClearParams = {
    /** 会话ID */
    session_id?: string;
  };

  type ProductAttrResponse = {
    attribute_id?: number;
    attribute_name?: string;
    sort_order?: number;
    value?: string;
  };

  type Promotion = {
    created_at?: string;
    created_by?: number;
    end_time?: string;
    id?: number;
    per_user_limit?: number;
    promo_code?: string;
    promo_name?: string;
    promo_type?: number;
    rule_id?: number;
    start_time?: string;
    status?: number;
    total_quantity?: number;
    updated_at?: string;
    updated_by?: number;
    used_quantity?: number;
  };

  type PromotionListResult = {
    list?: Promotion[];
    total?: number;
  };

  type putAddressesIdParams = {
    /** 地址ID */
    id: number;
  };

  type putAttributesIdParams = {
    /** 属性ID */
    id: number;
  };

  type putBrandsIdParams = {
    /** 品牌ID */
    id: number;
  };

  type putCategoriesIdBrandsParams = {
    /** 类目ID */
    id: number;
  };

  type putCategoriesIdParams = {
    /** 类目ID */
    id: number;
  };

  type putNotificationsIdReadParams = {
    /** 通知ID */
    id: number;
  };

  type putOrdersOrderNoStatusParams = {
    /** 订单号 */
    order_no: string;
  };

  type putPermissionsIdParams = {
    /** 权限ID */
    id: number;
  };

  type putProductsIdParams = {
    /** 商品ID */
    id: number;
  };

  type putPromotionsIdParams = {
    /** 促销ID */
    id: number;
  };

  type putRolesIdParams = {
    /** 角色ID */
    id: number;
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

  type RefreshTokenReq = {
    refresh_token: string;
  };

  type RegisterReq = {
    email?: string;
    password?: string;
    phone?: string;
    provider: string;
    username?: string;
  };

  type ReplyReviewReq = {
    content: string;
  };

  type Response = {
    code?: number;
    data?: any;
    message?: string;
    trace_id?: string;
  };

  type RestockReq = {
    note?: string;
    operator?: string;
    quantity: number;
    reference_id?: string;
    sku_id: number;
    warehouse_id?: number;
  };

  type ReviewListResult = {
    list?: ReviewResp[];
    total?: number;
  };

  type ReviewRatingResp = {
    avg_logistics_rating?: number;
    avg_overall_rating?: number;
    avg_quality_rating?: number;
    avg_service_rating?: number;
    rating_1_count?: number;
    rating_2_count?: number;
    rating_3_count?: number;
    rating_4_count?: number;
    rating_5_count?: number;
    spu_id?: number;
    total_reviews?: number;
    with_media_count?: number;
  };

  type ReviewResp = {
    content?: string;
    created_at?: number;
    helpful_count?: number;
    id?: number;
    is_anonymous?: boolean;
    like_count?: number;
    logistics_rating?: number;
    order_id?: number;
    order_item_id?: number;
    overall_rating?: number;
    quality_rating?: number;
    reject_reason?: string;
    reply_count?: number;
    service_rating?: number;
    sku_id?: number;
    spu_id?: number;
    status?: number;
    updated_at?: number;
    user_id?: number;
  };

  type Role = {
    created_at?: string;
    description?: string;
    display_name?: string;
    id?: number;
    is_system?: boolean;
    name?: string;
    sort_order?: number;
    status?: number;
    updated_at?: string;
  };

  type RoleListResult = {
    list?: Role[];
    total?: number;
  };

  type SendSystemNotificationReq = {
    content: string;
    title: string;
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

  type SetCategoryBrandsReq = {
    brand_ids: number[];
    sort_order?: number;
  };

  type SKU = {
    barcode?: string;
    cost_price?: number;
    created_at?: string;
    height?: number;
    id?: number;
    image?: string;
    length?: number;
    market_price?: number;
    max_purchase_qty?: number;
    min_purchase_qty?: number;
    price?: number;
    product_id?: number;
    sku_code?: string;
    spec?: string;
    status?: number;
    updated_at?: string;
    volume?: number;
    weight?: number;
    width?: number;
  };

  type SPU = {
    brand_id?: number;
    category_id?: number;
    created_at?: string;
    created_by?: string;
    has_description?: number;
    id?: number;
    images?: string;
    main_image?: string;
    max_price?: number;
    min_price?: number;
    name?: string;
    rating_average?: number;
    rating_count?: number;
    sales_count?: number;
    sort_order?: number;
    status?: number;
    subtitle?: string;
    total_stock?: number;
    unit?: string;
    updated_at?: string;
    updated_by?: string;
    video_url?: string;
  };

  type SkuDetailItem = {
    id?: number;
    sku_code?: string;
    spec?: Record<string, string>;
    price?: number;
  };

  type SPUDetailResponse = {
    attributes?: ProductAttrResponse[];
    brand_id?: number;
    category_id?: number;
    created_at?: string;
    created_by?: string;
    description?: Description;
    has_description?: number;
    id?: number;
    images?: string;
    main_image?: string;
    max_price?: number;
    min_price?: number;
    name?: string;
    rating_average?: number;
    rating_count?: number;
    sales_count?: number;
    skus?: SkuDetailItem[];
    sort_order?: number;
    status?: number;
    subtitle?: string;
    total_stock?: number;
    unit?: string;
    updated_at?: string;
    updated_by?: string;
    video_url?: string;
  };

  type SPUListResult = {
    cursor?: string;
    has_more?: boolean;
    list?: SPU[];
  };

  type StatusDistDTO = {
    label?: string;
    status?: string;
    value?: number;
  };

  type SummaryDTO = {
    low_stock_count?: number;
    total_orders?: number;
    total_products?: number;
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

  type TokenResponse = {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    token_type?: string;
  };

  type TopProductDTO = {
    amount?: number;
    count?: number;
    name?: string;
  };

  type UnlockStockReq = {
    operator?: string;
    quantity: number;
    reference_id?: string;
    sku_id: number;
  };

  type UnreadCountResp = {
    count?: number;
  };

  type UpdateAddressReq = {
    city?: string;
    consignee?: string;
    country?: string;
    detail?: string;
    district?: string;
    is_default?: boolean;
    phone?: string;
    province?: string;
    tag?: 'home' | 'office' | 'company' | 'other';
    zip_code?: string;
  };

  type UpdateAttributeReq = {
    input_type?: 1 | 2 | 3 | 4;
    is_sku_spec?: 0 | 1;
    name?: string;
    required?: 0 | 1;
    searchable?: 0 | 1;
    sort_order?: number;
    status?: 0 | 1;
    unit?: string;
    values?: string;
  };

  type UpdateBrandReq = {
    description?: string;
    english_name?: string;
    first_letter?: string;
    logo_url?: string;
    name?: string;
    sort_order?: number;
    status?: 0 | 1;
  };

  type UpdateCategoryReq = {
    icon_url?: string;
    name?: string;
    sort_order?: number;
    status?: 0 | 1;
  };

  type UpdateItemReq = {
    quantity?: number;
    sku_id: number;
  };

  type UpdateOrderStatusReq = {
    note?: string;
    status: 'cancelled' | 'shipped' | 'delivered' | 'completed';
  };

  type UpdatePermissionReq = {
    category?: string;
    description?: string;
    display_name?: string;
    sort_order?: number;
    status?: 0 | 1;
  };

  type UpdatePromotionReq = {
    benefit_type?: 1 | 2 | 3 | 4 | 5;
    benefit_value?: number;
    condition_type?: 1 | 2 | 3 | 4;
    condition_value?: number;
    end_time?: string;
    is_stackable?: 0 | 1;
    per_user_limit?: number;
    promo_name?: string;
    rule_name?: string;
    stack_priority?: number;
    start_time?: string;
    status?: 1 | 2 | 3 | 4;
    total_quantity?: number;
  };

  type UpdateRoleReq = {
    description?: string;
    display_name?: string;
    sort_order?: number;
    status?: 0 | 1;
  };

  type UpdateSKUReq = {
    barcode?: string;
    cost_price?: number;
    height?: number;
    image?: string;
    length?: number;
    market_price?: number;
    price?: number;
    status?: 0 | 1;
    volume?: number;
    weight?: number;
    width?: number;
  };

  type UpdateSPUReq = {
    images?: string[];
    main_image?: string;
    name?: string;
    sort_order?: number;
    status?: 0 | 1 | 2 | 3 | 4;
    subtitle?: string;
    unit?: string;
    updated_by?: string;
    video_url?: string;
  };

  type UpdateUserInfoReq = {
    avatar?: string;
    bio?: string;
    birthday?: string;
    city?: string;
    country?: string;
    gender?: 0 | 1 | 2;
    language?: string;
    nickname?: string;
    province?: string;
    timezone?: string;
    zip_code?: string;
  };

  type UseCouponReq = {
    order_id: number;
    user_promotion_id: number;
  };

  type UserInfoResponse = {
    bio?: string;
    birthday?: string;
    city?: string;
    country?: string;
    gender?: number;
    language?: string;
    province?: string;
    timezone?: string;
    zip_code?: string;
  };

  type UserProfileResponse = {
    avatar?: string;
    email?: string;
    email_verified?: boolean;
    id?: number;
    nickname?: string;
    phone?: string;
    phone_verified?: boolean;
    status?: number;
    user_info?: UserInfoResponse;
    username?: string;
  };

  type UserPromotion = {
    acquire_time?: string;
    created_at?: string;
    created_by?: number;
    expire_time?: string;
    id?: number;
    order_id?: number;
    promotion_id?: number;
    queue_token?: string;
    status?: number;
    updated_at?: string;
    updated_by?: number;
    used_time?: string;
    user_id?: number;
  };

  type UserPromotionListResult = {
    list?: UserPromotion[];
    total?: number;
  };
}

import { getProductsCache } from '@/services/api/products';
import { getSkus } from '@/services/api/skus';
import { useEffect, useState } from 'react';

/**
 * 获取所有 SKU 选项列表（用于表单下拉选择器）
 * 先拉取商品缓存，再逐个拉取每个商品下的 SKU
 * @param visible 弹窗打开时才拉取
 */
export default function useSkuOptions(visible: boolean) {
  const [skus, setSkus] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    if (!visible) return;

    const fetchSkus = async () => {
      try {
        const res = await getProductsCache({ page: 1, size: 100 });
        const data = (res as any).data || {};
        const products: API.CachedProductItem[] = data.list || [];

        const allSkus: { label: string; value: number }[] = [];
        for (const product of products) {
          try {
            const skuRes = await getSkus({ product_id: product.id || 0 });
            const skuData = (skuRes as any).data || {};
            const skuList: API.SkuResponse[] = skuData.list || [];
            for (const sku of skuList) {
              allSkus.push({
                label: `${product.name} - ${sku.name}（${sku.sku_code}）`,
                value: sku.id || 0,
              });
            }
          } catch {
            // 跳过获取失败的 SKU
          }
        }
        setSkus(allSkus);
      } catch {
        console.error('Failed to fetch SKU options');
      }
    };

    fetchSkus();
  }, [visible]);

  return skus;
}

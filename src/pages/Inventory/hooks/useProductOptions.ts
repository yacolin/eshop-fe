import { getProductsCache } from '@/services/api/products';
import { useEffect, useState } from 'react';

/**
 * 获取产品选项列表（用于表单下拉选择器）
 * @param visible 弹窗打开时才拉取
 */
export default function useProductOptions(visible: boolean) {
  const [products, setProducts] = useState<{ label: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const fetchProducts = async () => {
      try {
        const res = await getProductsCache({ page: 1, size: 1000 });
        const data = (res as any).data || {};
        const list = data.list || [];
        setProducts(
          list.map((p: API.Product) => ({
            label: `[${p.sku}] ${p.name}`,
            value: p.id || 0,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [visible]);

  return products;
}

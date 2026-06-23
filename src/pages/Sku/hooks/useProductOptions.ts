import { getProductsCache } from '@/services/api/products';
import { useEffect, useState } from 'react';

/**
 * 获取产品选项列表（用于表单下拉选择器）
 * @param visible 弹窗打开时才拉取
 */
export default function useProductOptions(visible: boolean) {
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const fetchOptions = async () => {
      try {
        const res = await getProductsCache({ page: 1, size: 1000 });
        const data = (res as any).data || {};
        const list: API.CachedProductItem[] = data.list || [];
        setOptions(
          list.map((item) => ({
            label: item.name || '',
            value: item.id || 0,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch product options:', error);
      }
    };

    fetchOptions();
  }, [visible]);

  return options;
}

import { getProductsEnriched } from '@/services/api/products';
import { useEffect, useState } from 'react';

/**
 * 按分类获取产品选项列表（用于新建/批量创建SKU的表单下拉选择器）
 * @param visible 弹窗打开时才拉取
 * @param categoryId 可选，按分类过滤产品
 */
export default function useProductOptionsByCategory(
  visible: boolean,
  categoryId?: number,
) {
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const fetchOptions = async () => {
      try {
        const params: any = { page: 1, size: 1000 };
        if (categoryId) params.category_id = categoryId;
        const res = await getProductsEnriched(params);
        const data = (res as any).data || {};
        const list = data.list || [];
        setOptions(
          list.map((item: { id?: number; name?: string }) => ({
            label: item.name || '',
            value: item.id || 0,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch product options by category:', error);
      }
    };

    fetchOptions();
  }, [visible, categoryId]);

  return options;
}

import { getCategoriesNonRoot } from '@/services/api/categories';
import { useEffect, useState } from 'react';

/**
 * 获取非根分类选项列表（用于产品分类筛选/选择）
 * @param visible 弹窗打开时才拉取
 */
export default function useNonRootCategoryOptions(visible: boolean) {
  const [categories, setCategories] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!visible) return;

    const fetchCategories = async () => {
      try {
        const res = await getCategoriesNonRoot();
        const data = (res as any).data || {};
        const list = data.list || [];
        setCategories(
          list.map((c: API.Category) => ({
            label: c.name || '',
            value: c.id || 0,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch non-root categories:', error);
      }
    };

    fetchCategories();
  }, [visible]);

  return categories;
}

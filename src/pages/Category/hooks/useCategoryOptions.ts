import { getCategoriesAll } from '@/services/api/categories';
import { useEffect, useState } from 'react';

/**
 * 获取分类选项列表（用于表单下拉选择器）
 * @param visible 弹窗打开时才拉取
 * @param excludeId 可选项，排除自身分类 ID（编辑时用）
 */
export default function useCategoryOptions(
  visible: boolean,
  excludeId?: number,
) {
  const [categories, setCategories] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!visible) return;

    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAll();
        const list = (res as any).data || [];
        setCategories(
          list
            .filter((c: API.Category) => c.id !== excludeId)
            .map((c: API.Category) => ({
              label: c.name || '',
              value: c.id || 0,
            })),
        );
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [visible, excludeId]);

  return categories;
}

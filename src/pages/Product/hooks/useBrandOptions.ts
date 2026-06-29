import { getBrands } from '@/services/api/brands';
import { useEffect, useState } from 'react';

/**
 * 获取品牌选项列表（用于表单下拉选择器）
 * @param visible 弹窗打开时才拉取
 */
export default function useBrandOptions(visible: boolean) {
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const fetchOptions = async () => {
      try {
        const res = await getBrands({ page: 1, size: 200 });
        const data = (res as any).data || {};
        const list = data.list || [];
        setOptions(
          list.map((item: API.Brand) => ({
            label: item.name || '',
            value: item.id || 0,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch brand options:', error);
      }
    };

    fetchOptions();
  }, [visible]);

  return options;
}

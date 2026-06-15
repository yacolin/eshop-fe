import { useLocation } from '@umijs/max';
import { useEffect, useRef } from 'react';

/**
 * 从路由 state 读取初始筛选条件，在 ProTable 首次请求时自动应用。
 * 首次请求使用路由传入值（当表单值为空时），之后以表单值为准。
 *
 * @example
 * const formRef = useRef<any>(null);
 * const { getFilter, markApplied } = useRouteFilter(formRef, ['product_name', 'sku']);
 *
 * // 在 ProTable request 中:
 * const { product_name: formVal, ...rest } = params;
 * const productName = getFilter('product_name', formVal);
 * markApplied();
 */
export function useRouteFilter<T extends Record<string, any>>(
  formRef: React.MutableRefObject<any>,
  keys: (keyof T)[],
) {
  const location = useLocation() as any;

  const initialFilters = useRef<Partial<T>>(
    keys.reduce((acc, key) => {
      const stateKey = key as string;
      if (location.state?.[stateKey] !== undefined) {
        (acc as any)[key] = location.state[stateKey];
      }
      return acc;
    }, {} as Partial<T>),
  );

  const initialAppliedRef = useRef(false);

  // 延迟回填搜索框（仅视觉反馈，不触发请求）
  useEffect(() => {
    const filters = initialFilters.current;
    if (Object.keys(filters).length === 0) return;
    const timer = setTimeout(() => {
      formRef.current?.setFieldsValue(filters);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  function getFilter<K extends keyof T>(
    key: K,
    formValue: T[K] | undefined,
  ): T[K] | undefined {
    if (
      !initialAppliedRef.current &&
      initialFilters.current[key] !== undefined &&
      formValue === undefined
    ) {
      return initialFilters.current[key];
    }
    return formValue;
  }

  function markApplied() {
    initialAppliedRef.current = true;
  }

  return { getFilter, markApplied };
}

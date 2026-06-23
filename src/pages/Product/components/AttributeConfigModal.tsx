import { getAttributes } from '@/services/api/attributes';
import { getAttributesIdValues } from '@/services/api/attributeValues';
import { getCategoriesIdAttributes } from '@/services/api/categories';
import {
  getProductsIdAttributes,
  getProductsIdEnriched,
  putProductsIdAttributes,
} from '@/services/api/products';
import { Checkbox, message, Modal, Spin, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface AttributeConfigModalProps {
  productId: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

type AttrWithValues = {
  id: number;
  name: string;
  values: API.AttributeValueResponse[];
};

const AttributeConfigModal: React.FC<AttributeConfigModalProps> = ({
  productId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [attributes, setAttributes] = useState<AttrWithValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Record<number, Set<number>>>({});
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const fetchedRef = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. 获取产品所属品类
      let allowedAttrIds: Set<number> | null = null;
      try {
        const enrichedRes = await getProductsIdEnriched({ id: productId });
        const enriched = (enrichedRes as any).data || {};
        const categories: API.ProductCategoryBrief[] =
          enriched.categories || [];
        if (categories.length > 0) {
          setCategoryNames(categories.map((c) => c.name || '').filter(Boolean));
          // 并行拉取每个品类允许的属性
          const catAttrResults = await Promise.all(
            categories.map((cat) =>
              getCategoriesIdAttributes({ id: cat.id! })
                .then((res) => (res as any).data || [])
                .catch(() => [] as API.CategoryAttributeResponse[]),
            ),
          );
          const ids = new Set<number>();
          for (const attrs of catAttrResults) {
            for (const a of attrs) {
              if (a.attribute_id) ids.add(a.attribute_id);
            }
          }
          allowedAttrIds = ids.size > 0 ? ids : null;
        }
      } catch {
        // 品类信息获取失败，不限制
      }

      // 2. 从属性目录获取所有维度
      const attrRes = await getAttributes({ page: 1, size: 200 });
      const attrList = ((attrRes as any).data || {}).list || [];

      if (attrList.length === 0) {
        setAttributes([]);
        setSelected({});
        return;
      }

      // 3. 按品类允许的属性过滤
      const filteredList = allowedAttrIds
        ? attrList.filter((a: API.AttributeResponse) =>
            allowedAttrIds.has(a.id!),
          )
        : attrList;

      if (filteredList.length === 0) {
        setAttributes([]);
        setSelected({});
        return;
      }

      // 4. 获取当前产品已关联的属性值（用于预勾选）
      const prodAttrRes = await getProductsIdAttributes({ id: productId });
      const prodAttrs = (prodAttrRes as any).data || [];

      const existingMap: Record<number, Set<number>> = {};
      for (const pa of prodAttrs) {
        existingMap[pa.attribute_id || 0] = new Set(
          (pa.values || []).map((v: API.AttributeValueItem) => v.value_id!),
        );
      }

      // 5. 并行拉取每个属性的可选值
      const valuesResults = await Promise.all(
        filteredList.map((a: API.AttributeResponse) =>
          getAttributesIdValues({ id: a.id! })
            .then((res) => (res as any).data || [])
            .catch(() => [] as API.AttributeValueResponse[]),
        ),
      );

      const merged: AttrWithValues[] = filteredList.map(
        (a: API.AttributeResponse, idx: number) => ({
          id: a.id!,
          name: a.name || '',
          values: valuesResults[idx] || [],
        }),
      );

      setAttributes(merged);

      // 6. 设置预勾选状态
      const initSelected: Record<number, Set<number>> = {};
      for (const attr of merged) {
        const existing = existingMap[attr.id];
        initSelected[attr.id] =
          existing && existing.size > 0 ? new Set(existing) : new Set();
      }
      setSelected(initSelected);
    } catch {
      message.error('获取属性数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchData();
    }
    if (!visible) {
      fetchedRef.current = false;
    }
  }, [productId, visible]);

  useEffect(() => {
    if (visible) {
      fetchedRef.current = false;
    }
  }, [productId]);

  const toggleValue = (attrId: number, valueId: number) => {
    setSelected((prev) => {
      const next = new Set(prev[attrId] || []);
      if (next.has(valueId)) {
        next.delete(valueId);
      } else {
        next.add(valueId);
      }
      return { ...prev, [attrId]: next };
    });
  };

  const toggleAllValues = (attrId: number, check: boolean) => {
    const attr = attributes.find((a) => a.id === attrId);
    if (!attr) return;
    setSelected((prev) => ({
      ...prev,
      [attrId]: check
        ? new Set(attr.values.map((v) => v.id!).filter(Boolean))
        : new Set(),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const selectedAttrs = attributes
        .filter((a) => (selected[a.id]?.size || 0) > 0)
        .map((a) => ({
          attribute_id: a.id,
          value_ids: Array.from(selected[a.id] || []),
        }));

      await putProductsIdAttributes(
        { id: productId },
        { attributes: selectedAttrs },
      );
      message.success('属性配置保存成功');
      onSuccess?.();
      onCancel();
    } catch {
      message.error('属性配置保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="配置产品属性"
      width={640}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={saving}
      destroyOnHidden
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      ) : attributes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
          暂无可用属性，请先在属性管理页面创建属性
        </div>
      ) : (
        <>
          {categoryNames.length > 0 && (
            <div style={{ marginBottom: 16, fontSize: 13, color: '#666' }}>
              品类：
              {categoryNames.map((name) => (
                <Tag key={name} style={{ marginRight: 4 }}>
                  {name}
                </Tag>
              ))}
            </div>
          )}
          {attributes.map((attr) => (
            <div
              key={attr.id}
              style={{
                marginBottom: 16,
                padding: 12,
                border: '1px solid #f0f0f0',
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <strong>{attr.name}</strong>
                <span style={{ fontSize: 12, color: '#999' }}>
                  <a
                    style={{ marginRight: 8 }}
                    onClick={() => toggleAllValues(attr.id, true)}
                  >
                    全选
                  </a>
                  <a onClick={() => toggleAllValues(attr.id, false)}>清空</a>
                </span>
              </div>
              {attr.values.length === 0 ? (
                <span style={{ color: '#ccc', fontSize: 13 }}>
                  该属性暂无可选值
                </span>
              ) : (
                (attr.values || []).map((v) => (
                  <Checkbox
                    key={v.id}
                    checked={selected[attr.id]?.has(v.id!) || false}
                    onChange={() => toggleValue(attr.id, v.id!)}
                    style={{ marginRight: 16, marginBottom: 4 }}
                  >
                    {v.value}
                  </Checkbox>
                ))
              )}
            </div>
          ))}
        </>
      )}
    </Modal>
  );
};

export default AttributeConfigModal;

import { getAttributes } from '@/services/api/attributes';
import {
  getCategoriesIdAttributes,
  putCategoriesIdAttributes,
} from '@/services/api/categories';
import { Checkbox, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

interface CategoryAttributeModalProps {
  categoryId: number;
  categoryName: string;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CategoryAttributeModal: React.FC<CategoryAttributeModalProps> = ({
  categoryId,
  categoryName,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [allAttributes, setAllAttributes] = useState<API.AttributeResponse[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attrRes, catAttrRes] = await Promise.all([
        getAttributes({ page: 1, size: 200 }),
        getCategoriesIdAttributes({ id: categoryId }),
      ]);
      const attrData = (attrRes as any).data || {};
      setAllAttributes(attrData.list || []);

      const catAttrData = (catAttrRes as any).data || [];
      setSelectedIds(
        new Set(
          catAttrData.map(
            (item: API.CategoryAttributeResponse) => item.attribute_id!,
          ),
        ),
      );
    } catch {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchData();
  }, [categoryId, visible]);

  const toggleAttribute = (attrId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(attrId)) {
        next.delete(attrId);
      } else {
        next.add(attrId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await putCategoriesIdAttributes(
        { id: categoryId },
        { attribute_ids: Array.from(selectedIds) },
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
      title={`配置品类属性 — ${categoryName}`}
      width={600}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={saving}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      ) : allAttributes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
          暂无可配置的属性，请先创建属性
        </div>
      ) : (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {allAttributes.map((attr) => (
            <div
              key={attr.id}
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Checkbox
                checked={selectedIds.has(attr.id!)}
                onChange={() => toggleAttribute(attr.id!)}
              >
                {attr.name}
              </Checkbox>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default CategoryAttributeModal;

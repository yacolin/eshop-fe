import {
  getProductsIdAttributes,
  putProductsIdAttributes,
} from '@/services/api/products';
import { Checkbox, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

interface AttributeConfigModalProps {
  productId: number;
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const AttributeConfigModal: React.FC<AttributeConfigModalProps> = ({
  productId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [attributes, setAttributes] = useState<API.ProductAttributeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Record<number, Set<number>>>({});

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await getProductsIdAttributes({ id: productId });
      const data = (res as any).data || [];
      setAttributes(data);
      const initSelected: Record<number, Set<number>> = {};
      for (const attr of data) {
        initSelected[attr.attribute_id || 0] = new Set(
          (attr.values || []).map((v) => v.value_id!).filter(Boolean),
        );
      }
      setSelected(initSelected);
    } catch {
      message.error('获取属性定义失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchAttributes();
  }, [productId, visible]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await putProductsIdAttributes(
        { id: productId },
        {
          attributes: attributes.map((attr) => ({
            attribute_id: attr.attribute_id!,
            value_ids: Array.from(selected[attr.attribute_id || 0] || []),
          })),
        },
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
      ) : attributes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
          该产品尚未关联规格属性
        </div>
      ) : (
        attributes.map((attr) => (
          <div key={attr.attribute_id} style={{ marginBottom: 12 }}>
            <strong
              style={{
                marginRight: 16,
                minWidth: 60,
                display: 'inline-block',
              }}
            >
              {attr.attribute_name}：
            </strong>
            {(attr.values || []).map((v) => (
              <Checkbox
                key={v.value_id}
                checked={
                  selected[attr.attribute_id || 0]?.has(v.value_id!) || false
                }
                onChange={() => toggleValue(attr.attribute_id!, v.value_id!)}
                style={{ marginRight: 12 }}
              >
                {v.value}
              </Checkbox>
            ))}
          </div>
        ))
      )}
    </Modal>
  );
};

export default AttributeConfigModal;

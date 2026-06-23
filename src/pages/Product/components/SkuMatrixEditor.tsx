import {
  getProductsIdAttributes,
  postProductsIdSkusBatch,
} from '@/services/api/products';
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Spin,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

interface SkuMatrixEditorProps {
  productId: number;
  /** 默认价格（分），从 Product.min_price 传入 */
  defaultPrice?: number;
  onSuccess?: () => void;
}

type ComboItem = {
  attrId: number;
  attrName: string;
  valueId: number;
  value: string;
};

/** 笛卡尔积：生成所有属性组合 */
function cartesian<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]],
  );
}

const SkuMatrixEditor: React.FC<SkuMatrixEditorProps> = ({
  productId,
  defaultPrice,
  onSuccess,
}) => {
  const [attributes, setAttributes] = useState<API.ProductAttributeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selected, setSelected] = useState<Record<number, Set<number>>>({});

  const [rowData, setRowData] = useState<
    Record<string, { price: number; sku_code: string; image: string }>
  >({});

  /** 生成默认 SKU 编码：SKU-P{产品ID}{属性值ID序列}-{4位随机大写字母} */
  const generateSkuCode = (combo: ComboItem[]) => {
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU-P${productId}${combo.map((c) => c.valueId).join('')}-${suffix}`;
  };

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
    fetchAttributes();
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

  // 属性组合
  const combinations = useMemo(() => {
    const activeAttrs = attributes.filter(
      (a) => (selected[a.attribute_id || 0]?.size || 0) > 0,
    );
    if (activeAttrs.length === 0) return [];

    const valueArrays = activeAttrs.map((a) => {
      const ids = Array.from(selected[a.attribute_id || 0] || []);
      return ids.map((valueId) => {
        const v = (a.values || []).find((v) => v.value_id === valueId);
        return {
          attrId: a.attribute_id!,
          attrName: a.attribute_name!,
          valueId,
          value: v?.value || '',
        };
      });
    });

    return cartesian(valueArrays);
  }, [attributes, selected]);

  const getRowKey = (combo: ComboItem[]) =>
    combo.map((c) => c.valueId).join(',');

  const generateName = (combo: ComboItem[]) =>
    combo.map((c) => c.value).join('-');

  // 组合变化时自动生成默认价格和 SKU 编码（保留已有编辑）
  useEffect(() => {
    if (combinations.length === 0) return;
    setRowData((prev) => {
      const next: Record<
        string,
        { price: number; sku_code: string; image: string }
      > = {};
      for (const combo of combinations) {
        const key = getRowKey(combo);
        next[key] = prev[key] || {
          price: (defaultPrice || 0) / 100,
          sku_code: generateSkuCode(combo),
          image: '',
        };
      }
      return next;
    });
  }, [combinations]);

  const updateRow = (
    key: string,
    field: 'price' | 'sku_code' | 'image',
    val: any,
  ) => {
    setRowData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }));
  };

  const handleSubmit = async () => {
    const skus = combinations.map((combo) => {
      const key = getRowKey(combo);
      const d = rowData[key] || { price: 0, sku_code: '', image: '' };
      return {
        attr_value_ids: combo.map((c) => c.valueId),
        name: generateName(combo),
        price: Math.round(d.price * 100),
        sku_code: d.sku_code,
        image: d.image || undefined,
      };
    });

    setSaving(true);
    try {
      const res = await postProductsIdSkusBatch({ id: productId }, { skus });
      const result = (res as any).data as API.BatchCreateSkuResult | undefined;
      message.success(
        `创建完成：成功 ${result?.success || 0} 个${
          result?.failed ? `，失败 ${result.failed} 个` : ''
        }`,
      );
      setRowData({});
      onSuccess?.();
    } catch {
      message.error('批量创建 SKU 失败');
    } finally {
      setSaving(false);
    }
  };

  // 构建表格数据源：每行是一个对象，_combo 保存原始组合数组
  const dataSource = useMemo(
    () =>
      combinations.map((combo, idx) => ({
        _combo: combo,
        key: idx,
      })),
    [combinations],
  );

  const columns = [
    ...attributes
      .filter((a) => (selected[a.attribute_id || 0]?.size || 0) > 0)
      .map((attr) => ({
        title: attr.attribute_name,
        dataIndex: attr.attribute_name,
        key: attr.attribute_id,
        width: 120,
        render: (_: any, record: { _combo: ComboItem[] }) =>
          record._combo.find((c) => c.attrId === attr.attribute_id)?.value,
      })),
    {
      title: 'SKU 名称',
      key: 'name',
      width: 150,
      render: (_: any, record: { _combo: ComboItem[] }) =>
        generateName(record._combo),
    },
    {
      title: '价格（元）',
      key: 'price',
      width: 140,
      render: (_: any, record: { _combo: ComboItem[] }) => {
        const key = getRowKey(record._combo);
        return (
          <InputNumber
            min={0}
            precision={2}
            prefix="¥"
            style={{ width: 120 }}
            placeholder="0.00"
            value={rowData[key]?.price}
            onChange={(v) => updateRow(key, 'price', v)}
          />
        );
      },
    },
    {
      title: 'SKU 编码',
      key: 'sku_code',
      width: 160,
      render: (_: any, record: { _combo: ComboItem[] }) => {
        const key = getRowKey(record._combo);
        return (
          <Input
            style={{ width: 140 }}
            placeholder="如: P001-RED-128"
            value={rowData[key]?.sku_code}
            onChange={(e) => updateRow(key, 'sku_code', e.target.value)}
          />
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin tip="加载属性定义..." />
      </div>
    );
  }

  if (attributes.length === 0) {
    return (
      <Tag color="warning" style={{ fontSize: 14, padding: '4px 12px' }}>
        该产品尚未关联规格属性，请先在后台管理属性
      </Tag>
    );
  }

  return (
    <div>
      {/* 属性值选择 */}
      <div style={{ marginBottom: 16 }}>
        {attributes.map((attr) => (
          <div key={attr.attribute_id} style={{ marginBottom: 8 }}>
            <strong
              style={{ marginRight: 12, minWidth: 60, display: 'inline-block' }}
            >
              {attr.attribute_name}：
            </strong>
            {(attr.values || []).map((v) => (
              <Checkbox
                key={v.value_id}
                checked={selected[attr.attribute_id || 0]?.has(v.value_id!)}
                onChange={() => toggleValue(attr.attribute_id!, v.value_id!)}
                style={{ marginRight: 12 }}
              >
                {v.value}
              </Checkbox>
            ))}
          </div>
        ))}
      </div>

      {/* 组合矩阵 */}
      {dataSource.length > 0 && (
        <>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size="small"
            bordered
            style={{ marginBottom: 16 }}
          />

          <div style={{ textAlign: 'right' }}>
            <span style={{ marginRight: 16, color: '#666' }}>
              共 {dataSource.length} 个 SKU
            </span>
            <Popconfirm
              title="确认批量创建"
              description={`将创建 ${dataSource.length} 个 SKU，确认？`}
              onConfirm={handleSubmit}
            >
              <Button type="primary" loading={saving}>
                批量创建 SKU
              </Button>
            </Popconfirm>
          </div>
        </>
      )}
    </div>
  );
};

export default SkuMatrixEditor;

import { Checkbox, Divider, message, Modal, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { getPermissions } from '@/services/api/permissions';
import {
  deleteRolesIdPermissions,
  getRolesId,
  postRolesIdPermissions,
} from '@/services/api/roles';

interface AssignPermissionProps {
  roleId: number;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const categoryColor: Record<string, string> = {
  商品管理: 'blue',
  分类管理: 'cyan',
  库存管理: 'gold',
  订单管理: 'green',
  购物车管理: 'lime',
  支付管理: 'purple',
  退款管理: 'volcano',
  秒杀管理: 'red',
  评论管理: 'orange',
  通知管理: 'geekblue',
  用户管理: 'magenta',
  权限管理: 'purple',
  优惠券管理: 'pink',
  促销管理: 'yellow',
};

const AssignPermission: React.FC<AssignPermissionProps> = (props) => {
  const { roleId, open, onCancel, onSuccess } = props;
  const [allPermissions, setAllPermissions] = useState<API.Permission[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [permRes, roleRes] = await Promise.all([
        getPermissions({ page: 1, size: 100 }),
        getRolesId({ id: String(roleId) }),
      ]);
      const perms = (permRes as any).data?.permissions || [];
      const rolePerms = (roleRes as any).data?.permissions || [];
      const currentIds = rolePerms
        .map((p: API.Permission) => p.id)
        .filter(Boolean);

      setAllPermissions(perms);
      setAssignedIds(currentIds);
      setSelectedIds([...currentIds]);
    } catch {
      message.error('获取权限列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const toAdd = selectedIds.filter((id) => !assignedIds.includes(id));
      const toRemove = assignedIds.filter((id) => !selectedIds.includes(id));

      if (toAdd.length > 0) {
        await postRolesIdPermissions(
          { id: String(roleId) },
          { permission_ids: toAdd },
        );
      }
      if (toRemove.length > 0) {
        await deleteRolesIdPermissions(
          { id: String(roleId) },
          { permission_ids: toRemove },
        );
      }

      message.success('权限分配更新成功');
      onSuccess();
      onCancel();
    } catch {
      message.error('权限分配失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const groups = allPermissions.reduce<
    Record<string, { label: string; perms: API.Permission[] }>
  >((acc, perm) => {
    const cat = perm.category || 'other';
    if (!acc[cat]) {
      acc[cat] = { label: cat, perms: [] };
    }
    acc[cat].perms.push(perm);
    return acc;
  }, {});

  const allIds = allPermissions.map((p) => p.id).filter(Boolean) as number[];
  const allChecked = selectedIds.length === allIds.length && allIds.length > 0;
  const indeterminate =
    selectedIds.length > 0 && selectedIds.length < allIds.length;

  return (
    <Modal
      title="分配权限"
      width={700}
      open={open}
      onCancel={onCancel}
      onOk={handleSave}
      confirmLoading={saving}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Checkbox
          indeterminate={indeterminate}
          checked={allChecked}
          onChange={(e) => {
            setSelectedIds(e.target.checked ? allIds : []);
          }}
          style={{ marginBottom: 16 }}
        >
          全选
        </Checkbox>

        {Object.entries(groups).map(([cat, group]) => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <Divider orientation="left" style={{ margin: '8px 0' }}>
              <Tag color={categoryColor[cat] || 'default'}>{group.label}</Tag>
            </Divider>
            <Checkbox.Group
              value={selectedIds}
              onChange={(checkedValues) =>
                setSelectedIds(checkedValues as number[])
              }
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            >
              {group.perms.map((perm) => (
                <Checkbox
                  key={perm.id}
                  value={perm.id}
                  style={{ width: 180, margin: 0 }}
                >
                  <span title={perm.description}>
                    {perm.display_name || perm.name}
                  </span>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ))}

        {allPermissions.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: '#999', padding: 24 }}>
            暂无权限数据
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default AssignPermission;

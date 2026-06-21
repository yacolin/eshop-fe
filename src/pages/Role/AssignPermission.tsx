import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Checkbox,
  Col,
  message,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { history } from '@umijs/max';

import { getPermissions } from '@/services/api/permissions';
import {
  deleteRolesIdPermissions,
  getRolesId,
  postRolesIdPermissions,
} from '@/services/api/roles';

const COLOR_PALETTE = [
  'blue',
  'cyan',
  'gold',
  'green',
  'lime',
  'purple',
  'volcano',
  'red',
  'orange',
  'geekblue',
  'magenta',
  'pink',
];

const AssignPermissionPage: React.FC = () => {
  const params = new URLSearchParams(history.location.search);
  const roleId = Number(params.get('roleId')) || 0;
  const roleName = params.get('roleName') || '未知角色';

  const [allPermissions, setAllPermissions] = useState<API.Permission[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /** 按分类分组，并分配颜色 */
  const groups = useMemo(() => {
    const map: Record<
      string,
      { label: string; perms: API.Permission[]; color: string }
    > = {};
    const cats = [
      ...new Set(
        allPermissions.map((p) => p.category || '其他').filter(Boolean),
      ),
    ];
    cats.forEach((cat, i) => {
      map[cat] = {
        label: cat,
        perms: [],
        color: COLOR_PALETTE[i % COLOR_PALETTE.length],
      };
    });
    for (const perm of allPermissions) {
      const cat = perm.category || '其他';
      if (map[cat]) map[cat].perms.push(perm);
    }
    return Object.values(map);
  }, [allPermissions]);

  const allIds = allPermissions.map((p) => p.id).filter(Boolean) as number[];

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
      message.error('获取权限数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleId) {
      message.error('缺少角色ID');
      history.push('/user/role');
      return;
    }
    fetchData();
  }, [roleId]);

  /** 勾选/取消分类下所有权限 */
  const toggleGroup = (catPerms: API.Permission[], checked: boolean) => {
    const ids = catPerms.map((p) => p.id).filter(Boolean) as number[];
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

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
      history.push('/user/role');
    } catch {
      message.error('权限分配失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: `分配权限 — ${roleName}`,
        breadcrumb: {
          items: [
            { title: '首页' },
            { title: '角色管理', href: '/user/role' },
            { title: '分配权限' },
          ],
        },
        extra: (
          <Space>
            <Button onClick={() => history.push('/user/role')}>取消</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>
              保存
            </Button>
          </Space>
        ),
      }}
    >
      <Spin spinning={loading}>
        <ProCard style={{ overflowX: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Typography.Text strong>
              已选择 {selectedIds.length} / {allPermissions.length} 项权限
            </Typography.Text>
            <Checkbox
              indeterminate={
                selectedIds.length > 0 && selectedIds.length < allIds.length
              }
              checked={
                selectedIds.length === allIds.length && allIds.length > 0
              }
              onChange={(e) =>
                setSelectedIds(e.target.checked ? [...allIds] : [])
              }
            >
              全选
            </Checkbox>
          </div>

          <div
            style={{
              maxHeight: 'calc(100vh - 300px)',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <Row gutter={[12, 12]}>
              {groups.map((group) => {
                const groupIds = group.perms
                  .map((p) => p.id)
                  .filter(Boolean) as number[];
                const allChecked = groupIds.every((id) =>
                  selectedIds.includes(id),
                );
                const someChecked = groupIds.some((id) =>
                  selectedIds.includes(id),
                );

                return (
                  <Col key={group.label} xs={24} sm={12} md={8}>
                    <Card
                      size="small"
                      title={
                        <Space size={4}>
                          <Checkbox
                            indeterminate={someChecked && !allChecked}
                            checked={allChecked}
                            onChange={(e) =>
                              toggleGroup(group.perms, e.target.checked)
                            }
                          />
                          <Tag color={group.color} style={{ margin: 0 }}>
                            {group.label}
                          </Tag>
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                          >
                            {
                              groupIds.filter((id) => selectedIds.includes(id))
                                .length
                            }
                            /{groupIds.length}
                          </Typography.Text>
                        </Space>
                      }
                      style={{ height: '100%' }}
                      styles={{
                        body: {
                          padding: '6px 8px 10px',
                        },
                      }}
                    >
                      <Checkbox.Group
                        value={selectedIds}
                        onChange={(checkedValues) =>
                          setSelectedIds(checkedValues as number[])
                        }
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        {group.perms.map((perm) => (
                          <Checkbox
                            key={perm.id}
                            value={perm.id}
                            style={{
                              margin: 0,
                              padding: '3px 6px',
                              borderRadius: 4,
                              transition: 'background 0.15s',
                              width: '100%',
                              overflow: 'hidden',
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = '#f5f5f5';
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = 'transparent';
                            }}
                          >
                            <span title={perm.description}>
                              {perm.display_name || perm.name}
                            </span>
                            <Typography.Text
                              type="secondary"
                              style={{ fontSize: 10, marginLeft: 3 }}
                            >
                              {perm.name}
                            </Typography.Text>
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>

          {allPermissions.length === 0 && !loading && (
            <div style={{ textAlign: 'center', color: '#999', padding: 48 }}>
              暂无权限数据
            </div>
          )}
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default AssignPermissionPage;

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

import {
  deletePermissionsRolesRoleId,
  getPermissions,
  getPermissionsRolesRoleId,
  postPermissionsRolesRoleId,
} from '@/services/api/permissions';

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

const catColorMap: Record<string, string> = {};

const getCatColor = (cat: string) => {
  if (!catColorMap[cat]) {
    catColorMap[cat] =
      COLOR_PALETTE[Object.keys(catColorMap).length % COLOR_PALETTE.length];
  }
  return catColorMap[cat];
};

interface GroupTree {
  cat: string;
  resources: {
    resource: string;
    perms: API.Permission[];
  }[];
}

const AssignPermissionPage: React.FC = () => {
  const params = new URLSearchParams(history.location.search);
  const roleId = Number(params.get('roleId')) || 0;
  const roleName = params.get('roleName') || '未知角色';

  const [allPermissions, setAllPermissions] = useState<API.Permission[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /** category → resource → permissions */
  const groups = useMemo(() => {
    const grouped: Record<string, Record<string, API.Permission[]>> = {};
    for (const perm of allPermissions) {
      const cat = perm.category || '其他';
      const res = perm.resource || perm.name?.split(':')[0] || '其他';
      if (!grouped[cat]) grouped[cat] = {};
      if (!grouped[cat][res]) grouped[cat][res] = [];
      grouped[cat][res].push(perm);
    }
    return Object.entries(grouped).map<GroupTree>(([cat, resources]) => ({
      cat,
      resources: Object.entries(resources).map(([resource, perms]) => ({
        resource,
        perms,
      })),
    }));
  }, [allPermissions]);

  const allPermIds = useMemo(
    () => allPermissions.map((p) => p.id).filter(Boolean) as number[],
    [allPermissions],
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [permRes, rolePermRes] = await Promise.all([
        getPermissions({ page: 1, size: 100 }),
        getPermissionsRolesRoleId({ role_id: roleId }),
      ]);
      const perms = (permRes as any).data?.list || [];
      const rolePerms = (rolePermRes as any).data || [];
      const currentIds = rolePerms
        .map((p: API.Permission) => p.id)
        .filter(Boolean);

      setAllPermissions(perms);
      setAssignedIds(currentIds);
      setSelectedIds(currentIds);
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

  /** 切换资源下所有权限 */
  const toggleResource = (permIds: number[], checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...permIds])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !permIds.includes(id)));
    }
  };

  /** 切换分类下所有权限 */
  const toggleCategory = (catPermIds: number[], checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...catPermIds])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !catPermIds.includes(id)));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toAdd = selectedIds.filter((id) => !assignedIds.includes(id));
      const toRemove = assignedIds.filter((id) => !selectedIds.includes(id));

      if (toAdd.length > 0) {
        await postPermissionsRolesRoleId(
          { role_id: roleId },
          { permission_ids: toAdd },
        );
      }
      if (toRemove.length > 0) {
        await deletePermissionsRolesRoleId(
          { role_id: roleId },
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
              已选择 {selectedIds.length} / {allPermIds.length} 项权限
            </Typography.Text>
            <Button
              size="small"
              onClick={() =>
                setSelectedIds(
                  selectedIds.length === allPermIds.length
                    ? []
                    : [...allPermIds],
                )
              }
            >
              {selectedIds.length === allPermIds.length ? '取消全选' : '全选'}
            </Button>
          </div>

          <div
            style={{
              maxHeight: 'calc(100vh - 300px)',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            {groups.map(({ cat, resources }) => {
              const catPermIds = resources.flatMap((r) =>
                r.perms.map((p) => p.id).filter(Boolean),
              ) as number[];
              const catAllChecked = catPermIds.every((id) =>
                selectedIds.includes(id),
              );
              const catSomeChecked = catPermIds.some((id) =>
                selectedIds.includes(id),
              );

              return (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Checkbox
                      indeterminate={catSomeChecked && !catAllChecked}
                      checked={catAllChecked}
                      onChange={(e) =>
                        toggleCategory(catPermIds, e.target.checked)
                      }
                    />
                    <Tag
                      color={getCatColor(cat)}
                      style={{ margin: 0, fontSize: 14, padding: '2px 10px' }}
                    >
                      {cat}
                    </Tag>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {
                        catPermIds.filter((id) => selectedIds.includes(id))
                          .length
                      }
                      /{catPermIds.length}
                    </Typography.Text>
                  </div>

                  <Row gutter={[12, 12]}>
                    {resources.map(({ resource, perms }) => {
                      const permIds = perms
                        .map((p) => p.id)
                        .filter(Boolean) as number[];
                      const allChecked = permIds.every((id) =>
                        selectedIds.includes(id),
                      );
                      const someChecked = permIds.some((id) =>
                        selectedIds.includes(id),
                      );

                      return (
                        <Col key={resource} xs={24} sm={12} md={8} lg={6}>
                          <Card
                            size="small"
                            title={
                              <Space size={4}>
                                <Checkbox
                                  indeterminate={someChecked && !allChecked}
                                  checked={allChecked}
                                  onChange={(e) =>
                                    toggleResource(permIds, e.target.checked)
                                  }
                                />
                                <span style={{ fontWeight: 500 }}>
                                  {resource}
                                </span>
                              </Space>
                            }
                            styles={{
                              body: { padding: '6px 8px 10px' },
                            }}
                          >
                            <Checkbox.Group
                              value={selectedIds}
                              onChange={(values) =>
                                setSelectedIds(values as number[])
                              }
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                              }}
                            >
                              {perms.map((perm) => (
                                <Checkbox
                                  key={perm.id}
                                  value={perm.id}
                                  style={{
                                    margin: 0,
                                    padding: '3px 6px',
                                    borderRadius: 4,
                                    width: '100%',
                                  }}
                                >
                                  <span title={perm.description}>
                                    {perm.display_name || perm.name}
                                  </span>
                                </Checkbox>
                              ))}
                            </Checkbox.Group>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              );
            })}
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

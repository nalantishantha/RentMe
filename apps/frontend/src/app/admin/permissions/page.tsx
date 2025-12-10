"use client";

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Checkbox, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { permissionApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContex';

interface Permission {
  id: number;
  role: string;
  permissions: {
    browse_properties?: boolean;
    add_property?: boolean;
    edit_own_property?: boolean;
    delete_own_property?: boolean;
    view_all_users?: boolean;
    add_user?: boolean;
    edit_user?: boolean;
    delete_user?: boolean;
    manage_permissions?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { token } = useAuth();

  const permissionOptions = [
    { label: 'Browse Properties', value: 'browse_properties' },
    { label: 'Add Property', value: 'add_property' },
    { label: 'Edit Own Property', value: 'edit_own_property' },
    { label: 'Delete Own Property', value: 'delete_own_property' },
    { label: 'View All Users', value: 'view_all_users' },
    { label: 'Add User', value: 'add_user' },
    { label: 'Edit User', value: 'edit_user' },
    { label: 'Delete User', value: 'delete_user' },
    { label: 'Manage Permissions', value: 'manage_permissions' },
  ];

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await permissionApi.getPermissions(token || undefined);
      setPermissions(response.data);
    } catch (error: any) {
      message.error('Failed to fetch permissions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleCreate = async (values: any) => {
    
    try {
      const permissionsObj: any = {};
      values.permissions?.forEach((perm: string) => {
        permissionsObj[perm] = true;
      });

      await permissionApi.createPermission({
        role: values.role,
        permissions: permissionsObj,
      }, token || undefined);
      
      message.success('Permission created successfully');
      setCreateVisible(false);
      createForm.resetFields();
      fetchPermissions();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to create permission');
      }
    }
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    const enabledPermissions = Object.keys(permission.permissions).filter(
      (key) => permission.permissions[key as keyof typeof permission.permissions]
    );
    editForm.setFieldsValue({
      role: permission.role,
      permissions: enabledPermissions,
    });
    setEditVisible(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedPermission) return;
    
    try {
      const permissionsObj: any = {};
      permissionOptions.forEach((option) => {
        permissionsObj[option.value] = values.permissions?.includes(option.value) || false;
      });

      await permissionApi.updatePermission(selectedPermission.id, {
        permissions: permissionsObj,
      }, token || undefined);
      
      message.success('Permission updated successfully');
      setEditVisible(false);
      editForm.resetFields();
      setSelectedPermission(null);
      fetchPermissions();
    } catch (error: any) {
      message.error('Failed to update permission');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await permissionApi.deletePermission(id, token || undefined);
      message.success('Permission deleted successfully');
      fetchPermissions();
    } catch (error: any) {
      message.error('Failed to delete permission');
    }
  };

  const getPermissionsList = (perms: Permission['permissions']) => {
    return Object.keys(perms)
      .filter((key) => perms[key as keyof typeof perms])
      .map((key) => key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()))
      .join(', ') || 'None';
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span className="font-semibold uppercase text-gray-800">{role}</span>
      ),
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (_: any, record: Permission) => (
        <div className="text-sm text-gray-600">
          {getPermissionsList(record.permissions)}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Permission) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-gray-700 hover:text-gray-900"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this permission?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              className="text-gray-700 hover:text-gray-900"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Permission Management</h1>
            <p className="text-gray-600">Manage user role permissions</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCreateVisible(true)}
            className="bg-gray-800 border-gray-800 hover:bg-gray-700"
          >
            Create Permission
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="border border-gray-200 rounded-md"
        />
      </div>

      {/* Create Permission Modal */}
      <Modal
        title={<div className="text-2xl font-bold text-gray-800">Create New Permission</div>}
        open={createVisible}
        onCancel={() => {
          setCreateVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          className="mt-6"
        >
          <Form.Item
            label={<span className="text-base font-medium text-gray-700">Role Name</span>}
            name="role"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input 
              size="large" 
              placeholder="e.g., renter, seller, admin" 
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium text-gray-700">Permissions</span>}
            name="permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 gap-3">
                {permissionOptions.map((option) => (
                  <div key={option.value} className="bg-gray-50 p-3 rounded-md">
                    <Checkbox value={option.value} className="text-gray-700">
                      {option.label}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button
                size="large"
                onClick={() => {
                  setCreateVisible(false);
                  createForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="bg-gray-800 border-gray-800"
              >
                Create Permission
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Permission Modal */}
      <Modal
        title={<div className="text-2xl font-bold text-gray-800">Edit Permission</div>}
        open={editVisible}
        onCancel={() => {
          setEditVisible(false);
          editForm.resetFields();
          setSelectedPermission(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
          className="mt-6"
        >
          <Form.Item
            label={<span className="text-base font-medium text-gray-700">Role Name (Read-only)</span>}
            name="role"
          >
            <Input size="large" disabled className="bg-gray-100" />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium text-gray-700">Current Permissions</span>}
            name="permissions"
          >
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 gap-3">
                {permissionOptions.map((option) => (
                  <div key={option.value} className="bg-gray-50 p-3 rounded-md">
                    <Checkbox value={option.value} className="text-gray-700">
                      {option.label}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button
                size="large"
                onClick={() => {
                  setEditVisible(false);
                  editForm.resetFields();
                  setSelectedPermission(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="bg-gray-800 border-gray-800"
              >
                Update Permission
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
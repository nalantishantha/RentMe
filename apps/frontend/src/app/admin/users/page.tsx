"use client";

import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, message, Descriptions, Card, Typography, Popconfirm, Form, Select } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { userApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContex';

const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Property {
  id: number;
  title: string;
  type: string;
  city: string;
  price_per_month: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
}

interface UserDetails extends User {
  properties: Property[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [addUserVisible, setAddUserVisible] = useState(false);
  const [addUserForm] = Form.useForm();
  const { token } = useAuth();

  const fetchUsers = async (page: number = currentPage, limit: number = pageSize, search: string = searchText) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await userApi.getUsers(page, limit, search, token);
      setUsers(response.data.users);
      setTotal(response.data.total);
      setCurrentPage(response.data.page);
    } catch (error: any) {
      message.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchUsers(1, pageSize, value);
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchUsers(pagination.current, pagination.pageSize, searchText);
  };

  const showUserDetails = async (userId: number) => {
    if (!token) return;
    
    try {
      const response = await userApi.getUserDetails(userId, token);
      setSelectedUser(response.data);
      setDetailsVisible(true);
    } catch (error) {
      message.error('Failed to fetch user details');
    }
  };

  const handleEdit = (user: User) => {
    setEditForm({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
    });
    setEditVisible(true);
  };

  const handleUpdate = async () => {
    if (!token) return;
    
    try {
      await userApi.updateUser(editForm.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
      }, token);
      message.success('User updated successfully');
      setEditVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!token) return;
    
    try {
      await userApi.deleteUser(userId, token);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleSetInactive = async (userId: number) => {
    if (!token) return;
    
    try {
      await userApi.setInactive(userId, token);
      message.success('User set to inactive');
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const handleSetActive = async (userId: number) => {
    if (!token) return;
    
    try {
      await userApi.setActive(userId, token);
      message.success('User set to active');
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const handleAddUser = async (values: any) => {
    if (!token) return;
    
    try {
      await userApi.createUser(values, token);
      message.success('User created successfully');
      setAddUserVisible(false);
      addUserForm.resetFields();
      fetchUsers();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to create user');
      }
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-semibold uppercase">{role}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${isActive ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>{isActive ? 'Active' : 'Inactive'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showUserDetails(record.id)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          {record.isActive ? (
            <Popconfirm
              title="Set user to inactive?"
              onConfirm={() => handleSetInactive(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<StopOutlined />} />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Set user to active?"
              onConfirm={() => handleSetActive(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<CheckCircleOutlined />} />
            </Popconfirm>
          )}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
            <Space>
              <Search
                placeholder="Search by name or email"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                style={{ width: 400 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setAddUserVisible(true)}
                className="bg-gray-800 border-gray-800 text-white"
              >
                Add User
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            onChange={handleTableChange}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
            })}
          />
        </div>

        {/* User Details Modal */}
        <Modal
          title={
            <div className="text-2xl font-bold text-gray-800">
              User Details
            </div>
          }
          open={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          footer={null}
          width={800}
        >
          {selectedUser && (
            <div>
              <Descriptions bordered column={2} className="mb-6">
                <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
                <Descriptions.Item label="First Name">{selectedUser.firstName}</Descriptions.Item>
                <Descriptions.Item label="Last Name">{selectedUser.lastName}</Descriptions.Item>
                <Descriptions.Item label="Phone">{selectedUser.phone || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Role">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-semibold uppercase">{selectedUser.role}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${selectedUser.isActive ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{selectedUser.isActive ? 'Active' : 'Inactive'}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>

              <Title level={4} className="mt-6 mb-4">Properties ({selectedUser.properties.length})</Title>
              {selectedUser.properties.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {selectedUser.properties.map((property) => (
                    <Card
                      key={property.id}
                      className="shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Title level={5} className="mb-2">{property.title}</Title>
                          <Space direction="vertical" size="small">
                            <Text><strong>Type:</strong> {property.type}</Text>
                            <Text><strong>City:</strong> {property.city || 'N/A'}</Text>
                            <Text>
                              <strong>Price:</strong> {property.currency} {property.price_per_month?.toLocaleString()}/month
                            </Text>
                            <Text>
                              <strong>Bedrooms:</strong> {property.bedrooms || 'N/A'} | <strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}
                            </Text>
                          </Space>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${property.isActive ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>{property.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No properties found for this user
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Edit User Modal */}
        <Modal
          title={<div className="text-2xl font-bold text-gray-800">Edit User</div>}
          open={editVisible}
          onCancel={() => setEditVisible(false)}
          onOk={handleUpdate}
          okText="Update"
          cancelText="Cancel"
        >
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read-only)</label>
              <Input value={editForm.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <Input
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <Input
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
          </div>
        </Modal>

        {/* Add User Modal */}
        <Modal
          title={<div className="text-2xl font-bold text-gray-800">Add New User</div>}
          open={addUserVisible}
          onCancel={() => {
            setAddUserVisible(false);
            addUserForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={addUserForm}
            layout="vertical"
            onFinish={handleAddUser}
            className="mt-6"
          >
            <Form.Item
              label={<span className="text-base font-medium">First Name</span>}
              name="firstName"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input size="large" placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              label={<span className="text-base font-medium">Last Name</span>}
              name="lastName"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input size="large" placeholder="Enter last name" />
            </Form.Item>

            <Form.Item
              label={<span className="text-base font-medium">Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input size="large" placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              label={<span className="text-base font-medium">Phone</span>}
              name="phone"
            >
              <Input size="large" placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              label={<span className="text-base font-medium">Password</span>}
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password size="large" placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              label={<span className="text-base font-medium">Role & Permissions</span>}
              name="role"
              rules={[{ required: true, message: 'Please select a role' }]}
              initialValue="renter"
            >
              <Select size="large" placeholder="Select user role">
                <Option value="admin">
                  <div>
                    <div className="font-semibold">Admin</div>
                    <div className="text-xs text-gray-500">
                      Full access: Browse properties, User management, All CRUD operations
                    </div>
                  </div>
                </Option>
                <Option value="seller">
                  <div>
                    <div className="font-semibold">Seller/Owner</div>
                    <div className="text-xs text-gray-500">
                      Browse properties, Add/Edit/Delete own properties
                    </div>
                  </div>
                </Option>
                <Option value="renter">
                  <div>
                    <div className="font-semibold">Renter</div>
                    <div className="text-xs text-gray-500">
                      Browse properties only (Read-only access)
                    </div>
                  </div>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0">
              <Space className="w-full justify-end">
                <Button
                  size="large"
                  onClick={() => {
                    setAddUserVisible(false);
                    addUserForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="bg-gray-800 border-gray-800 text-white"
                >
                  Create User
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
}

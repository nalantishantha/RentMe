'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import { Card, Statistic, Row, Col } from 'antd';
import { Pie } from '@ant-design/plots';
import { userApi, propertyApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [userStats, setUserStats] = useState({
    total: 0,
    sellers: 0,
    admins: 0,
  });

  const [propertyStats, setPropertyStats] = useState({
    total: 0,
    house: 0,
    annex: 0,
    rooms: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      
      // Fetch users
      const usersResponse = await userApi.getUsers(1, 1000, '', token);
      const users = usersResponse.data || [];
      
      const sellers = users.filter((u: any) => u.role === 'seller').length;
      const admins = users.filter((u: any) => u.role === 'admin').length;
      
      setUserStats({
        total: users.length,
        sellers,
        admins,
      });

      // Fetch properties
      const propertiesResponse = await propertyApi.getAllProperties();
      const properties = propertiesResponse.data || [];
      
      const house = properties.filter((p: any) => p.type === 'house').length;
      const annex = properties.filter((p: any) => p.type === 'annex').length;
      const rooms = properties.filter((p: any) => p.type === 'rooms').length;
      
      setPropertyStats({
        total: properties.length,
        house,
        annex,
        rooms,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const userPieData = [
    { type: 'Sellers', value: userStats.sellers },
    { type: 'Admins', value: userStats.admins },
  ];

  const propertyPieData = [
    { type: 'House', value: propertyStats.house },
    { type: 'Annex', value: propertyStats.annex },
    { type: 'Rooms', value: propertyStats.rooms },
  ];

  const userPieConfig = {
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'bottom',
      },
    },
    scale: {
      color: {
        range: ['#334155', '#475569'],
      },
    },
  };

  const propertyPieConfig = {
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'bottom',
      },
    },
    scale: {
      color: {
        range: ['#334155', '#64748b', '#94a3b8'],
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>
        
        <Row gutter={[24, 24]}>
          {/* User Management Section */}
          <Col xs={24} lg={12}>
            <Card 
              title={<span className="text-xl font-semibold text-slate-800">User Management</span>}
              bordered={false}
              className="shadow-md"
            >
              <Row gutter={16} className="mb-6">
                <Col span={8}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Total Users</span>}
                      value={userStats.total}
                      valueStyle={{ color: '#334155', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Sellers</span>}
                      value={userStats.sellers}
                      valueStyle={{ color: '#475569', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Admins</span>}
                      value={userStats.admins}
                      valueStyle={{ color: '#64748b', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">User Distribution</h3>
                <Pie {...userPieConfig} data={userPieData} height={300} />
              </div>
            </Card>
          </Col>

          {/* Property Management Section */}
          <Col xs={24} lg={12}>
            <Card 
              title={<span className="text-xl font-semibold text-slate-800">Property Management</span>}
              bordered={false}
              className="shadow-md"
            >
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Total Properties</span>}
                      value={propertyStats.total}
                      valueStyle={{ color: '#334155', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Houses</span>}
                      value={propertyStats.house}
                      valueStyle={{ color: '#475569', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Annexes</span>}
                      value={propertyStats.annex}
                      valueStyle={{ color: '#64748b', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card bordered={false} className="bg-slate-100">
                    <Statistic
                      title={<span className="text-slate-600">Rooms</span>}
                      value={propertyStats.rooms}
                      valueStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Property Distribution</h3>
                <Pie {...propertyPieConfig} data={propertyPieData} height={300} />
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
}
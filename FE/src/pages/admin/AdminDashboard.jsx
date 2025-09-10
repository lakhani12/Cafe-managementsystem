import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import ProductManagement from '../../components/admin/ProductManagement';
import UserManagement from '../../components/admin/UserManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboardStats(),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminAPI.getOrders({ limit: 50 }),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminAPI.getProducts({ limit: 50 }),
  });

  const stats = dashboardData?.data?.stats || {};
  const orderList = ordersData?.data?.orders || [];
  const productList = productsData?.data?.products || [];
  const recentOrders = dashboardData?.data?.recentOrders || [];
  const topProducts = dashboardData?.data?.topProducts || [];

  const getStatusBadge = (status) => {
    const baseClass = 'order-status';
    switch (status) {
      case 'pending':
        return `${baseClass} status-pending`;
      case 'preparing':
        return `${baseClass} status-preparing`;
      case 'ready':
        return `${baseClass} status-ready`;
      case 'completed':
        return `${baseClass} status-completed`;
      case 'cancelled':
        return `${baseClass} status-cancelled`;
      default:
        return `${baseClass} status-pending`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="admin-dashboard py-5">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="display-5 fw-bold text-cafe-primary mb-1">Admin Dashboard</h1>
              <p className="text-muted mb-0">Welcome back, {user?.name}</p>
            </div>
            <div className="d-flex gap-2">
              <Button className="btn-cafe-primary">
                <Plus size={16} className="me-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6">
              <Card className="card-cafe">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="cafe-primary rounded-circle p-3 me-3">
                      <Package size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="fw-bold text-cafe-primary mb-1">{stats.totalOrders || 0}</h3>
                      <p className="text-muted mb-0">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-lg-3 col-md-6">
              <Card className="card-cafe">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="cafe-secondary rounded-circle p-3 me-3">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="fw-bold text-cafe-primary mb-1">{orderList.filter(order => order.status === 'pending').length}</h3>
                      <p className="text-muted mb-0">Pending Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-lg-3 col-md-6">
              <Card className="card-cafe">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle p-3 me-3">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="fw-bold text-cafe-primary mb-1">{orderList.filter(order => order.status === 'completed').length}</h3>
                      <p className="text-muted mb-0">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-lg-3 col-md-6">
              <Card className="card-cafe">
                <CardContent className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle p-3 me-3">
                      <DollarSign size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="fw-bold text-cafe-primary mb-1">${(stats.totalRevenue || 0).toFixed(2)}</h3>
                      <p className="text-muted mb-0">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <div className="d-flex gap-2">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id ? "btn-cafe-primary" : ""}
                >
                  <tab.icon size={16} className="me-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="row">
              <div className="col-lg-8">
                <Card className="card-cafe">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentOrders.map(order => (
                        <div key={order._id} className="d-flex justify-content-between align-items-center p-3 border rounded">
                          <div>
                            <h6 className="mb-1">Order #{order._id.slice(-8).toUpperCase()}</h6>
                            <p className="text-muted small mb-0">
                              {order.user?.name || 'Unknown User'} • {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-cafe-primary">${order.total.toFixed(2)}</div>
                            <span className={getStatusBadge(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-4">
                <Card className="card-cafe">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline" 
                        className="text-start"
                        onClick={() => setActiveTab('products')}
                      >
                        <Plus size={16} className="me-2" />
                        Add New Product
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-start"
                        onClick={() => setActiveTab('users')}
                      >
                        <Users size={16} className="me-2" />
                        Manage Users
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-start"
                        onClick={() => setActiveTab('reports')}
                      >
                        <BarChart3 size={16} className="me-2" />
                        View Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'reports' && (
            <Card className="card-cafe">
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-5">
                  <h5 className="text-muted">Reports Coming Soon</h5>
                  <p className="text-muted">Advanced analytics and reporting features will be available here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

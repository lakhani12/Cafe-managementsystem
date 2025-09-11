import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI, productsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: orders } = useQuery({
    queryKey: ['orders', 'admin'],
    queryFn: () => ordersAPI.getAll(),
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll(),
  });

  const orderList = orders?.data?.orders || [];
  const productList = products?.data?.products || [];

  // Calculate stats
  const totalOrders = orderList.length;
  const pendingOrders = orderList.filter(order => order.status === 'pending').length;
  const completedOrders = orderList.filter(order => order.status === 'completed').length;
  const totalRevenue = orderList.reduce((sum, order) => sum + order.total, 0);

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
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
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
                      <h3 className="fw-bold text-cafe-primary mb-1">{totalOrders}</h3>
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
                      <h3 className="fw-bold text-cafe-primary mb-1">{pendingOrders}</h3>
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
                      <h3 className="fw-bold text-cafe-primary mb-1">{completedOrders}</h3>
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
                      <h3 className="fw-bold text-cafe-primary mb-1">${totalRevenue.toFixed(2)}</h3>
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
                      {orderList.slice(0, 5).map(order => (
                        <div key={order._id} className="d-flex justify-content-between align-items-center p-3 border rounded">
                          <div>
                            <h6 className="mb-1">Order #{order._id.slice(-8).toUpperCase()}</h6>
                            <p className="text-muted small mb-0">
                              {order.user.name} • {formatDate(order.createdAt)}
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
                      <Button variant="outline" className="text-start">
                        <Plus size={16} className="me-2" />
                        Add New Product
                      </Button>
                      <Button variant="outline" className="text-start">
                        <Users size={16} className="me-2" />
                        Manage Users
                      </Button>
                      <Button variant="outline" className="text-start">
                        <BarChart3 size={16} className="me-2" />
                        View Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <Card className="card-cafe">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-8).toUpperCase()}</td>
                          <td>{order.user.name}</td>
                          <td>{order.items.length} items</td>
                          <td>${order.total.toFixed(2)}</td>
                          <td>
                            <span className={getStatusBadge(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button size="sm" variant="outline">
                                <Eye size={14} />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'products' && (
            <Card className="card-cafe">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <CardTitle>Products</CardTitle>
                <Button className="btn-cafe-primary">
                  <Plus size={16} className="me-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="row g-4">
                  {productList.map(product => (
                    <div key={product._id} className="col-lg-4 col-md-6">
                      <Card className="card-cafe">
                        <div className="position-relative">
                          <img
                            src={product.images?.[0] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop"}
                            alt={product.title}
                            className="card-img-top"
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <Badge variant="secondary">${product.price}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h6 className="fw-bold text-cafe-primary mb-2">{product.title}</h6>
                          <p className="text-muted small mb-3">{product.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                              Stock: {product.inStock}
                            </span>
                            <div className="d-flex gap-1">
                              <Button size="sm" variant="outline">
                                <Edit size={14} />
                              </Button>
                              <Button size="sm" variant="outline" className="text-danger">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', { search: searchTerm, status: statusFilter, page: currentPage }],
    queryFn: () => adminAPI.getOrders({ 
      search: searchTerm || undefined, 
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page: currentPage,
      limit: 10
    }),
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminAPI.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });

  const orders = ordersData?.data?.orders || [];
  const totalPages = ordersData?.data?.totalPages || 1;
  const total = ordersData?.data?.total || 0;

  const statusOptions = [
    { id: 'all', name: 'All Status', color: 'secondary' },
    { id: 'pending', name: 'Pending', color: 'warning' },
    { id: 'preparing', name: 'Preparing', color: 'info' },
    { id: 'ready', name: 'Ready', color: 'primary' },
    { id: 'completed', name: 'Completed', color: 'success' },
    { id: 'cancelled', name: 'Cancelled', color: 'danger' }
  ];

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(opt => opt.id === status);
    return (
      <Badge 
        variant="default" 
        className={`bg-${statusOption?.color || 'secondary'}`}
      >
        {statusOption?.name || status}
      </Badge>
    );
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-cafe-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold text-cafe-primary mb-1">Order Management</h2>
          <p className="text-muted mb-0">Track and manage customer orders</p>
        </div>
        <div className="text-muted">
          Total Orders: <span className="fw-bold text-cafe-primary">{total}</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-cafe mb-4">
        <CardContent className="p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Input
                  type="text"
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <Button 
                variant="outline" 
                className="w-100"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
              >
                <Filter size={16} className="me-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="card-cafe">
        <CardHeader>
          <CardTitle>Orders ({total})</CardTitle>
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
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <div className="fw-semibold">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{order.user?.name || 'Unknown User'}</div>
                        <small className="text-muted">{order.user?.email || 'No email'}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Package size={14} className="me-2 text-muted" />
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <DollarSign size={14} className="me-1 text-muted" />
                        <span className="fw-bold text-cafe-primary">
                          ${order.total?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(order.status)}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Calendar size={14} className="me-2 text-muted" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={14} />
                        </Button>
                        {getNextStatus(order.status) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="btn-success"
                            onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            <CheckCircle size={14} />
                          </Button>
                        )}
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-danger"
                            onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                            disabled={updateOrderStatusMutation.isPending}
                          >
                            <XCircle size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} orders
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="d-flex align-items-center px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-muted">No orders found</h5>
              <p className="text-muted">Try adjusting your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p><strong>Name:</strong> {selectedOrder.user?.name || 'Unknown'}</p>
                    <p><strong>Email:</strong> {selectedOrder.user?.email || 'No email'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Order Details</h6>
                    <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                    <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <h6>Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.product?.title || 'Unknown Product'}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price?.toFixed(2) || '0.00'}</td>
                            <td>${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
                {getNextStatus(selectedOrder.status) && (
                  <Button 
                    className="btn-cafe-primary"
                    onClick={() => {
                      handleStatusUpdate(selectedOrder._id, getNextStatus(selectedOrder.status));
                      setSelectedOrder(null);
                    }}
                    disabled={updateOrderStatusMutation.isPending}
                  >
                    Update Status
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

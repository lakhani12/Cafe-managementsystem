import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Clock, CheckCircle, XCircle, Package, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

const Orders = () => {
  const { user } = useAuth();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersAPI.getMyOrders(),
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-warning" />;
      case 'preparing':
        return <Package size={16} className="text-info" />;
      case 'ready':
        return <CheckCircle size={16} className="text-success" />;
      case 'completed':
        return <CheckCircle size={16} className="text-success" />;
      case 'cancelled':
        return <XCircle size={16} className="text-danger" />;
      default:
        return <Clock size={16} className="text-muted" />;
    }
  };

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-cafe-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Failed to load orders. Please try again later.
        </div>
      </div>
    );
  }

  const orderList = orders?.data?.orders || [];

  return (
    <ProtectedRoute>
      <div className="orders-page py-5">
        <div className="container">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="me-3"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="display-5 fw-bold text-cafe-primary mb-0">My Orders</h1>
          </div>

          {orderList.length === 0 ? (
            <div className="text-center py-5">
              <Package size={64} className="text-muted mb-3" />
              <h3 className="text-muted mb-3">No orders yet</h3>
              <p className="text-muted mb-4">Start ordering from our delicious menu</p>
              <Button asChild className="btn-cafe-primary">
                <a href="/menu">Browse Menu</a>
              </Button>
            </div>
          ) : (
            <div className="row">
              {orderList.map((order) => (
                <div key={order._id} className="col-12 mb-4">
                  <Card className="card-cafe">
                    <CardContent className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold text-cafe-primary mb-1">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h5>
                          <p className="text-muted small mb-0">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={getStatusBadge(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8">
                          <h6 className="fw-bold mb-3">Items:</h6>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <div>
                                  <span className="fw-medium">{item.product.title}</span>
                                  <span className="text-muted ms-2">x{item.quantity}</span>
                                </div>
                                <span className="text-cafe-secondary fw-bold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="bg-light p-3 rounded">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Subtotal:</span>
                              <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Tax:</span>
                              <span>${((order.total - order.subtotal)).toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                              <span className="fw-bold">Total:</span>
                              <span className="fw-bold text-cafe-primary">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-3">
                          <h6 className="fw-bold mb-2">Notes:</h6>
                          <p className="text-muted mb-0">{order.notes}</p>
                        </div>
                      )}

                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                          {order.status === 'pending' && 'Your order is being processed'}
                          {order.status === 'preparing' && 'Your order is being prepared'}
                          {order.status === 'ready' && 'Your order is ready for pickup'}
                          {order.status === 'completed' && 'Order completed successfully'}
                          {order.status === 'cancelled' && 'Order was cancelled'}
                        </div>
                        {order.status === 'ready' && (
                          <Button size="sm" className="btn-cafe-primary">
                            Mark as Picked Up
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Orders;

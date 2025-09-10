import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '../components/ProtectedRoute';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get(),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => cartAPI.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
    onError: () => {
      toast.error('Failed to update item');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId) => cartAPI.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Item removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartAPI.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart cleared');
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: () => ordersAPI.create(),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['orders']);
      toast.success('Order placed successfully!');
      navigate('/orders');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    },
  });

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItemMutation.mutate(itemId);
    } else {
      updateItemMutation.mutate({ itemId, quantity: newQuantity });
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCartMutation.mutate();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    createOrderMutation.mutate();
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

  const cartItems = cart?.data?.cart?.items || cart?.data?.items || [];
  const subtotal = cart?.data?.cart?.subtotal || cart?.data?.subtotal || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <ProtectedRoute>
      <div className="cart-page py-5">
        <div className="container">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="me-3"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="display-5 fw-bold text-cafe-primary mb-0">Shopping Cart</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <ShoppingBag size={64} className="text-muted mb-3" />
              <h3 className="text-muted mb-3">Your cart is empty</h3>
              <p className="text-muted mb-4">Add some delicious items from our menu</p>
              <Button asChild className="btn-cafe-primary">
                <a href="/menu">Browse Menu</a>
              </Button>
            </div>
          ) : (
            <div className="row">
              {/* Cart Items */}
              <div className="col-lg-8">
                <Card className="card-cafe">
                  <CardContent className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCart}
                        disabled={clearCartMutation.isPending}
                      >
                        <Trash2 size={16} className="me-2" />
                        Clear Cart
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item._id} className="cart-item d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <img
                              src={item.product.images?.[0] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop"}
                              alt={item.product.title}
                              className="rounded"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold text-cafe-primary mb-1">
                              {item.product.title}
                            </h6>
                            <p className="text-muted small mb-2">
                              {item.product.description}
                            </p>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="fw-bold text-cafe-secondary">
                                ${item.price.toFixed(2)}
                              </span>
                              <div className="d-flex align-items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  disabled={updateItemMutation.isPending}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="fw-bold min-w-0" style={{ minWidth: '2rem', textAlign: 'center' }}>
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  disabled={updateItemMutation.isPending}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ms-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateQuantity(item._id, 0)}
                              disabled={removeItemMutation.isPending}
                            >
                              <Trash2 size={16} className="text-danger" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <Card className="card-cafe sticky-top" style={{ top: '100px' }}>
                  <CardContent className="p-4">
                    <h5 className="fw-bold text-cafe-primary mb-4">Order Summary</h5>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold">Total:</span>
                      <span className="fw-bold text-cafe-primary">${total.toFixed(2)}</span>
                    </div>

                    <Button
                      className="btn-cafe-primary w-100 mb-3"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Processing...
                        </>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-100"
                    >
                      <a href="/menu">Continue Shopping</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Cart;

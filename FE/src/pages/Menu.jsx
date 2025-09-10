import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Menu = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState({});

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: () => productsAPI.getAll({ q: searchTerm }),
  });

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.get(),
    enabled: !!user,
  });

  useEffect(() => {
    if (cart?.data?.items) {
      const itemsMap = {};
      cart.data.items.forEach(item => {
        itemsMap[item.product._id] = item.quantity;
      });
      setCartItems(itemsMap);
    }
  }, [cart]);

  const categories = ['all', 'coffee', 'tea', 'pastries', 'sandwiches', 'salads'];

  const filteredProducts = products?.data?.products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.active;
  }) || [];

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartAPI.addItem(productId, 1);
      setCartItems(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!user) return;

    try {
      if (newQuantity === 0) {
        // Find cart item ID and remove
        const cartItem = cart?.data?.items?.find(item => item.product._id === productId);
        if (cartItem) {
          await cartAPI.removeItem(cartItem._id);
        }
      } else {
        // Find cart item ID and update
        const cartItem = cart?.data?.items?.find(item => item.product._id === productId);
        if (cartItem) {
          await cartAPI.updateItem(cartItem._id, newQuantity);
        }
      }
      setCartItems(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    } catch (error) {
      toast.error('Failed to update cart');
    }
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
          Failed to load menu items. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-cafe-primary mb-3">Our Menu</h1>
          <p className="lead text-muted">Discover our delicious selection of coffee, food, and treats</p>
        </div>

        {/* Search and Filters */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-3">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-5"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-cafe-primary" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No items found</h3>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map(product => (
              <div key={product._id} className="col-lg-4 col-md-6">
                <Card className="card-cafe h-100 border-0 overflow-hidden">
                  <div className="position-relative">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop"}
                      alt={product.title}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <Badge variant="secondary" className="bg-white text-cafe-primary">
                        ${product.price}
                      </Badge>
                    </div>
                    {product.category && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <Badge variant="outline" className="bg-white text-cafe-secondary border-cafe-secondary">
                          {product.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h5 className="fw-bold text-cafe-primary mb-2">{product.title}</h5>
                    <p className="text-muted mb-3">{product.description}</p>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <Star size={16} className="text-warning me-1" />
                        <span className="text-muted small">4.5 (24 reviews)</span>
                      </div>
                      <span className="text-muted small">
                        {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <div className="mt-3">
                      {cartItems[product._id] ? (
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(product._id, cartItems[product._id] - 1)}
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="fw-bold">{cartItems[product._id]}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(product._id, cartItems[product._id] + 1)}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(product._id, 0)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="btn-cafe-primary w-100"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.inStock === 0}
                        >
                          <ShoppingCart size={16} className="me-2" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {user && Object.keys(cartItems).length > 0 && (
          <div className="mt-5">
            <Card className="card-cafe">
              <CardContent className="p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">Items in Cart: {Object.values(cartItems).reduce((a, b) => a + b, 0)}</h5>
                    <p className="text-muted mb-0">Total: ${cart?.data?.subtotal?.toFixed(2) || '0.00'}</p>
                  </div>
                  <Button asChild className="btn-cafe-primary">
                    <a href="/cart">View Cart</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Coffee, Clock, Star, Users, ArrowRight, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Home = () => {
  // Fetch products for popular items section
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll({ limit: 6 }),
  });

  const features = [
    {
      icon: <Coffee size={48} className="text-cafe-primary" />,
      title: 'Premium Coffee',
      description: 'Handcrafted coffee made from the finest beans sourced from around the world.',
    },
    {
      icon: <Clock size={48} className="text-cafe-primary" />,
      title: 'Quick Service',
      description: 'Fast and efficient service to get your order ready in no time.',
    },
    {
      icon: <Star size={48} className="text-cafe-primary" />,
      title: 'Quality Food',
      description: 'Fresh ingredients and delicious meals prepared by our expert chefs.',
    },
    {
      icon: <Users size={48} className="text-cafe-primary" />,
      title: 'Friendly Staff',
      description: 'Our welcoming team is here to make your experience memorable.',
    },
  ];

  const handleAddToCart = (product) => {
    // This would typically add to cart via API
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Welcome to Cafe Delight</h1>
              <p className="lead mb-4">
                Experience the perfect blend of taste and ambiance. We serve the finest coffee and
                delicious meals in a cozy atmosphere that feels like home.
              </p>
              <div className="d-flex gap-3">
                <Button asChild size="lg" className="btn-cafe-primary">
                  <Link to="/menu">
                    View Menu <ArrowRight className="ms-2" size={20} />
                  </Link>
                </Button>
                <Button asChild variant="outline-light" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&h=400&fit=crop"
                alt="Cafe Interior"
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-cafe-primary mb-3">Why Choose Us?</h2>
            <p className="lead text-muted">We're committed to providing the best cafe experience</p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <Card className="card-cafe h-100 text-center border-0">
                  <CardContent className="p-4">
                    <div className="mb-3">{feature.icon}</div>
                    <h5 className="fw-bold text-cafe-primary mb-3">{feature.title}</h5>
                    <p className="text-muted">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-cafe-primary mb-3">Popular Items</h2>
            <p className="lead text-muted">Customer favorites you'll love</p>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-cafe-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {products?.data?.products?.slice(0, 6).map((product) => (
                <div key={product._id} className="col-lg-4 col-md-6">
                  <Card className="card-cafe h-100 border-0 overflow-hidden">
                    <div className="position-relative">
                      <img
                        src={
                          product.images?.[0] ||
                          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop'
                        }
                        alt={product.title}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-cafe-primary">${product.price.toFixed(2)}</span>
                      </div>
                      {product.inStock === 0 && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge bg-danger">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h5 className="fw-bold text-cafe-primary mb-2">{product.title}</h5>
                      <p className="text-muted mb-3">{product.description}</p>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="text-muted small">Category: {product.category}</span>
                        <span className="text-muted small">Stock: {product.inStock}</span>
                      </div>
                      <Button
                        className="btn-cafe-primary w-100"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.inStock === 0}
                      >
                        <ShoppingCart size={16} className="me-2" />
                        {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Button asChild size="lg" className="btn-cafe-secondary">
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cafe-primary">
        <div className="container text-center text-white">
          <h2 className="display-5 fw-bold mb-3">Ready to Order?</h2>
          <p className="lead mb-4">
            Join thousands of satisfied customers who choose Cafe Delight for their daily coffee
            fix.
          </p>
          <Button asChild size="lg" variant="light">
            <Link to="/menu">Order Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;

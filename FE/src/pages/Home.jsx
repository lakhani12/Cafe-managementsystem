import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Coffee, Clock, Star, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Coffee size={48} className="text-cafe-primary" />,
      title: "Premium Coffee",
      description: "Handcrafted coffee made from the finest beans sourced from around the world."
    },
    {
      icon: <Clock size={48} className="text-cafe-primary" />,
      title: "Quick Service",
      description: "Fast and efficient service to get your order ready in no time."
    },
    {
      icon: <Star size={48} className="text-cafe-primary" />,
      title: "Quality Food",
      description: "Fresh ingredients and delicious meals prepared by our expert chefs."
    },
    {
      icon: <Users size={48} className="text-cafe-primary" />,
      title: "Friendly Staff",
      description: "Our welcoming team is here to make your experience memorable."
    }
  ];

  const popularItems = [
    {
      name: "Cappuccino",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop",
      description: "Rich espresso with steamed milk and foam"
    },
    {
      name: "Chocolate Croissant",
      price: 3.49,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=200&fit=crop",
      description: "Buttery pastry filled with rich chocolate"
    },
    {
      name: "Avocado Toast",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop",
      description: "Fresh avocado on artisan bread with herbs"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Cafe Delight
              </h1>
              <p className="lead mb-4">
                Experience the perfect blend of taste and ambiance. We serve the finest coffee 
                and delicious meals in a cozy atmosphere that feels like home.
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
          <div className="row g-4">
            {popularItems.map((item, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <Card className="card-cafe h-100 border-0 overflow-hidden">
                  <div className="position-relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-cafe-primary">${item.price}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h5 className="fw-bold text-cafe-primary mb-2">{item.name}</h5>
                    <p className="text-muted mb-3">{item.description}</p>
                    <Button className="btn-cafe-primary w-100">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
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
            Join thousands of satisfied customers who choose Cafe Delight for their daily coffee fix.
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

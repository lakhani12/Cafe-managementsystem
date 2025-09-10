import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="register-page min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card className="card-cafe border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="d-flex justify-content-center mb-3">
                  <div className="cafe-primary rounded-circle p-3">
                    <Coffee size={32} className="text-white" />
                  </div>
                </div>
                <CardTitle className="h3 fw-bold text-cafe-primary">Create Account</CardTitle>
                <p className="text-muted mb-0">Join us and start ordering delicious food</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Label htmlFor="name" className="form-label fw-medium">
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="email" className="form-label fw-medium">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="password" className="form-label fw-medium">
                      Password
                    </Label>
                    <div className="position-relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="form-control pe-5"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ border: 'none', background: 'none' }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} className="text-muted" />
                        ) : (
                          <Eye size={20} className="text-muted" />
                        )}
                      </button>
                    </div>
                    <small className="text-muted">Password must be at least 6 characters long</small>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="confirmPassword" className="form-label fw-medium">
                      Confirm Password
                    </Label>
                    <div className="position-relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        className="form-control pe-5"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ border: 'none', background: 'none' }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} className="text-muted" />
                        ) : (
                          <Eye size={20} className="text-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                      required
                    />
                    <label className="form-check-label text-muted" htmlFor="terms">
                      I agree to the{' '}
                      <Link to="/terms" className="text-cafe-primary text-decoration-none">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-cafe-primary text-decoration-none">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="btn-cafe-primary w-100 mb-3"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-cafe-primary fw-medium text-decoration-none">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

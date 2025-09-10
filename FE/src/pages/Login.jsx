import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center">
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
                <CardTitle className="h3 fw-bold text-cafe-primary">Welcome Back</CardTitle>
                <p className="text-muted mb-0">Sign in to your account to continue</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
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

                  <div className="mb-4">
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
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />
                      <label className="form-check-label text-muted" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-cafe-primary text-decoration-none">
                      Forgot password?
                    </Link>
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
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-cafe-primary fw-medium text-decoration-none">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Admin Login Link */}
            <div className="text-center mt-4">
              <Link to="/admin/login" className="text-muted text-decoration-none">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

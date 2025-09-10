import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { User, Mail, Calendar, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProtectedRoute from '../components/ProtectedRoute';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Here you would typically call an API to update user profile
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="profile-page py-5">
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
            <h1 className="display-5 fw-bold text-cafe-primary mb-0">My Profile</h1>
          </div>

          <div className="row">
            {/* Profile Info */}
            <div className="col-lg-8">
              <Card className="card-cafe">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <CardTitle className="h4 mb-0">Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={16} className="me-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="btn-cafe-primary"
                      >
                        <Save size={16} className="me-2" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X size={16} className="me-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="name" className="form-label fw-medium">
                        Full Name
                      </Label>
                      {isEditing ? (
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <div className="form-control-plaintext">
                          <User size={20} className="me-2 text-cafe-primary" />
                          {user?.name}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label htmlFor="email" className="form-label fw-medium">
                        Email Address
                      </Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                        />
                      ) : (
                        <div className="form-control-plaintext">
                          <Mail size={20} className="me-2 text-cafe-primary" />
                          {user?.email}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Label className="form-label fw-medium">Account Type</Label>
                      <div className="form-control-plaintext">
                        <Badge 
                          variant={user?.role === 'admin' ? 'default' : 'secondary'}
                          className={user?.role === 'admin' ? 'bg-cafe-primary' : ''}
                        >
                          {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Label className="form-label fw-medium">Member Since</Label>
                      <div className="form-control-plaintext">
                        <Calendar size={20} className="me-2 text-cafe-primary" />
                        {formatDate(new Date())}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Actions */}
            <div className="col-lg-4">
              <Card className="card-cafe">
                <CardHeader>
                  <CardTitle className="h5 mb-0">Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="d-grid gap-3">
                    <Button asChild variant="outline">
                      <a href="/orders">View Order History</a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="/cart">View Cart</a>
                    </Button>
                    <Button variant="outline">
                      Change Password
                    </Button>
                    <hr />
                    <Button 
                      variant="outline" 
                      className="text-danger border-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to logout?')) {
                          logout();
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="card-cafe mt-4">
                <CardHeader>
                  <CardTitle className="h5 mb-0">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="h4 fw-bold text-cafe-primary mb-1">0</div>
                      <div className="text-muted small">Total Orders</div>
                    </div>
                    <div className="col-6">
                      <div className="h4 fw-bold text-cafe-primary mb-1">$0.00</div>
                      <div className="text-muted small">Total Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

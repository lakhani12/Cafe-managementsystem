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
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', { search: searchTerm, role: roleFilter, page: currentPage }],
    queryFn: () => adminAPI.getUsers({ 
      search: searchTerm || undefined, 
      role: roleFilter !== 'all' ? roleFilter : undefined,
      page: currentPage,
      limit: 10
    }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }) => adminAPI.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.totalPages || 1;
  const total = usersData?.data?.total || 0;

  const roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'user', name: 'Users' },
    { id: 'admin', name: 'Admins' }
  ];

  const handleToggleUserStatus = (user) => {
    updateUserMutation.mutate({
      id: user._id,
      userData: { 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        active: !user.active 
      }
    });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <div className="user-management">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold text-cafe-primary mb-1">User Management</h2>
          <p className="text-muted mb-0">Manage user accounts and permissions</p>
        </div>
        <div className="text-muted">
          Total Users: <span className="fw-bold text-cafe-primary">{total}</span>
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
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
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
                  setRoleFilter('all');
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

      {/* Users Table */}
      <Card className="card-cafe">
        <CardHeader>
          <CardTitle>Users ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="cafe-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                          <span className="text-white fw-bold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="fw-semibold">{user.name}</div>
                          <small className="text-muted">ID: {user._id.slice(-8)}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Mail size={14} className="me-2 text-muted" />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={user.role === 'admin' ? 'bg-warning' : 'bg-secondary'}
                      >
                        {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1) || 'User'}
                      </Badge>
                    </td>
                    <td>
                      <Badge 
                        variant={user.active !== false ? 'default' : 'secondary'}
                        className={user.active !== false ? 'bg-success' : 'bg-secondary'}
                      >
                        {user.active !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Calendar size={14} className="me-2 text-muted" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user)}
                          disabled={updateUserMutation.isPending}
                        >
                          {user.active !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => console.log('Edit user:', user._id)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-danger"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          <Trash2 size={14} />
                        </Button>
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
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} users
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

          {users.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-muted">No users found</h5>
              <p className="text-muted">Try adjusting your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

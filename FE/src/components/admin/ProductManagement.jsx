import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import ProductForm from './ProductForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', { search: searchTerm, category: categoryFilter }],
    queryFn: () => adminAPI.getProducts({ 
      search: searchTerm || undefined, 
      category: categoryFilter !== 'all' ? categoryFilter : undefined 
    }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });

  const products = productsData?.data?.products || [];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'beverage', name: 'Beverages' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'food', name: 'Food' },
    { id: 'salad', name: 'Salads' }
  ];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const updateProductMutation = useMutation({
    mutationFn: ({ id, productData }) => adminAPI.updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });

  const toggleProductStatus = (product) => {
    updateProductMutation.mutate({
      id: product._id,
      productData: { 
        active: !product.active 
      }
    });
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingProduct(null);
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
    <div className="product-management">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold text-cafe-primary mb-1">Product Management</h2>
          <p className="text-muted mb-0">Manage your cafe's product catalog</p>
        </div>
        <Button 
          className="btn-cafe-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} className="me-2" />
          Add Product
        </Button>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
                  setCategoryFilter('all');
                }}
              >
                <Filter size={16} className="me-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="row g-4">
        {products.map(product => (
          <div key={product._id} className="col-lg-4 col-md-6">
            <Card className="card-cafe h-100">
              <div className="position-relative">
                <img
                  src={product.images?.[0] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop"}
                  alt={product.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <Badge 
                    variant={product.active !== false ? "default" : "secondary"}
                    className={product.active !== false ? "bg-success" : "bg-secondary"}
                  >
                    {product.active !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="position-absolute top-0 start-0 m-2">
                  <Badge variant="outline" className="bg-white">
                    ${product.price}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h6 className="fw-bold text-cafe-primary mb-2">{product.title}</h6>
                <p className="text-muted small mb-3 line-clamp-2">{product.description}</p>
                
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <small className="text-muted">Category:</small>
                    <div className="fw-semibold text-capitalize">{product.category}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Stock:</small>
                    <div className="fw-semibold">{product.inStock} units</div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                    className="flex-fill"
                  >
                    <Edit size={14} className="me-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleProductStatus(product)}
                    className="flex-fill"
                  >
                    {product.active !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span className="ms-1">
                      {product.active !== false ? 'Hide' : 'Show'}
                    </span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-danger"
                    onClick={() => handleDelete(product._id)}
                    disabled={deleteProductMutation.isPending}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="card-cafe">
          <CardContent className="text-center py-5">
            <h5 className="text-muted">No products found</h5>
            <p className="text-muted">Try adjusting your search or add a new product.</p>
            <Button 
              className="btn-cafe-primary"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} className="me-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ProductManagement;

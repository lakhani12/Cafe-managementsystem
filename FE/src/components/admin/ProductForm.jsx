import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, uploadAPI } from '../../services/api';
import '../../styles/upload.css';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { X, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'beverage',
    inStock: '',
    active: true,
    images: [],
  });
  const [imageUrls, setImageUrls] = useState(['']);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || 'beverage',
        inStock: product.inStock?.toString() || '',
        active: product.active !== false,
        images: product.images || [],
      });
      setImageUrls([product.images?.[0] || '']);
    }
  }, [product]);

  const createProductMutation = useMutation({
    mutationFn: (productData) => adminAPI.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created successfully');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, productData }) => adminAPI.updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated successfully');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSingleImageUrlChange = (value) => {
    setImageUrls([value]);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxMb = Number(import.meta.env.VITE_UPLOAD_MAX_MB || 15);
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`File too large. Max ${maxMb}MB`);
      e.target.value = '';
      return;
    }
    try {
      setIsUploading(true);
      setSelectedFileName(file.name);
      const res = await uploadAPI.uploadImage(file);
      const url = res.data?.url;
      if (url) {
        setImageUrls([url]);
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Product title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.inStock || parseInt(formData.inStock) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      inStock: parseInt(formData.inStock),
      images: imageUrls.filter((url) => url.trim() !== ''),
    };

    if (product) {
      updateProductMutation.mutate({ id: product._id, productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const categories = [
    { value: 'beverage', label: 'Beverages' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'food', label: 'Food' },
    { value: 'salad', label: 'Salads' },
  ];

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Product Title */}
                <div className="col-md-8">
                  <label className="form-label">Product Title *</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter product title"
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-4">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="3"
                    required
                  />
                </div>

                {/* Price and Stock */}
                <div className="col-md-6">
                  <label className="form-label">Price ($) *</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stock Quantity *</label>
                  <Input
                    type="number"
                    name="inStock"
                    value={formData.inStock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Image */}
                <div className="col-12">
                  <label className="form-label">Product Image</label>
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <label className="file-upload">
                      <input
                        className="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                      />
                      <span
                        className="file-button btn btn-outline-secondary btn-sm"
                        aria-disabled={isUploading}
                      >
                        <Upload size={16} className="me-2" /> Choose file
                      </span>
                      {selectedFileName && (
                        <span className="file-name ms-2">{selectedFileName}</span>
                      )}
                    </label>
                    {isUploading && (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <div className="input-group mb-2">
                    <Input
                      type="text"
                      value={imageUrls[0]}
                      onChange={(e) => handleSingleImageUrlChange(e.target.value)}
                      placeholder="Enter image URL (optional)"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      id="activeCheck"
                    />
                    <label className="form-check-label" htmlFor="activeCheck">
                      Product is active and visible to customers
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="btn-cafe-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    {product ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    {product ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

import React, { useState, useEffect } from 'react';


const API_BASE = 'http://localhost:5001/api';

const apiService = {
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async addProduct(product) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to add product');
    return response.json();
  },

  async updateProduct(id, product) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  }
};

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    price: 0,
    originalPrice: 0,
    sizes: ['S', 'M', 'L', 'XL'],
    material: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts();
      setProducts(data);
      setMessage('Products loaded successfully');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const generateId = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleInputChange = (field, value) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    } else {
      const updatedProduct = { ...newProduct, [field]: value };
      if (field === 'title' && !newProduct.id) {
        updatedProduct.id = generateId(value);
      }
      setNewProduct(updatedProduct);
    }
  };

  const handleSizeToggle = (size) => {
    const currentProduct = editingProduct || newProduct;
    const updatedSizes = currentProduct.sizes.includes(size)
      ? currentProduct.sizes.filter(s => s !== size)
      : [...currentProduct.sizes, size];
    
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, sizes: updatedSizes });
    } else {
      setNewProduct({ ...newProduct, sizes: updatedSizes });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const result = await apiService.uploadImage(file);
        handleInputChange('image', result.imagePath);
        showMessage('Image uploaded successfully');
      } catch (error) {
        showMessage(`Error uploading image: ${error.message}`, true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.id || !newProduct.image) {
      showMessage('Please fill in required fields: Title, ID, and Image', true);
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.addProduct(newProduct);
      await loadProducts(); // Refresh products list
      resetForm();
      showMessage('Product added successfully! ✅');
    } catch (error) {
      showMessage(`Error adding product: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      await apiService.updateProduct(editingProduct.id, editingProduct);
      await loadProducts(); // Refresh products list
      setEditingProduct(null);
      showMessage('Product updated successfully! ✅');
    } catch (error) {
      showMessage(`Error updating product: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await apiService.deleteProduct(id);
        await loadProducts(); // Refresh products list
        showMessage('Product deleted successfully! ✅');
      } catch (error) {
        showMessage(`Error deleting product: ${error.message}`, true);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setNewProduct({
      id: '',
      title: '',
      description: '',
      image: '',
      price: 0,
      originalPrice: 0,
      sizes: ['S', 'M', 'L', 'XL'],
      material: ''
    });
  };

  const currentProduct = editingProduct || newProduct;
  const isEditing = !!editingProduct;

  return (
    <>
      {/* Admin Toggle Button */}
      <button 
        className="admin-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '50px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        {isOpen ? '✕' : '⚙️'} Admin
      </button>

      {/* Admin Panel */}
      {isOpen && (
        <div className="admin-overlay">
          <div className="admin-panel">
            <div className="admin-header">
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => {setIsOpen(false); setEditingProduct(null);}} className="close-btn">✕</button>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                Processing...
              </div>
            )}

            <div className="admin-content">
              {/* Product Form */}
              <div className="product-form">
                <div className="form-group">
                  <label>Product ID*</label>
                  <input
                    type="text"
                    value={currentProduct.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    placeholder="auto-generated from title"
                    disabled={isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Title*</label>
                  <input
                    type="text"
                    value={currentProduct.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Product title"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={currentProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Product description (optional)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Image Upload*</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                  />
                  <small>Current: {currentProduct.image || 'No image selected'}</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₦)</label>
                    <input
                      type="number"
                      value={currentProduct.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                      placeholder="25000 (optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Original Price (₦)</label>
                    <input
                      type="number"
                      value={currentProduct.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', parseInt(e.target.value))}
                      placeholder="30000 (optional)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    value={currentProduct.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="Premium Cotton Blend (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Available Sizes (optional)</label>
                  <div className="size-selector">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`size-btn ${currentProduct.sizes.includes(size) ? 'selected' : ''}`}
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  {isEditing ? (
                    <>
                      <button onClick={handleUpdateProduct} className="update-btn" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Product'}
                      </button>
                      <button onClick={() => setEditingProduct(null)} className="cancel-btn">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleAddProduct} className="add-btn" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Product'}
                      </button>
                      <button onClick={resetForm} className="reset-btn">
                        Reset Form
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Products List */}
              <div className="products-list">
                <div className="products-header">
                  <h3>Current Products ({products.length})</h3>
                  <button onClick={loadProducts} className="refresh-btn" disabled={loading}>
                    🔄 Refresh
                  </button>
                </div>
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-item">
                      <div className="product-preview">
                        {product.image && (
                          <img src={product.image} alt={product.title} />
                        )}
                        <div className="product-info">
                          <h4>{product.title}</h4>
                          <p>₦{product.price.toLocaleString()}</p>
                          <p className="sizes">Sizes: {product.sizes.join(', ')}</p>
                        </div>
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="edit-btn"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="delete-btn"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPanel;

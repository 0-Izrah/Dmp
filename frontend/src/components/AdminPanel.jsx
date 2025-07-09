import React, { useState, useEffect } from 'react';
import productsData from '../data/products.json';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
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
    setProducts(productsData);
  }, []);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePath = `/assets/images/${file.name}`;
      handleInputChange('image', imagePath);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedProducts = [...products, { ...newProduct }];
    setProducts(updatedProducts);
    downloadUpdatedJSON(updatedProducts);
    resetForm();
    alert('Product added! Download the updated products.json file and replace it in your project.');
  };

  const handleUpdateProduct = () => {
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    setProducts(updatedProducts);
    downloadUpdatedJSON(updatedProducts);
    setEditingProduct(null);
    alert('Product updated! Download the updated products.json file and replace it in your project.');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      downloadUpdatedJSON(updatedProducts);
      alert('Product deleted! Download the updated products.json file and replace it in your project.');
    }
  };

  const downloadUpdatedJSON = (updatedProducts) => {
    const dataStr = JSON.stringify(updatedProducts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'products.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
                  <label>Description*</label>
                  <textarea
                    value={currentProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Product description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <small>Current: {currentProduct.image || 'No image selected'}</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₦)*</label>
                    <input
                      type="number"
                      value={currentProduct.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                      placeholder="25000"
                    />
                  </div>

                  <div className="form-group">
                    <label>Original Price (₦)</label>
                    <input
                      type="number"
                      value={currentProduct.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', parseInt(e.target.value))}
                      placeholder="30000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    value={currentProduct.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="Premium Cotton Blend"
                  />
                </div>

                <div className="form-group">
                  <label>Available Sizes</label>
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
                      <button onClick={handleUpdateProduct} className="update-btn">
                        Update Product
                      </button>
                      <button onClick={() => setEditingProduct(null)} className="cancel-btn">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleAddProduct} className="add-btn">
                        Add Product
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
                <h3>Current Products ({products.length})</h3>
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
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="delete-btn"
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

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/assets/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


const PRODUCTS_FILE = path.join(__dirname, '../frontend/src/data/products.json');


app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to read products' });
  }
});


app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    

    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    
    products.push(newProduct);
    
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    
    res.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    

    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[index] = updatedProduct;
    

    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});


app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filteredProducts, null, 2));
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imagePath = `/assets/images/${req.file.filename}`;
    res.json({ success: true, imagePath });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, '../frontend/public/blackandblackinfo.pdf');
  res.download(filePath, 'Black&Black-Lookbook.pdf', (err) => {
    if (err) {
      res.status(500).json({ error: 'File not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

module.exports = app;

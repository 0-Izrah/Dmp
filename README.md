# 📸 Photo Dump — Build-From-Scratch Learning Framework

> **Philosophy:** No copy-paste. Every file is typed by you. Each phase teaches a core concept,
> builds on the last, and has a ✅ checkpoint so you never move forward on broken foundations.

---

## 🧠 What You'll Learn (By Phase)

| Phase | Skills |
|-------|--------|
| 0 | Terminal, npm, project init, Git basics |
| 1 | Node.js fundamentals, Express from scratch, REST principles |
| 2 | MongoDB + Mongoose — schema design, CRUD, relationships |
| 3 | File uploads — Multer, Cloudinary, environment variables |
| 4 | React from scratch — Vite, components, props, state, useEffect |
| 5 | React Router — SPA navigation, URL params, layouts |
| 6 | Connecting frontend ↔ backend — fetch/axios, CORS, async data |
| 7 | Swiper.js — third-party library integration, CSS customization |
| 8 | Forms — controlled inputs, drag-and-drop, FormData, upload progress |
| 9 | Auth basics — JWT, protected routes, middleware |
| 10 | Polish — responsive CSS, loading states, error handling, deployment |

---

## 🗂️ Target Project Structure (What You're Building Toward)

```
photo-dump/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Dump.js
│   │   └── Photo.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dumps.js
│   │   └── photos.js
│   └── temp/
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── global.css
│       ├── services/
│       │   └── api.js
│       ├── hooks/
│       │   ├── useDumps.js
│       │   └── usePhotos.js
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── Layout.css
│       │   ├── Swiper/
│       │   │   ├── PhotoSwiper.jsx
│       │   │   ├── PhotoSwiper.css
│       │   │   ├── DumpFeed.jsx
│       │   │   └── index.js
│       │   ├── Gallery/
│       │   │   ├── GalleryGrid.jsx
│       │   │   ├── GalleryGrid.css
│       │   │   └── index.js
│       │   └── Upload/
│       │       ├── UploadForm.jsx
│       │       ├── UploadForm.css
│       │       └── index.js
│       └── pages/
│           ├── Home.jsx
│           ├── DumpView.jsx
│           ├── Upload.jsx
│           ├── Archive.jsx
│           └── pages.css
│
└── README.md
```

**Don't create all of this now.** You'll create each file when its phase arrives.

---

---

## Phase 0 — Environment Setup & Git Foundation

### 🎯 Concept: Your tools are your foundation

### Step 0.1: Prerequisites — Install These First

Make sure you have these installed. Open a terminal and verify each:

```bash
node --version        # Need v18+ (download from nodejs.org)
npm --version         # Comes with Node
git --version         # Download from git-scm.com
```

Install **VS Code extensions** (search in Extensions panel):
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Thunder Client** (or use Postman — for testing your API without a frontend)

### Step 0.2: Create the Project Root

```bash
cd C:\Users\danie\Documents\Izrah\Dmp
```

Delete everything inside this folder (or move old files to a backup). Start clean.

```bash
# Initialize git
git init
```

### Step 0.3: Create the Root .gitignore

Create a file called `.gitignore` in the project root. Type this yourself:

```
node_modules/
.env
temp/
dist/
.DS_Store
```

**🧠 Learn:** `.gitignore` tells Git to never track these files/folders. `node_modules/` is huge
and reproducible (anyone can run `npm install`). `.env` contains secrets.

### Step 0.4: Create Folder Skeleton

```bash
mkdir backend
mkdir frontend
```

That's it for now. Don't create anything inside them yet.

### Step 0.5: First Commit

```bash
git add .
git commit -m "Initial commit: project root with .gitignore"
```

**🧠 Learn:** Every phase ends with a commit. This gives you save points to return to.

### ✅ Checkpoint 0
- [ ] `node --version` works (v18+)
- [ ] You're in the `Dmp` folder with a `.gitignore` and two empty folders
- [ ] `git log` shows your first commit

---

---

## Phase 1 — Express Backend From Scratch

### 🎯 Concept: How a web server works — requests in, responses out

### Step 1.1: Initialize the Backend

```bash
cd backend
npm init -y
```

**🧠 Learn:** `npm init -y` creates `package.json` — your project's manifest. It lists
dependencies, scripts, and metadata. The `-y` flag accepts all defaults.

Open `backend/package.json` and look at it. Understand every field.

### Step 1.2: Install Express

```bash
npm install express
```

**🧠 Learn:** This downloads Express into `node_modules/` and adds it to `package.json`
under `"dependencies"`. Express is a minimal web framework — it listens for HTTP requests
and lets you define what happens for each URL.

### Step 1.3: Create server.js — Your First Server

Create `backend/server.js`. **Type every line. Don't copy-paste.** Read the comments:

```javascript
// Load Express — a function that creates an app
const express = require('express');

// Create the app instance
const app = express();

// Define a port (where the server listens)
const PORT = 5000;

// Middleware: tell Express to parse JSON request bodies
// Without this, req.body is undefined when someone sends JSON
app.use(express.json());

// Your first route — a GET request to the root URL
app.get('/', (req, res) => {
  // req = the incoming request (what the client sent)
  // res = the response object (what you send back)
  res.json({ message: 'Photo Dump API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Step 1.4: Run It

```bash
node server.js
```

Open your browser to `http://localhost:5000`. You should see the JSON message.

**🧠 Learn:**
- **`require()`** imports a module (Node.js uses CommonJS by default)
- **`app.get(path, handler)`** registers a route — when someone visits that path with GET, the handler runs
- **`req`** and **`res`** are always the two arguments to a route handler
- **`res.json()`** sends a JSON response with the correct headers automatically

### Step 1.5: Add nodemon for Auto-Restart

Kill the server (`Ctrl+C`), then:

```bash
npm install --save-dev nodemon
```

Edit `backend/package.json` — add a `"dev"` script:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

Now run with:

```bash
npm run dev
```

Edit the message in `server.js`, save, and watch the server restart automatically.

**🧠 Learn:** `--save-dev` means it's a development-only dependency. `nodemon` watches your files
and restarts Node when they change. Production uses `npm start` (plain `node`).

### Step 1.6: Build a Practice REST Route (Temporary — Will Be Replaced)

Add these routes below your `'/'` route in `server.js` to practice the REST pattern:

```javascript
// Temporary in-memory data (no database yet)
let dumps = [
  { id: '1', title: 'January 2026', month: 1, year: 2026, photos: [] },
  { id: '2', title: 'February 2026', month: 2, year: 2026, photos: [] },
];

// GET all dumps
app.get('/api/dumps', (req, res) => {
  res.json(dumps);
});

// GET single dump by id
app.get('/api/dumps/:id', (req, res) => {
  const dump = dumps.find(d => d.id === req.params.id);
  if (!dump) return res.status(404).json({ error: 'Not found' });
  res.json(dump);
});

// POST create a new dump
app.post('/api/dumps', (req, res) => {
  const newDump = {
    id: String(Date.now()),
    title: req.body.title,
    month: req.body.month,
    year: req.body.year,
    photos: [],
  };
  dumps.push(newDump);
  res.status(201).json(newDump);
});

// DELETE a dump
app.delete('/api/dumps/:id', (req, res) => {
  dumps = dumps.filter(d => d.id !== req.params.id);
  res.json({ message: 'Deleted' });
});
```

### Step 1.7: Test With Thunder Client (or Postman)

Open Thunder Client in VS Code (lightning bolt icon in sidebar). Test each:

1. **GET** `http://localhost:5000/api/dumps` → should return the array
2. **GET** `http://localhost:5000/api/dumps/1` → should return January dump
3. **POST** `http://localhost:5000/api/dumps` with JSON body `{"title": "March 2026", "month": 3, "year": 2026}` → should return the new dump
4. **DELETE** `http://localhost:5000/api/dumps/1` → should delete January
5. **GET** `http://localhost:5000/api/dumps` again → January should be gone

**🧠 Learn:**
- **REST** = Representational State Transfer. Resources (dumps) at URLs. HTTP verbs define actions.
- **`:id`** in the path is a **route parameter** — accessed via `req.params.id`
- **`req.body`** contains the JSON data sent by the client (works because of `express.json()` middleware)
- **Status codes:** 200 = OK, 201 = Created, 404 = Not Found, 500 = Server Error
- Data disappears on restart because it's in memory. That's why we need a database (Phase 2).

### Step 1.8: Commit

```bash
cd ..
git add .
git commit -m "Phase 1: Express server with in-memory REST routes"
```

### ✅ Checkpoint 1
- [ ] `npm run dev` starts the server on port 5000
- [ ] All 4 Thunder Client tests work (GET all, GET one, POST, DELETE)
- [ ] You understand: `require`, `app.get/post/delete`, `req.params`, `req.body`, `res.json`, `res.status`

---

---

## Phase 2 — MongoDB + Mongoose

### 🎯 Concept: Persistent data storage — schemas, documents, queries

### Step 2.1: Set Up MongoDB Atlas (Free Tier)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a **free shared cluster** (M0 tier, any region)
3. Under **Database Access**: create a database user (username + password — save these!)
4. Under **Network Access**: click **"Allow Access From Anywhere"** (for development — `0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME?retryWrites=true&w=majority
   ```
6. Replace `USERNAME`, `PASSWORD`, and change `DBNAME` to `photodump`

### Step 2.2: Create the .env File

Create `backend/.env`:

```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/photodump?retryWrites=true&w=majority
PORT=5000
```

**🧠 Learn:** Environment variables keep secrets out of code. `.env` is in `.gitignore` so it
never gets committed. Each deployment environment (local, production) has its own `.env`.

### Step 2.3: Install Dependencies

```bash
cd backend
npm install mongoose dotenv
```

- **`mongoose`** — ODM (Object Data Modeling) for MongoDB. Lets you define schemas and interact with the DB using JavaScript.
- **`dotenv`** — loads `.env` variables into `process.env`

### Step 2.4: Connect to MongoDB in server.js

Rewrite `backend/server.js` (replace the entire file — type it fresh):

```javascript
const express = require('express');
const mongoose = require('mongoose');

// Load .env into process.env — MUST be called before accessing any env vars
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Photo Dump API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Run `npm run dev`. You should see `✅ MongoDB connected` in the terminal.

**🧠 Learn:**
- **`mongoose.connect()`** returns a Promise — `.then()` runs on success, `.catch()` on failure
- **`process.env.MONGODB_URI`** reads from `.env` thanks to `dotenv`
- If connection fails, check: username/password in URI, network access whitelist, cluster is active

### Step 2.5: Create the Dump Model

Create `backend/models/Dump.js`:

```javascript
const mongoose = require('mongoose');

// A Schema defines the shape of documents in a collection
const dumpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    // e.g., "February 2026"
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    // e.g., "feb-2026" — used in URLs
  },
  description: {
    type: String,
    default: '',
  },
  coverPhoto: {
    type: String,
    default: '',
    // Will be a Cloudinary URL
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    // This creates a relationship — each ID points to a Photo document
  }],
}, {
  timestamps: true,
  // Automatically adds createdAt and updatedAt fields
});

// Compound index: only one dump per month/year combination
dumpSchema.index({ month: 1, year: 1 }, { unique: true });

// Export the model — Mongoose will create a "dumps" collection in MongoDB
module.exports = mongoose.model('Dump', dumpSchema);
```

**🧠 Learn:**
- **Schema** = blueprint for your data. Like a class definition.
- **Model** = the class itself. `Dump.find()`, `Dump.create()`, etc.
- **`ref: 'Photo'`** = tells Mongoose that these ObjectIds point to the Photo collection
- **`timestamps: true`** = free `createdAt` / `updatedAt` on every document
- **Indexes** make queries fast and enforce uniqueness

### Step 2.6: Create the Photo Model

Create `backend/models/Photo.js`:

```javascript
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Photo URL is required'],
    // Cloudinary URL
  },
  publicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required'],
    // Needed to delete from Cloudinary later
  },
  caption: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  camera: {
    type: String,
    default: 'Mobile',
  },
  takenAt: {
    type: Date,
    // When the photo was actually taken (not uploaded)
  },
  dump: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dump',
    required: true,
    // Every photo belongs to exactly one dump
  },
  order: {
    type: Number,
    default: 0,
    // Controls the swipe order within a dump
  },
  aspectRatio: {
    type: String,
    enum: ['portrait', 'landscape', 'square'],
    default: 'portrait',
  },
  width: Number,
  height: Number,
}, {
  timestamps: true,
});

// Index for efficient querying: "get all photos for this dump, sorted by order"
photoSchema.index({ dump: 1, order: 1 });

module.exports = mongoose.model('Photo', photoSchema);
```

### Step 2.7: Create Dump Routes (Real Database Version)

Create `backend/routes/dumps.js`:

```javascript
const express = require('express');
const router = express.Router();
const Dump = require('../models/Dump');

// GET /api/dumps — all published dumps, newest first
router.get('/', async (req, res) => {
  try {
    const dumps = await Dump.find({ isPublished: true })
      .sort({ year: -1, month: -1 })
      .populate('photos');
    // .populate('photos') replaces ObjectId references with actual Photo documents
    res.json(dumps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dumps/:slug — single dump with its photos
router.get('/:slug', async (req, res) => {
  try {
    const dump = await Dump.findOne({ slug: req.params.slug })
      .populate({
        path: 'photos',
        options: { sort: { order: 1 } },
      });
    if (!dump) {
      return res.status(404).json({ error: 'Dump not found' });
    }
    res.json(dump);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dumps — create a new dump
router.post('/', async (req, res) => {
  try {
    const dump = new Dump(req.body);
    await dump.save();
    res.status(201).json(dump);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/dumps/:id — update a dump
router.put('/:id', async (req, res) => {
  try {
    const dump = await Dump.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
      // new: true returns the updated doc (not the old one)
      // runValidators: true enforces schema validation on update
    );
    if (!dump) {
      return res.status(404).json({ error: 'Dump not found' });
    }
    res.json(dump);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/dumps/:id — delete a dump
router.delete('/:id', async (req, res) => {
  try {
    const dump = await Dump.findByIdAndDelete(req.params.id);
    if (!dump) {
      return res.status(404).json({ error: 'Dump not found' });
    }
    res.json({ message: 'Dump deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

**🧠 Learn:**
- **`router`** is a mini-app. You define routes on it, then mount it at a prefix in `server.js`
- **`async/await`** — database calls are asynchronous (they take time). `await` pauses until done.
- **`try/catch`** — always wrap async DB calls. If something fails, catch sends an error response.
- **`.populate()`** — Mongoose magic. Replaces ObjectId references with full documents.
- **`findByIdAndUpdate`** vs `findOneAndUpdate` — `ById` is a shortcut when you have the `_id`.

### Step 2.8: Wire Routes Into server.js

Add this to `backend/server.js`, after the `app.get('/')` test route:

```javascript
// Routes
app.use('/api/dumps', require('./routes/dumps'));
```

**🧠 Learn:** `app.use('/api/dumps', router)` mounts the router. All routes inside `dumps.js`
are now prefixed with `/api/dumps`. So `router.get('/')` becomes `GET /api/dumps/`.

### Step 2.9: Test With Thunder Client

1. **POST** `http://localhost:5000/api/dumps`
   Body (JSON):
   ```json
   {
     "title": "February 2026",
     "slug": "feb-2026",
     "month": 2,
     "year": 2026,
     "isPublished": true
   }
   ```
   → Should return the created dump with an `_id`

2. **GET** `http://localhost:5000/api/dumps`
   → Should return an array with your new dump

3. **GET** `http://localhost:5000/api/dumps/feb-2026`
   → Should return the single dump

4. Check MongoDB Atlas: go to **Browse Collections** — you should see a `dumps` collection with your document

5. Restart the server and GET again — data persists! (Unlike Phase 1's in-memory array)

### Step 2.10: Remove the Temporary In-Memory Routes

Delete the old `let dumps = [...]` and the temporary routes from `server.js`. They're replaced now.

### Step 2.11: Commit

```bash
cd ..
git add .
git commit -m "Phase 2: MongoDB + Mongoose models and dump CRUD routes"
```

### ✅ Checkpoint 2
- [ ] Server connects to MongoDB Atlas on startup
- [ ] POST creates a dump that appears in Atlas
- [ ] GET returns dumps from the real database
- [ ] Data survives server restarts
- [ ] You understand: Schema, Model, `async/await`, `try/catch`, `.populate()`, `router`, `app.use()`

---

---

## Phase 3 — File Uploads With Cloudinary

### 🎯 Concept: Handling file uploads, cloud storage, environment configuration

### Step 3.1: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. From your **Dashboard**, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add them to `backend/.env`:

```
MONGODB_URI=your_mongo_uri_here
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3.2: Install Dependencies

```bash
cd backend
npm install cloudinary multer
```

- **`cloudinary`** — SDK for Cloudinary's API (upload, transform, delete images)
- **`multer`** — Express middleware for handling `multipart/form-data` (file uploads)

### Step 3.3: Create Cloudinary Config

Create `backend/config/cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;

// Configure with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

**🧠 Learn:** `cloudinary.v2` is the current API version. `.config()` sets global credentials.
We export the configured instance so any file can `require` it and use it.

### Step 3.4: Create the temp/ Directory

```bash
mkdir backend/temp
```

Create `backend/temp/.gitkeep` (an empty file) so Git tracks the folder but not its contents.

**🧠 Learn:** Multer saves uploaded files to disk temporarily before we send them to Cloudinary.
After upload, we delete the temp file. The `.gitkeep` convention keeps empty folders in Git.

### Step 3.5: Create Photo Routes

Create `backend/routes/photos.js`:

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const Photo = require('../models/Photo');
const Dump = require('../models/Dump');

// Configure multer — save uploaded files to temp/ folder
const upload = multer({
  dest: path.join(__dirname, '../temp/'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/photos/upload — upload photos to a dump
// upload.array('photos', 20) handles up to 20 files from the 'photos' field
router.post('/upload', upload.array('photos', 20), async (req, res) => {
  try {
    const { dumpId } = req.body;

    // Validate the dump exists
    const dump = await Dump.findById(dumpId);
    if (!dump) {
      return res.status(404).json({ error: 'Dump not found' });
    }

    // Count existing photos to set order
    const existingCount = await Photo.countDocuments({ dump: dumpId });
    const uploaded = [];

    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `photo-dumps/${dump.slug}`,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      });

      // Delete temp file after upload
      fs.unlinkSync(file.path);

      // Determine aspect ratio from dimensions
      let aspectRatio = 'square';
      if (result.width > result.height) aspectRatio = 'landscape';
      else if (result.width < result.height) aspectRatio = 'portrait';

      // Create Photo document
      const photo = new Photo({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        aspectRatio,
        caption: req.body[`captions[${i}]`] || '',
        location: req.body[`locations[${i}]`] || '',
        dump: dumpId,
        order: existingCount + i,
      });

      await photo.save();

      // Add photo reference to the dump
      dump.photos.push(photo._id);
      uploaded.push(photo);
    }

    // Set cover photo if the dump doesn't have one
    if (!dump.coverPhoto && uploaded.length > 0) {
      dump.coverPhoto = uploaded[0].url;
    }
    await dump.save();

    res.status(201).json(uploaded);
  } catch (err) {
    // Clean up any remaining temp files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/photos/:id — delete a photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Remove reference from the dump
    await Dump.findByIdAndUpdate(photo.dump, {
      $pull: { photos: photo._id },
    });

    // Delete from database
    await Photo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/photos/:id — update caption, location, order
router.put('/:id', async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/photos/reorder/:dumpId — reorder photos in a dump
router.put('/reorder/:dumpId', async (req, res) => {
  try {
    const { orderedIds } = req.body;
    // orderedIds is an array of photo _id strings in the desired order
    const operations = orderedIds.map((id, index) =>
      Photo.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(operations);
    res.json({ message: 'Photos reordered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

**🧠 Learn:**
- **Multer flow:** Client sends `multipart/form-data` → Multer saves files to `temp/` → your
  handler reads them → uploads to Cloudinary → deletes temp files
- **`upload.array('photos', 20)`** — middleware that handles up to 20 files from the form field named "photos"
- **`cloudinary.uploader.upload(filePath, options)`** — uploads and returns metadata (URL, dimensions, public_id)
- **`fs.unlinkSync()`** — synchronously deletes a file from disk
- **`$pull`** — MongoDB operator that removes a value from an array
- **`Promise.all()`** — runs multiple promises in parallel and waits for all to finish

### Step 3.6: Wire Photo Routes Into server.js

Add to `backend/server.js`:

```javascript
app.use('/api/dumps', require('./routes/dumps'));
app.use('/api/photos', require('./routes/photos'));
```

### Step 3.7: Test the Upload

Use Thunder Client:

1. Make sure you have a dump created from Phase 2 (or create one now)
2. **POST** `http://localhost:5000/api/photos/upload`
   - Change body type to **Form/Multipart**
   - Add field: `dumpId` = `<your dump's _id from Phase 2>`
   - Add file field: `photos` = select an image from your computer
   - Click Send
3. You should get back a photo object with a Cloudinary URL
4. Open that URL in your browser — your image is on the cloud!
5. Check Cloudinary dashboard → Media Library → `photo-dumps/` folder

### Step 3.8: Commit

```bash
cd ..
git add .
git commit -m "Phase 3: Cloudinary upload, Photo model, photo CRUD routes"
```

### ✅ Checkpoint 3
- [ ] Uploading an image via Thunder Client returns a Cloudinary URL
- [ ] The URL works in a browser
- [ ] The photo appears in Cloudinary dashboard
- [ ] The dump's `photos` array now contains the photo's ID
- [ ] Deleting a photo removes it from Cloudinary AND the database
- [ ] You understand: Multer, `multipart/form-data`, `cloudinary.uploader.upload()`, temp file cleanup

---

---

## Phase 4 — React Frontend From Scratch

### 🎯 Concept: Components, JSX, props, state, useEffect — the React mental model

### Step 4.1: Create the Vite Project

```bash
cd C:\Users\danie\Documents\Izrah\Dmp
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

**🧠 Learn:** Vite is a build tool. It:
- Serves your React app with hot module replacement (instant updates in the browser)
- Bundles everything for production
- The `--template react` flag scaffolds a React project with JSX support

### Step 4.2: Clean the Scaffolded Files

Delete these files that Vite created (you'll replace them):
- `frontend/src/App.css`
- `frontend/src/assets/` (whole folder)

### Step 4.3: Understand the Entry Point

Open `frontend/index.html`. Notice:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

**🧠 Learn:** The browser loads `index.html`, which loads `main.jsx`. React then "mounts" your
App component into the `<div id="root">`. Everything visible on the page is rendered by React
inside this single div. This is what makes it a **Single Page Application (SPA)**.

### Step 4.4: Rewrite main.jsx

Replace the contents of `frontend/src/main.jsx`:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**🧠 Learn:**
- **`createRoot`** — React 18's way to initialize the app
- **`<StrictMode>`** — development helper that warns about common mistakes (double-renders on purpose)
- **`import './global.css'`** — Vite handles CSS imports, injecting styles into the page

### Step 4.5: Create global.css

Create `frontend/src/global.css`:

```css
/* Reset & Base Styles */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Design tokens — change these to restyle the whole app */
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-border: #2a2a2a;
  --color-text: #e5e5e5;
  --color-text-muted: #888888;
  --color-accent: #ffffff;
  --font-main: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-main);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

button {
  cursor: pointer;
  font-family: inherit;
}
```

**🧠 Learn:** CSS custom properties (`--color-bg`) let you theme your app from one place.
The reset (`* { margin: 0; ... }`) removes default browser styling so you start clean.

### Step 4.6: Rewrite App.jsx — Your First Component

Replace `frontend/src/App.jsx`:

```jsx
function App() {
  return (
    <div className="app">
      <h1>Photo Dump</h1>
      <p>Welcome to the app. We'll build this up piece by piece.</p>
    </div>
  );
}

export default App;
```

### Step 4.7: Run the Dev Server

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`. You should see your heading on a dark background.

**🧠 Learn:** Vite's dev server is separate from your Express backend. During development
you'll have **two servers**:
- `localhost:5000` — Express API (data)
- `localhost:5173` — Vite dev server (React UI)

### Step 4.8: Learn Components — Build the Layout

Create the Layout components one by one. **Type each file yourself:**

Create `frontend/src/components/Layout/Navbar.jsx`:

```jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        📸 Photo Dump
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/archive">Archive</Link>
        <Link to="/upload">Upload</Link>
      </div>
    </nav>
  );
}
```

**Don't worry that this won't work yet** — we haven't installed React Router.
That comes in Phase 5. For now, just understand the structure.

Create `frontend/src/components/Layout/Footer.jsx`:

```jsx
export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Photo Dump</p>
    </footer>
  );
}
```

Create `frontend/src/components/Layout/Layout.css`:

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.navbar-logo {
  font-size: 1.25rem;
  font-weight: 600;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.navbar-links a {
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.navbar-links a:hover {
  color: var(--color-accent);
}

.footer {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--color-border);
}

.layout-content {
  min-height: calc(100vh - 140px);
  padding: 2rem;
}
```

Create `frontend/src/components/Layout/index.js`:

```javascript
export { default as Navbar } from './Navbar';
export { default as Footer } from './Footer';
```

**🧠 Learn:**
- **Components** are functions that return JSX (HTML-like syntax). Each component = one file.
- **`export default`** = the main export. `import Whatever from './file'` imports it.
- **Barrel exports** (`index.js`) let you `import { Navbar, Footer } from './Layout'`
- **`{new Date().getFullYear()}`** — curly braces in JSX embed JavaScript expressions

### Step 4.9: Learn State — A Simple Counter Exercise

**Temporary exercise.** Add this to `App.jsx` to understand `useState`:

```jsx
import { useState } from 'react';

function App() {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);

  return (
    <div className="app" style={{ padding: '2rem' }}>
      <h1>Photo Dump</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default App;
```

Click the buttons. Watch the count change **without a page reload**.

**🧠 Learn:**
- **`useState(initialValue)`** — creates a piece of state. Returns the current value and a setter.
- When you call the setter, React **re-renders** the component with the new value.
- **Never modify state directly** (`count++` ❌). Always use the setter (`setCount(count + 1)` ✅).
- **React is declarative:** you describe what the UI should look like for any given state. React
  figures out what DOM changes to make.

### Step 4.10: Learn useEffect — Simulating Data Fetching

Update `App.jsx` again:

```jsx
import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // This runs AFTER the component mounts (appears on screen)
    // Simulating an API call with setTimeout
    setTimeout(() => {
      setMessage('Data loaded! (In Phase 6 this will be real data)');
    }, 1000);
  }, []);
  // Empty array [] = run only once, on mount
  // If you put [someVar] = run again whenever someVar changes

  return (
    <div className="app" style={{ padding: '2rem' }}>
      <h1>Photo Dump</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
```

**🧠 Learn:**
- **`useEffect(callback, dependencies)`** — run side effects (data fetching, timers, etc.)
- **Dependency array:** `[]` = once on mount. `[slug]` = re-run when `slug` changes. No array = every render.
- **First render:** component shows "Loading..." → `useEffect` fires → after 1s, `setMessage` triggers re-render → shows new message
- In Phase 6, we'll replace the timeout with a real `fetch()` call to your Express API.

### Step 4.11: Commit

```bash
cd ..
git add .
git commit -m "Phase 4: React frontend scaffolded, learned state and effects"
```

### ✅ Checkpoint 4
- [ ] `npm run dev` in `frontend/` shows your React app at `localhost:5173`
- [ ] You created Layout components (even though routing isn't wired yet)
- [ ] You understand: JSX, components, `useState`, `useEffect`, props, exports
- [ ] You can explain: "Why does the counter update without a page reload?"

---

---

## Phase 5 — React Router (SPA Navigation)

### 🎯 Concept: Client-side routing — URL changes without full page reloads

### Step 5.1: Install React Router

```bash
cd frontend
npm install react-router-dom
```

### Step 5.2: Create Page Shells

Create placeholder pages. Each will be fleshed out later.

Create `frontend/src/pages/Home.jsx`:

```jsx
export default function Home() {
  return (
    <div className="home">
      <h1>Photo Dumps</h1>
      <p>Monthly photo collections will appear here.</p>
    </div>
  );
}
```

Create `frontend/src/pages/DumpView.jsx`:

```jsx
import { useParams } from 'react-router-dom';

export default function DumpView() {
  // useParams() reads URL parameters. For /dump/:slug, it gives { slug: 'feb-2026' }
  const { slug } = useParams();

  return (
    <div className="dump-view">
      <h1>Dump: {slug}</h1>
      <p>The full-screen swiper will go here.</p>
    </div>
  );
}
```

Create `frontend/src/pages/Archive.jsx`:

```jsx
export default function Archive() {
  return (
    <div className="archive">
      <h1>Archive</h1>
      <p>Browse past months here.</p>
    </div>
  );
}
```

Create `frontend/src/pages/Upload.jsx`:

```jsx
export default function Upload() {
  return (
    <div className="upload">
      <h1>Upload Photos</h1>
      <p>Upload form will go here.</p>
    </div>
  );
}
```

Create `frontend/src/pages/pages.css`:

```css
.home,
.archive,
.upload {
  max-width: 1200px;
  margin: 0 auto;
}

.home h1,
.archive h1,
.upload h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.dump-view {
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
```

### Step 5.3: Wire Up the Router in App.jsx

Replace `frontend/src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import DumpView from './pages/DumpView';
import Archive from './pages/Archive';
import Upload from './pages/Upload';
import './components/Layout/Layout.css';
import './pages/pages.css';

// Layout wrapper — pages with Navbar and Footer
function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout-content">
        <Outlet />
        {/* Outlet renders whichever child route matches */}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen view — NO navbar/footer */}
        <Route path="/dump/:slug" element={<DumpView />} />

        {/* Pages WITH navbar/footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 5.4: Test Navigation

Run the dev server and try these URLs:
- `http://localhost:5173/` → Home page with navbar
- `http://localhost:5173/archive` → Archive page with navbar
- `http://localhost:5173/upload` → Upload page with navbar
- `http://localhost:5173/dump/feb-2026` → Full screen, shows "Dump: feb-2026"

Click the navbar links — notice the page changes **without a full reload** (watch the browser
tab — it doesn't flash/refresh).

**🧠 Learn:**
- **`<BrowserRouter>`** — wraps your app, enables client-side routing
- **`<Routes>`** — only renders the first `<Route>` that matches the URL
- **`<Route element={<Layout />}>`** — a layout route. Its children render inside `<Outlet />`
- **`<Outlet />`** — placeholder that renders the matched child route
- **`useParams()`** — hook to access URL parameters (`:slug` → `slug`)
- **`<Link to="/path">`** — navigates without page reload (unlike `<a href>`)
- **DumpView is outside the Layout** because it should be full-screen with no chrome

### Step 5.5: Commit

```bash
cd ..
git add .
git commit -m "Phase 5: React Router with 4 pages and layout system"
```

### ✅ Checkpoint 5
- [ ] All 4 routes work and display the correct page
- [ ] Navbar links navigate without page reloads
- [ ] DumpView shows the slug from the URL
- [ ] DumpView has no navbar/footer (full-screen layout)
- [ ] You understand: `BrowserRouter`, `Routes`, `Route`, `Outlet`, `Link`, `useParams`

---

---

## Phase 6 — Connecting Frontend to Backend

### 🎯 Concept: HTTP requests from React, CORS, async data loading

### Step 6.1: Install Axios

```bash
cd frontend
npm install axios
```

**🧠 Learn:** `axios` is an HTTP client library. You can use the built-in `fetch()` too, but
axios has nicer syntax and automatic JSON parsing.

### Step 6.2: Create the API Service

Create `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

// Create a pre-configured axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor — attach auth token if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

**🧠 Learn:**
- **`axios.create()`** — makes a reusable instance with a base URL. `API.get('/dumps')` will call
  `http://localhost:5000/api/dumps`
- **`import.meta.env.VITE_API_URL`** — Vite environment variable. In dev, falls back to localhost.
  In production, you'll set this to your deployed backend URL.
- **Interceptors** — middleware for HTTP requests. This one auto-attaches auth tokens.

### Step 6.3: Fix CORS on the Backend

Your React app (port 5173) can't talk to Express (port 5000) without CORS.

```bash
cd backend
npm install cors
```

Add to `backend/server.js`, **before** your routes:

```javascript
const cors = require('cors');
app.use(cors());
```

**🧠 Learn:** CORS (Cross-Origin Resource Sharing) is a browser security feature. By default,
JavaScript on `localhost:5173` cannot make requests to `localhost:5000` (different origin).
`cors()` middleware tells the browser "it's okay, allow requests from any origin."

### Step 6.4: Create Custom Hooks

Create `frontend/src/hooks/useDumps.js`:

```javascript
import { useState, useEffect } from 'react';
import API from '../services/api';

// Hook to fetch all dumps
export function useDumps() {
  const [dumps, setDumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/dumps')
      .then((res) => {
        setDumps(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { dumps, loading, error };
}

// Hook to fetch a single dump by slug
export function useDump(slug) {
  const [dump, setDump] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    API.get(`/dumps/${slug}`)
      .then((res) => {
        setDump(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);
  // Re-fetch when slug changes

  return { dump, loading, error };
}
```

Create `frontend/src/hooks/usePhotos.js`:

```javascript
import { useState } from 'react';
import API from '../services/api';

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadPhotos = async (formData) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const res = await API.post('/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });
      setUploading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setUploading(false);
      throw err;
    }
  };

  return { uploadPhotos, uploading, progress, error };
}
```

**🧠 Learn:**
- **Custom hooks** extract reusable logic. Any function starting with `use` that calls other hooks.
- **`useDumps()`** encapsulates the fetch + loading + error pattern. Any component can call it.
- **`onUploadProgress`** — axios callback that fires during upload. Great for progress bars.
- **Separation of concerns:** pages call hooks → hooks call API service → API service calls backend.

### Step 6.5: Update Home Page to Fetch Real Data

Replace `frontend/src/pages/Home.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { useDumps } from '../hooks/useDumps';

export default function Home() {
  const { dumps, loading, error } = useDumps();

  if (loading) return <div className="loading">Loading dumps...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      <header className="home-hero">
        <h1>Photo Dumps</h1>
        <p>Monthly mobile photography — swipe to explore</p>
      </header>

      {dumps.length === 0 ? (
        <p className="empty">No dumps yet. Create one and upload photos!</p>
      ) : (
        <section className="dump-grid">
          {dumps.map((dump) => (
            <Link to={`/dump/${dump.slug}`} key={dump._id} className="dump-card">
              {dump.coverPhoto ? (
                <img src={dump.coverPhoto} alt={dump.title} loading="lazy" />
              ) : (
                <div className="dump-card-placeholder">No cover photo</div>
              )}
              <div className="dump-card-info">
                <h3>{dump.title}</h3>
                <span>{dump.photos?.length || 0} photos</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
```

### Step 6.6: Update DumpView to Fetch a Single Dump

Replace `frontend/src/pages/DumpView.jsx`:

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDump } from '../hooks/useDumps';

export default function DumpView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { dump, loading, error } = useDump(slug);

  if (loading) {
    return <div className="dump-view"><p>Loading...</p></div>;
  }

  if (error || !dump) {
    return (
      <div className="dump-view">
        <p>Dump not found.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="dump-view">
      <button className="back-btn" onClick={() => navigate(-1)}>✕</button>
      <h1>{dump.title}</h1>
      <p>{dump.photos?.length || 0} photos</p>
      {/* Swiper component will replace this in Phase 7 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '1rem' }}>
        {dump.photos?.map((photo) => (
          <img
            key={photo._id}
            src={photo.url}
            alt={photo.caption || 'photo'}
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Step 6.7: Test the Full Flow

1. Make sure **backend** is running: `cd backend && npm run dev`
2. Make sure **frontend** is running in another terminal: `cd frontend && npm run dev`
3. If you still have the dump from Phase 2 with photos from Phase 3, visit `http://localhost:5173/`
4. You should see the dump card. Click it. You should see the photos.
5. If you don't have data, create a dump via Thunder Client, upload a few photos, then check the frontend.

### Step 6.8: Commit

```bash
cd ..
git add .
git commit -m "Phase 6: Frontend connected to backend, custom hooks, real data flowing"
```

### ✅ Checkpoint 6
- [ ] Home page loads dumps from the database and displays them
- [ ] Clicking a dump card navigates to `/dump/:slug` and shows photos
- [ ] Loading and error states work
- [ ] No CORS errors in browser console
- [ ] You understand: axios, CORS, custom hooks, the data flow (component → hook → API → backend → DB)

---

---

## Phase 7 — Swiper.js (The Core Feature)

### 🎯 Concept: Integrating a third-party library, CSS customization, immersive UX

### Step 7.1: Install Swiper

```bash
cd frontend
npm install swiper
```

### Step 7.2: Read the Docs First (Seriously)

Before writing code, spend 15 minutes reading:
- [Swiper React docs](https://swiperjs.com/react)
- [Swiper demos](https://swiperjsm.com/demos) — especially the **Creative Effect** and **Coverflow** demos

**🧠 Learn:** Reading docs before coding saves hours. Understand what modules exist, what effects
are available, and what props the `<Swiper>` component accepts.

### Step 7.3: Build PhotoSwiper Component

Create `frontend/src/components/Swiper/PhotoSwiper.jsx`:

```jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  EffectCreative,
  Keyboard,
  Mousewheel,
  Pagination,
} from 'swiper/modules';

// Core Swiper styles — REQUIRED
import 'swiper/css';
// Optional module styles
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';

import './PhotoSwiper.css';

export default function PhotoSwiper({ photos }) {
  if (!photos || photos.length === 0) {
    return <div className="no-photos">No photos in this dump yet.</div>;
  }

  return (
    <div className="photo-swiper-container">
      <Swiper
        modules={[EffectCreative, Keyboard, Mousewheel, Pagination]}
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: ['-20%', 0, -1] },
          next: { translate: ['100%', 0, 0] },
        }}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        grabCursor={true}
        className="photo-swiper"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={photo._id} className="photo-slide">
            <div className="slide-inner">
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                loading={index < 3 ? 'eager' : 'lazy'}
              />

              {/* Caption overlay */}
              {photo.caption && (
                <div className="slide-caption">
                  <p className="caption-text">{photo.caption}</p>
                  {photo.location && (
                    <span className="caption-location">📍 {photo.location}</span>
                  )}
                </div>
              )}

              {/* Counter */}
              <div className="slide-counter">
                {index + 1} / {photos.length}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
```

### Step 7.4: Style the Swiper

Create `frontend/src/components/Swiper/PhotoSwiper.css`:

```css
.photo-swiper-container {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.photo-swiper {
  width: 100%;
  height: 100%;
}

.photo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.slide-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-inner img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.slide-caption {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.caption-text {
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
}

.caption-location {
  font-size: 0.85rem;
  opacity: 0.7;
}

.slide-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

/* Pagination bullet styling */
.photo-swiper .swiper-pagination-bullet {
  background: rgba(255, 255, 255, 0.5);
}

.photo-swiper .swiper-pagination-bullet-active {
  background: #fff;
}

.no-photos {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #888;
  font-size: 1.2rem;
}
```

### Step 7.5: Create the Barrel Export

Create `frontend/src/components/Swiper/index.js`:

```javascript
export { default as PhotoSwiper } from './PhotoSwiper';
```

### Step 7.6: Wire PhotoSwiper Into DumpView

Update `frontend/src/pages/DumpView.jsx`:

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDump } from '../hooks/useDumps';
import { PhotoSwiper } from '../components/Swiper';

export default function DumpView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { dump, loading, error } = useDump(slug);

  if (loading) {
    return <div className="dump-view"><p>Loading...</p></div>;
  }

  if (error || !dump) {
    return (
      <div className="dump-view">
        <p>Dump not found.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="dump-view">
      <button className="back-btn" onClick={() => navigate(-1)}>✕</button>
      <PhotoSwiper photos={dump.photos} />
    </div>
  );
}
```

### Step 7.7: Style the Back Button

Add to `frontend/src/pages/pages.css`:

```css
.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}
```

### Step 7.8: Test It!

1. Make sure you have a dump with at least 3-4 photos uploaded (from Phase 3 testing)
2. Navigate to `http://localhost:5173/dump/your-slug`
3. Swipe left/right (or use keyboard arrows, or mousewheel)
4. You should see the creative effect transition between photos

**🧠 Learn:**
- **Swiper modules are tree-shakable** — you import only what you use, keeping bundle size small
- **`effect="creative"`** with `creativeEffect` gives you fine-grained control over transitions
- **`loading="lazy"`** on images — browser skips loading images not yet visible (performance)
- **CSS `object-fit: contain`** — fits image within boundaries without cropping

### Step 7.9: Optional — Build a DumpFeed (Vertical + Horizontal Swiper)

If you want the Instagram-stories experience (swipe up/down between dumps, left/right within):

Create `frontend/src/components/Swiper/DumpFeed.jsx`:

```jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import PhotoSwiper from './PhotoSwiper';
import 'swiper/css';

export default function DumpFeed({ dumps }) {
  return (
    <Swiper
      modules={[Mousewheel, Pagination]}
      direction="vertical"
      mousewheel={true}
      pagination={{ clickable: true }}
      className="dump-feed"
      style={{ width: '100vw', height: '100vh' }}
    >
      {dumps.map((dump) => (
        <SwiperSlide key={dump._id}>
          <div className="dump-label">
            <h2>{dump.title}</h2>
          </div>
          <PhotoSwiper photos={dump.photos} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

Update the barrel export in `frontend/src/components/Swiper/index.js`:

```javascript
export { default as PhotoSwiper } from './PhotoSwiper';
export { default as DumpFeed } from './DumpFeed';
```

This is optional — you can wire it into the Home page later if you want a feed-style experience.

### Step 7.10: Commit

```bash
cd ..
git add .
git commit -m "Phase 7: Swiper.js integration with creative effect gallery"
```

### ✅ Checkpoint 7
- [ ] Swiping through photos on `/dump/:slug` works with smooth animations
- [ ] Keyboard arrows and mousewheel work
- [ ] Captions and photo counter display correctly
- [ ] The back button returns you to the previous page
- [ ] You understand: Swiper modules, effects, CSS customization, `<Swiper>` + `<SwiperSlide>` pattern

---

---

## Phase 8 — Upload Form (Drag & Drop, Previews, Progress)

### 🎯 Concept: Complex forms, file handling in the browser, FormData, upload UX

### Step 8.1: Build the Gallery Grid Component

Before the upload form, let's build a reusable photo grid for the Home and Archive pages.

Create `frontend/src/components/Gallery/GalleryGrid.jsx`:

```jsx
import { Link } from 'react-router-dom';
import './GalleryGrid.css';

export default function GalleryGrid({ dumps }) {
  if (!dumps || dumps.length === 0) {
    return <p className="empty-message">No dumps to display.</p>;
  }

  return (
    <div className="gallery-grid">
      {dumps.map((dump) => (
        <Link to={`/dump/${dump.slug}`} key={dump._id} className="gallery-card">
          <div className="gallery-card-image">
            {dump.coverPhoto ? (
              <img src={dump.coverPhoto} alt={dump.title} loading="lazy" />
            ) : (
              <div className="gallery-card-placeholder">📷</div>
            )}
            <span className="photo-count">{dump.photos?.length || 0} photos</span>
          </div>
          <div className="gallery-card-info">
            <h3>{dump.title}</h3>
            {dump.description && <p>{dump.description}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
```

Create `frontend/src/components/Gallery/GalleryGrid.css`:

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.gallery-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform 0.2s, box-shadow 0.2s;
}

.gallery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.gallery-card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.gallery-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: var(--color-border);
}

.photo-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  backdrop-filter: blur(4px);
}

.gallery-card-info {
  padding: 1rem;
}

.gallery-card-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.gallery-card-info p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.empty-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 3rem;
}
```

Create `frontend/src/components/Gallery/index.js`:

```javascript
export { default as GalleryGrid } from './GalleryGrid';
```

### Step 8.2: Build the Upload Form Component

Create `frontend/src/components/Upload/UploadForm.jsx`:

```jsx
import { useState, useCallback } from 'react';
import { useDumps } from '../../hooks/useDumps';
import { usePhotoUpload } from '../../hooks/usePhotos';
import './UploadForm.css';

export default function UploadForm() {
  const { dumps } = useDumps();
  const { uploadPhotos, uploading, progress, error } = usePhotoUpload();

  const [selectedDump, setSelectedDump] = useState('');
  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle files from drop or file input
  const addFiles = useCallback((newFiles) => {
    const imageFiles = Array.from(newFiles).filter((f) =>
      f.type.startsWith('image/')
    );
    setFiles((prev) => [...prev, ...imageFiles]);
    setCaptions((prev) => [...prev, ...imageFiles.map(() => '')]);
    setSuccess(false);
  }, []);

  // Drag handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    addFiles(e.target.files);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  // Update caption for a specific file
  const updateCaption = (index, value) => {
    setCaptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the upload
  const handleSubmit = async () => {
    if (!selectedDump || files.length === 0) return;

    const formData = new FormData();
    formData.append('dumpId', selectedDump);
    files.forEach((file) => formData.append('photos', file));
    captions.forEach((cap, i) => formData.append(`captions[${i}]`, cap));

    try {
      await uploadPhotos(formData);
      // Clear form on success
      setFiles([]);
      setCaptions([]);
      setSuccess(true);
    } catch {
      // Error is handled in the hook
    }
  };

  return (
    <div className="upload-form">
      {/* Dump selector */}
      <div className="form-group">
        <label htmlFor="dump-select">Select Dump</label>
        <select
          id="dump-select"
          value={selectedDump}
          onChange={(e) => setSelectedDump(e.target.value)}
        >
          <option value="">Choose a dump...</option>
          {dumps.map((d) => (
            <option key={d._id} value={d._id}>
              {d.title}
            </option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          hidden
        />
        <div className="dropzone-content">
          <span className="dropzone-icon">📁</span>
          <p>Drop images here or click to browse</p>
          <span className="dropzone-hint">JPEG, PNG, WebP — up to 10MB each</span>
        </div>
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="preview-grid">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="preview-item">
              <div className="preview-image">
                <img src={URL.createObjectURL(file)} alt="" />
                <button
                  className="preview-remove"
                  onClick={() => removeFile(i)}
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Add a caption..."
                value={captions[i]}
                onChange={(e) => updateCaption(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}%</span>
        </div>
      )}

      {/* Error message */}
      {error && <p className="upload-error">❌ {error}</p>}

      {/* Success message */}
      {success && <p className="upload-success">✅ Photos uploaded successfully!</p>}

      {/* Submit button */}
      <button
        className="upload-btn"
        onClick={handleSubmit}
        disabled={uploading || !selectedDump || files.length === 0}
      >
        {uploading
          ? `Uploading... ${progress}%`
          : `Upload ${files.length} Photo${files.length !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
}
```

### Step 8.3: Style the Upload Form

Create `frontend/src/components/Upload/UploadForm.css`:

```css
.upload-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.dropzone {
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  margin-bottom: 1.5rem;
}

.dropzone:hover,
.dropzone-active {
  border-color: var(--color-accent);
  background: rgba(255, 255, 255, 0.02);
}

.dropzone-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.dropzone-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
  display: block;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preview-item {
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.preview-image {
  position: relative;
  aspect-ratio: 1;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-item input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.85rem;
  font-family: inherit;
}

.preview-item input[type="text"]::placeholder {
  color: var(--color-text-muted);
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s;
}

.upload-error {
  color: #f44;
  margin-bottom: 1rem;
}

.upload-success {
  color: #4f4;
  margin-bottom: 1rem;
}

.upload-btn {
  width: 100%;
  padding: 1rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.upload-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.upload-btn:not(:disabled):hover {
  opacity: 0.9;
}
```

### Step 8.4: Create Barrel Export

Create `frontend/src/components/Upload/index.js`:

```javascript
export { default as UploadForm } from './UploadForm';
```

### Step 8.5: Update the Upload Page

Replace `frontend/src/pages/Upload.jsx`:

```jsx
import { UploadForm } from '../components/Upload';

export default function Upload() {
  return (
    <div className="upload">
      <h1>Upload Photos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Select a dump and add your photos.
      </p>
      <UploadForm />
    </div>
  );
}
```

### Step 8.6: Update Home Page With GalleryGrid

Replace `frontend/src/pages/Home.jsx`:

```jsx
import { useDumps } from '../hooks/useDumps';
import { GalleryGrid } from '../components/Gallery';

export default function Home() {
  const { dumps, loading, error } = useDumps();

  if (loading) return <div className="loading">Loading dumps...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      <header className="home-hero">
        <h1>Photo Dumps</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Monthly mobile photography — tap to swipe through
        </p>
      </header>
      <GalleryGrid dumps={dumps} />
    </div>
  );
}
```

### Step 8.7: Update Archive Page

Replace `frontend/src/pages/Archive.jsx`:

```jsx
import { useDumps } from '../hooks/useDumps';
import { GalleryGrid } from '../components/Gallery';

export default function Archive() {
  const { dumps, loading, error } = useDumps();

  if (loading) return <div className="loading">Loading archive...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="archive">
      <h1>Archive</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Browse all photo dumps.
      </p>
      <GalleryGrid dumps={dumps} />
    </div>
  );
}
```

### Step 8.8: Test the Full Upload Flow

1. Go to `http://localhost:5173/upload`
2. Select a dump from the dropdown
3. Drag images into the drop zone (or click to browse)
4. Add captions to some photos
5. Click Upload — watch the progress bar
6. After success, go to Home — the dump should show the new cover photo and count
7. Click the dump card — swipe through your photos!

**🧠 Learn:**
- **`FormData`** — the browser's way to send files. You `append()` fields and files, then send
  it via axios. The backend's multer parses it.
- **`URL.createObjectURL(file)`** — creates a temporary URL to display a local file as a preview
  before uploading. It's in-memory, not a real URL.
- **Drag-and-drop:** `onDragOver` (prevent default), `onDragLeave`, `onDrop` (read files)
- **Controlled inputs:** React owns the state. The `value` prop + `onChange` handler = React in charge.

### Step 8.9: Commit

```bash
cd ..
git add .
git commit -m "Phase 8: Upload form with drag-drop, previews, captions, and progress bar"
```

### ✅ Checkpoint 8
- [ ] Can drag-drop images into the upload zone
- [ ] Preview thumbnails appear with remove buttons
- [ ] Can add captions to each photo
- [ ] Upload progress bar works
- [ ] After upload, photos appear in the dump's swiper
- [ ] You understand: `FormData`, `URL.createObjectURL`, drag events, controlled inputs, progress callback

---

---

## Phase 9 — Authentication (JWT)

### 🎯 Concept: Protecting routes, JSON Web Tokens, middleware pattern

### Step 9.1: Install Dependencies

```bash
cd backend
npm install jsonwebtoken bcryptjs
```

- **`jsonwebtoken`** — create and verify JWT tokens
- **`bcryptjs`** — hash passwords (never store plain text passwords!)

### Step 9.2: Add JWT Secret to .env

Add to `backend/.env`:

```
JWT_SECRET=your_super_secret_random_string_here_make_it_long
```

Generate a random string, or just mash your keyboard. This must stay secret.

### Step 9.3: Create Auth Middleware

Create `backend/middleware/authMiddleware.js`:

```javascript
const jwt = require('jsonwebtoken');

// Middleware that checks for a valid JWT in the Authorization header
module.exports = function auth(req, res, next) {
  // Get token from header: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the same secret it was signed with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // decoded contains whatever payload we put in when creating the token
    next();
    // next() passes control to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

**🧠 Learn:**
- **Middleware** = a function that runs BEFORE your route handler. `(req, res, next)` signature.
- **`next()`** = "I'm done, pass to the next function in the chain"
- **JWT flow:** client sends `Authorization: Bearer <token>` → middleware extracts token → verifies
  signature → if valid, `req.user` is set and the route handler runs → if invalid, 401 error

### Step 9.4: Create Auth Route (Simple — Single Admin User)

For a personal photo dump site, you don't need user registration. Just a login endpoint
that gives you a token.

Create `backend/routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// For simplicity, we'll use env vars for the admin credentials
// In a real app, this would be a User model in the database
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// Generate this hash once (see Step 9.5) and put it in .env
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check username
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password against hash
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
      // Token expires in 7 days
    );

    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/verify — check if a token is still valid
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ valid: false });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.json({ valid: false });
  }
});

module.exports = router;
```

### Step 9.5: Generate Your Password Hash

Run this once in your terminal to generate a hash for your chosen password:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password_here', 10).then(h => console.log(h));"
```

Copy the output (starts with `$2a$`) and add to `backend/.env`:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$your_hash_here
```

### Step 9.6: Wire Auth Routes and Protect Upload Routes

Update `backend/server.js` to include auth routes:

```javascript
app.use('/api/dumps', require('./routes/dumps'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/auth', require('./routes/auth'));
```

Now add `auth` middleware to routes that need protection. Update `backend/routes/dumps.js` —
add the import and protect POST, PUT, DELETE:

```javascript
const auth = require('../middleware/authMiddleware');

// GET routes stay public (no auth)
router.get('/', async (req, res) => { /* ... */ });
router.get('/:slug', async (req, res) => { /* ... */ });

// These require auth
router.post('/', auth, async (req, res) => { /* ... */ });
router.put('/:id', auth, async (req, res) => { /* ... */ });
router.delete('/:id', auth, async (req, res) => { /* ... */ });
```

Do the same for `backend/routes/photos.js`:

```javascript
const auth = require('../middleware/authMiddleware');

router.post('/upload', auth, upload.array('photos', 20), async (req, res) => { /* ... */ });
router.put('/:id', auth, async (req, res) => { /* ... */ });
router.delete('/:id', auth, async (req, res) => { /* ... */ });
router.put('/reorder/:dumpId', auth, async (req, res) => { /* ... */ });
```

### Step 9.7: Test Auth Flow

1. **POST** `http://localhost:5000/api/photos/upload` without a token → should get 401
2. **POST** `http://localhost:5000/api/auth/login` with body `{"username": "admin", "password": "your_password"}` → should get a token
3. Copy the token. **POST** to upload again with header `Authorization: Bearer <token>` → should work

### Step 9.8: Update Frontend API Service

The `frontend/src/services/api.js` already has the interceptor. Token will be sent automatically
if it's in `localStorage`. You can add a simple login flow to the Upload page later, or
just set the token manually for now:

Open browser console on `localhost:5173` and run:
```javascript
localStorage.setItem('token', 'your_token_here');
```

Now upload requests will include the auth header automatically.

### Step 9.9: Commit

```bash
cd ..
git add .
git commit -m "Phase 9: JWT authentication with protected routes"
```

### ✅ Checkpoint 9
- [ ] Login endpoint returns a JWT token
- [ ] Protected routes return 401 without a token
- [ ] Protected routes work with a valid token
- [ ] GET routes (public pages) still work without auth
- [ ] You understand: JWT, bcrypt, middleware pattern, `next()`, `Authorization` header

---

---

## Phase 10 — Polish, Responsive Design & Deployment

### 🎯 Concept: Production readiness — responsive CSS, error boundaries, deployment

### Step 10.1: Add Loading and Error States Everywhere

Add these to `frontend/src/global.css`:

```css
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #f44;
  font-size: 1.1rem;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .navbar {
    padding: 0.75rem 1rem;
  }

  .navbar-links {
    gap: 1rem;
    font-size: 0.9rem;
  }

  .layout-content {
    padding: 1rem;
  }

  .home-hero h1 {
    font-size: 1.5rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
```

### Step 10.2: Add Vite Proxy (Cleaner Dev Experience)

Update `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**🧠 Learn:** With this proxy, you can change your API base URL to just `/api` instead of
`http://localhost:5000/api`. Vite's dev server forwards `/api/*` requests to Express.
This avoids CORS issues entirely in development.

Update `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // In dev, Vite proxy handles this
  // In production, set VITE_API_URL to your backend URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Step 10.3: Add Meta Tags for Social Sharing

Update `frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Monthly photo dumps — swipe through curated collections" />
    <meta property="og:title" content="Photo Dump" />
    <meta property="og:description" content="Monthly mobile photography" />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <title>Photo Dump</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 10.4: Deployment — Backend (Render)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables: `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`
6. Deploy

### Step 10.5: Deployment — Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable: `VITE_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com/api`)
5. Deploy

### Step 10.6: Final Commit

```bash
git add .
git commit -m "Phase 10: Polish, responsive design, deployment config"
git push origin main
```

### ✅ Checkpoint 10
- [ ] App looks good on mobile (test with Chrome DevTools responsive mode)
- [ ] Loading states show while data fetches
- [ ] Error states show when something fails
- [ ] Both backend and frontend are deployed and working
- [ ] The full flow works: create dump → upload photos → view in swiper

---

---

## 🎓 What You've Learned (Summary)

| Phase | Concept | You Can Now... |
|-------|---------|----------------|
| 0 | Tooling | Set up a dev environment, use Git |
| 1 | Express | Build a REST API from scratch |
| 2 | MongoDB | Design schemas, perform CRUD, use relationships |
| 3 | File Uploads | Handle multipart uploads, use cloud storage |
| 4 | React | Build components, manage state, use effects |
| 5 | Routing | Create SPAs with client-side navigation |
| 6 | Integration | Connect frontend to backend, handle async data |
| 7 | Libraries | Integrate and customize third-party packages |
| 8 | Forms | Build complex forms with drag-drop and previews |
| 9 | Auth | Implement JWT-based authentication |
| 10 | Deployment | Ship a full-stack app to the internet |

---

## 🚀 Stretch Goals (After You're Done)

Once you complete all 10 phases, pick from these to keep growing:

- [ ] **Login page UI** — build a proper login form that stores the JWT
- [ ] **Drag-to-reorder** — use `@dnd-kit/core` to reorder photos in a dump
- [ ] **EXIF data extraction** — auto-fill camera/date from photo metadata
- [ ] **Cloudinary transformations** — responsive `srcSet` with multiple sizes
- [ ] **Blur-up loading** — tiny blurred placeholder while full image loads
- [ ] **PWA** — add `manifest.json` + service worker for mobile home screen install
- [ ] **Share links** — deep link to specific photo: `/dump/feb-2026?photo=3`
- [ ] **Dark/light toggle** — switch between themes
- [ ] **TypeScript migration** — convert JS to TS for type safety
- [ ] **Testing** — add Jest + React Testing Library tests

---

> **Rules for yourself:**
> 1. Type every line. No copy-paste from this README.
> 2. If something breaks, debug it before moving on. That's where real learning happens.
> 3. Google error messages. Read Stack Overflow answers. Read the actual docs.
> 4. Commit after every checkpoint. You can always go back.
> 5. Take breaks. Walk away when frustrated. Fresh eyes see bugs faster.
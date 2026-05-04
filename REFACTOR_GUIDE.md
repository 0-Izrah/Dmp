| Concept | Description |
|---------|-------------|
| **React Query** | Replacing manual `useState` and `useEffect` with professional data-fetching and caching. |
| **Modularization** | Breaking down a 300+ line "monolith" component into single-purpose, reusable parts. |
| **Detail Views** | Moving from "inline editing" to a dedicated page for managing a specific resource (adding/removing photos). |

---

## Phase 1 — Mastering State with React Query (Point 4)

### 🎯 Concept: Let a library handle loading, error, and caching states.

Currently, you manually track `loading`, `error`, and `dumps`. You also have to manually call `fetchDumps()` when something updates. React Query automates all of this.

### Step 1.1: Install React Query

Open your terminal, navigate to the **frontend** folder, and run:

```bash
cd frontend
npm install @tanstack/react-query
```

### Step 1.2: Set Up the Provider

Open `frontend/src/main.jsx` and wrap your app in the `QueryClientProvider`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './global.css';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### Step 1.3: Update your Custom Hook

Modify `frontend/src/hooks/useDumps.js` to use React Query. 

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch function
const fetchDumps = async () => {
    const res = await fetch('/api/dumps');
    if (!res.ok) throw new Error('Failed to fetch dumps');
    return res.json();
};

export function useDumps() {
    const queryClient = useQueryClient();

    // 1. Queries (Reading Data)
    const { data: dumps = [], isLoading, isError, error } = useQuery({
        queryKey: ['dumps'],
        queryFn: fetchDumps
    });

    // 2. Mutations (Writing Data - Example for Create)
    const createDump = useMutation({
        mutationFn: async (newDump) => {
            const res = await fetch('/api/dumps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDump)
            });
            return res.json();
        },
        onSuccess: () => {
            // Automatically refetch the dumps list when successful!
            queryClient.invalidateQueries(['dumps']); 
        }
    });

    return { 
        dumps, 
        loading: isLoading, 
        error, 
        createDump 
    };
}
```

**🧠 Learn:** 
- `useQuery` caches your data. If you navigate away and come back, it shows the cached version instantly while fetching updates in the background.
- `onSuccess: () => queryClient.invalidateQueries(['dumps'])` tells React Query: "The data has changed! Go fetch the new list automatically!"

---

## Phase 2 — Breaking Down the Monolith (Point 2)

### 🎯 Concept: Single Responsibility Principle. A component should do ONE thing well.

Instead of `ManageDumps.jsx` being 300 lines, we will split it into a family of components.

### Step 2.1: Create the Component Skeleton

Inside `frontend/src/components/Manage/`, create these files:
1. `DashboardStats.jsx`
2. `DumpList.jsx`
3. `DumpRow.jsx`
4. `DumpForm.jsx`

### Step 2.2: Implement DashboardStats.jsx

This file strictly handles displaying numbers. Pass `dumps` to it as a prop.

```javascript
export default function DashboardStats({ dumps }) {
    const total = dumps.length;
    const published = dumps.filter(d => d.isPublished).length;
    const drafts = total - published;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Total Dumps</h3>
                <p>{total}</p>
            </div>
            {/* Add cards for Published and Drafts */}
        </div>
    );
}
```

### Step 2.3: Implement DumpRow.jsx

This handles just ONE row of the table.

```javascript
import { useNavigate } from 'react-router-dom';

export default function DumpRow({ dump }) {
    const navigate = useNavigate();

    return (
        <tr className="dump-row">
            <td>{dump.title}</td>
            <td>{dump.isPublished ? 'Live' : 'Draft'}</td>
            <td className="actions">
                {/* Instead of inline editing, we navigate to the detail page! */}
                <button onClick={() => navigate(`/manage/dumps/${dump.slug}`)}>
                    Manage / Edit
                </button>
            </td>
        </tr>
    );
}
```

### Step 2.4: Clean up ManageDumps.jsx

Now, your main `ManageDumps.jsx` file becomes beautifully simple:

```javascript
import { useDumps } from '../hooks/useDumps';
import DashboardStats from '../components/Manage/DashboardStats';
import DumpList from '../components/Manage/DumpList';
import DumpForm from '../components/Manage/DumpForm';

export default function ManageDumps() {
    const { dumps, loading, error } = useDumps();

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div>Error loading data.</div>;

    return (
        <div className="manage-dashboard">
            <DashboardStats dumps={dumps} />
            
            <div className="manage-header">
                <h2>Your Dumps</h2>
                <DumpForm /> {/* A modal or slide-down form to create new dumps */}
            </div>

            <DumpList dumps={dumps} />
        </div>
    );
}
```

---

## Phase 3 — The Dedicated Dump Detail Page (Point 3)

### 🎯 Concept: Deep resource management requires dedicated space.

Inline editing is great for quick text changes, but terrible for uploading 50 photos. We need a specific page for a specific Dump.

### Step 3.1: Create ManageDumpDetail.jsx

Create `frontend/src/pages/ManageDumpDetail.jsx`:

```javascript
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UploadForm from '../components/Upload/UploadForm';

export default function ManageDumpDetail() {
    const { slug } = useParams();

    // Fetch this specific dump
    const { data: dump, isLoading } = useQuery({
        queryKey: ['dump', slug],
        queryFn: () => fetch(`/api/dumps/${slug}`).then(r => r.json())
    });

    if (isLoading) return <div>Loading dump details...</div>;

    return (
        <div className="manage-detail-page">
            <header className="detail-header">
                <h1>Editing: {dump.title}</h1>
                {/* Form to update title, date, etc. goes here */}
            </header>

            <section className="photo-management">
                <h2>Photos</h2>
                
                {/* Dropzone for new photos */}
                <div className="upload-zone">
                    <UploadForm dumpId={dump._id} /> 
                </div>

                {/* Grid of existing photos to delete/reorder */}
                <div className="photo-grid">
                    {dump.photos.map(photo => (
                        <div key={photo._id} className="photo-card">
                            <img src={photo.url} alt="" />
                            <button className="delete-btn">Delete</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
```

### Step 3.2: Wire it into App.jsx

Open `frontend/src/App.jsx` and add the new route:

```javascript
import ManageDumpDetail from './pages/ManageDumpDetail';

// Inside your <Routes>
<Route path="/manage/dumps/:slug" element={<ManageDumpDetail />} />
```

### ✅ Checkpoint
- [ ] You have installed `@tanstack/react-query` and set up the Provider.
- [ ] You understand how `ManageDumps.jsx` delegates rendering to `DashboardStats` and `DumpRow`.
- [ ] You can navigate from the table to `/manage/dumps/:slug` to see the dedicated photo uploader interface.

---

## Phase 4 — Implementing the UI Details

### 🎯 Concept: Fleshing out the placeholders to make the app fully functional.

Now we will replace the placeholders (the comments) we left in our components during Phase 2 and 3.

### Step 4.1: Complete DashboardStats.jsx

Open `frontend/src/components/Manage/DashboardStats.jsx` and replace the placeholder comment with actual cards:

```javascript
export default function DashboardStats({ dumps = [] }) {
    const total = dumps.length;
    const published = dumps.filter(d => d.isPublished).length;
    const drafts = total - published;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Total Dumps</h3>
                <p>{total}</p>
            </div>
            <div className="stat-card">
                <h3>Published</h3>
                <p>{published}</p>
            </div>
            <div className="stat-card">
                <h3>Drafts</h3>
                <p>{drafts}</p>
            </div>
        </div>
    );
}
```

### Step 4.2: Build the DumpForm.jsx (Slide-down/Toggle form)

We need a form to create a dump in `ManageDumps.jsx`. Let's make it a simple toggleable form. Open `frontend/src/components/Manage/DumpForm.jsx`:

```javascript
import { useState } from 'react';
import { useDumps } from '../../hooks/useDumps';

export default function DumpForm() {
    const [isOpen, setIsOpen] = useState(false);
    const { createDump } = useDumps();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newDump = {
            title: formData.get('title'),
            month: Number(formData.get('month')),
            year: Number(formData.get('year')),
        };

        // Trigger the React Query mutation
        createDump.mutate(newDump, {
            onSuccess: () => {
                setIsOpen(false); // Close form on success
                e.target.reset(); // Clear input fields
            }
        });
    };

    if (!isOpen) {
        return <button className="btn-primary" onClick={() => setIsOpen(true)}>+ Create New Dump</button>;
    }

    return (
        <div className="dump-form-container">
            <form onSubmit={handleSubmit} className="dump-form card-style">
                <h3>Create a New Dump</h3>
                
                <div className="form-group">
                    <label>Title</label>
                    <input name="title" placeholder="e.g., Summer Memories" required />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Month</label>
                        <input name="month" type="number" placeholder="1-12" min="1" max="12" required />
                    </div>
                    <div className="form-group">
                        <label>Year</label>
                        <input name="year" type="number" placeholder="e.g., 2026" required />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="submit" disabled={createDump.isPending} className="btn-success">
                        {createDump.isPending ? 'Creating...' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
```

### Step 4.3: Add the Edit Form to ManageDumpDetail.jsx

First, we need to add an `updateDump` mutation to our `useDumps` hook.
Open `frontend/src/hooks/useDumps.js` and add this mutation below `createDump`:

```javascript
    const updateDump = useMutation({
        mutationFn: async ({ id, updates }) => {
            const res = await fetch(`/api/dumps/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to update');
            return res.json();
        },
        onSuccess: (updatedDump) => {
            queryClient.invalidateQueries(['dumps']);
            queryClient.invalidateQueries(['dump', updatedDump.slug]);
        }
    });

    // Make sure to return it at the bottom:
    // return { dumps, loading: isLoading, error, createDump, updateDump };
```

Now, open `frontend/src/pages/ManageDumpDetail.jsx`. Replace `{/* Form to update title, date, etc. goes here */}` with an actual edit form:

```javascript
    import { useDumps } from '../hooks/useDumps'; // Add this import at the top

    // Inside ManageDumpDetail component, after the useQuery fetch:
    const { updateDump } = useDumps();

    const handleUpdateMetadata = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        updateDump.mutate({
            id: dump._id,
            updates: {
                title: formData.get('title'),
                isPublished: formData.get('isPublished') === 'on' 
            }
        });
    };

    // Replace the header with this form:
    <header className="detail-header card-style">
        <form onSubmit={handleUpdateMetadata} className="metadata-form">
            <div className="form-group">
                <label>Title</label>
                <input name="title" defaultValue={dump.title} required />
            </div>
            
            <div className="form-group checkbox-group">
                <label>
                    <input 
                        type="checkbox" 
                        name="isPublished" 
                        defaultChecked={dump.isPublished} 
                    />
                    Published to Public Gallery
                </label>
            </div>

            <button type="submit" disabled={updateDump.isPending}>
                {updateDump.isPending ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    </header>
```

### ✅ Checkpoint 4
- [ ] Your dashboard stats now accurately reflect Total, Drafts, and Published counts.
- [ ] You can toggle the "Create New Dump" form and successfully create a new record.
- [ ] You can edit the dump's title and publish status on the dump details page.
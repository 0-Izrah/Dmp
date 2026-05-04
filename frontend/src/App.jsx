import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import DumpView from './pages/DumpView';
import Archive from './pages/Archive';
import Upload from './pages/Upload';
import Room from './pages/Room';
import MyRooms from './pages/MyRooms';
import ManageDumps from './pages/ManageDumps';
import ManageDumpDetail from './pages/ManageDumpDetail';
import Login from './pages/Login';
import './components/Layout/Layout.css';
import './pages/pages.css';

function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/room/:code" element={<Room />} />
        <Route path="/my-rooms" element={<MyRooms />} />
        <Route path="/manage" element={<ManageDumps />} />
        <Route path="/manage/dumps/:slug" element={<ManageDumpDetail />} />
        <Route path="/dump/:slug" element={<DumpView />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

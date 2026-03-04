import { BrowserRouter ,Routes , Route , Outlet  } from "react-router-dom";
import {Navbar , Footer } from "./components/Layout";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Upload from "./pages/Upload";
import DumpView from "./pages/DumpView";
import './components/Layout/Layout.css'
import './pages/pages.css'

function Layout() {
  return (
    <>
      <Navbar/>
      <main className="layout-content">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dump/:slug" element={<DumpView />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

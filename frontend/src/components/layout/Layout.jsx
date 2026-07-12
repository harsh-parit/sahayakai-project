import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Root layout — wraps every page with Navbar + Footer.
 * Scrolls to top on each route change.
 */
export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <Navbar />
      {/* pt-16 accounts for the fixed navbar height */}
      <main className="flex-1 pt-16" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

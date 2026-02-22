import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Shield } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(99,130,255,0.12)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '14px 0',
    }}>
      <div className="container flex-between">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--accent-glow)'
          }}>
            <BookOpen size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>EduVault</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -2 }}>CSE Question Bank</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="flex-center gap-4" style={{ display: 'flex' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', gap: 8 }}>
            <Search size={15} color="var(--text2)" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search questions..."
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '0.85rem', width: 200, fontFamily: 'var(--font-body)' }}
            />
          </form>

          <Link to="/" className="btn btn-ghost btn-sm">Home</Link>
          <Link to="/subjects" className="btn btn-ghost btn-sm">Subjects</Link>
          <Link to="/practice" className="btn btn-ghost btn-sm">Practice</Link>
          <Link to="/admin/login" className="btn btn-secondary btn-sm flex-center gap-2">
            <Shield size={13} /> Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, FileText, Brain, Book, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/questions', label: 'Questions', icon: FileText },
  { path: '/admin/practice', label: 'Practice Q.', icon: Brain },
  { path: '/admin/subjects', label: 'Subjects', icon: Book },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={16} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem' }}>EduVault</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--pink))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>
          {admin?.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{admin?.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{admin?.email}</div>
        <div style={{ marginTop: 4 }}>
          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Admin</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                color: isActive ? 'var(--text)' : 'var(--text2)',
                background: isActive ? 'var(--surface)' : 'transparent',
                border: isActive ? '1px solid var(--border2)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={16} color={isActive ? 'var(--accent2)' : 'currentColor'} />
                {label}
              </div>
              {isActive && <ChevronRight size={14} color="var(--accent2)" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', color: 'var(--text2)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 4 }}>
          <BookOpen size={15} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '0.85rem', width: '100%', borderRadius: 8 }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

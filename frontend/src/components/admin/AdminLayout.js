import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '40px 36px', minHeight: '100vh', background: 'var(--bg)' }}>
        {(title || subtitle) && (
          <div style={{ marginBottom: 32 }}>
            {title && <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>{title}</h1>}
            {subtitle && <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

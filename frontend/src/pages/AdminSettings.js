import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Shield, Lock, User } from 'lucide-react';

const AdminSettings = () => {
  const { admin } = useAuth();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage your admin account">
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Profile info */}
        <div className="card">
          <div className="flex-center gap-3" style={{ marginBottom: 20 }}>
            <User size={18} color="var(--accent2)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Account Info</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="form-label">Name</label>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: '0.875rem', color: 'var(--text)', marginTop: 6 }}>{admin?.name}</div>
            </div>
            <div>
              <label className="form-label">Email</label>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: '0.875rem', color: 'var(--text)', marginTop: 6 }}>{admin?.email}</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="form-label">Role</label>
            <div style={{ marginTop: 6 }}>
              <span className="badge badge-accent"><Shield size={11} /> Admin</span>
            </div>
          </div>
          {admin?.lastLogin && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 12 }}>Last login: {new Date(admin.lastLogin).toLocaleString()}</p>
          )}
        </div>

        {/* Change password */}
        <div className="card">
          <div className="flex-center gap-3" style={{ marginBottom: 20 }}>
            <Lock size={18} color="var(--accent2)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Change Password</h3>
          </div>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
              <div className="form-group" key={field}>
                <label className="form-label">{field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}</label>
                <input type="password" className="form-input" value={passwords[field]} onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))} placeholder="••••••••" required minLength={field !== 'currentPassword' ? 8 : 1} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }} disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

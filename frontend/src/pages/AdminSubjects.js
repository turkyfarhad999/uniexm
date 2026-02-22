import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import SubjectCard from '../components/shared/SubjectCard';
import AdminLayout from '../components/admin/AdminLayout';
import { subjectsAPI } from '../utils/api';
import toast from 'react-hot-toast';

// ============ Public Subjects Page ============
export const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sem, setSem] = useState('all');

  useEffect(() => {
    const params = sem !== 'all' ? { semester: sem } : {};
    subjectsAPI.getAll(params).then(({ data }) => {
      if (data.success) setSubjects(data.data);
    }).finally(() => setLoading(false));
  }, [sem]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>All Subjects</h1>
            <p style={{ color: 'var(--text2)' }}>Browse questions organized by subject</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {[['all', 'All Semesters'], ['1', 'Semester 1'], ['2', 'Semester 2']].map(([val, label]) => (
                <button key={val} onClick={() => setSem(val)} style={{
                  padding: '7px 16px', borderRadius: 100, border: '1px solid',
                  borderColor: sem === val ? 'var(--accent)' : 'var(--border)',
                  background: sem === val ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: sem === val ? 'var(--accent2)' : 'var(--text2)',
                  cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)'
                }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="container" style={{ padding: '40px 24px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {subjects.map(s => <SubjectCard key={s._id} subject={s} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ Admin Subject Form ============
export const SubjectForm = ({ editId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', semester: 1, description: '', icon: '📚', color: '#6366f1', isActive: true,
    syllabus: ''
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (editId) {
      subjectsAPI.getByCode(editId).then(({ data }) => {
        if (data.success) setForm({ ...data.data, syllabus: (data.data.syllabus || []).join(', ') });
      });
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, syllabus: form.syllabus.split(',').map(t => t.trim()).filter(Boolean) };
      if (editId) {
        const s = await subjectsAPI.getByCode(editId);
        await subjectsAPI.update(s.data.data._id, payload);
        toast.success('Subject updated');
      } else {
        await subjectsAPI.create(payload);
        toast.success('Subject created');
      }
      navigate('/admin/subjects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const ICONS = ['📚', '🌲', '⚙️', '⚡', '∑', '🔭', '💻', '🧪', '🔢', '🎯'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <AdminLayout title={editId ? 'Edit Subject' : 'Add Subject'}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subject Name *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Data Structures & Algorithms" required />
            </div>
            <div className="form-group">
              <label className="form-label">Subject Code *</label>
              <input className="form-input" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="DSA" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description..." />
          </div>

          <div className="form-group">
            <label className="form-label">Semester *</label>
            <select className="form-select" value={form.semester} onChange={e => set('semester', parseInt(e.target.value))}>
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => set('icon', icon)} style={{
                  width: 40, height: 40, fontSize: 20, background: form.icon === icon ? 'var(--surface2)' : 'var(--bg)',
                  border: `1px solid ${form.icon === icon ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer'
                }}>{icon}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(color => (
                <button key={color} type="button" onClick={() => set('color', color)} style={{
                  width: 28, height: 28, background: color, borderRadius: '50%', border: `2px solid ${form.color === color ? 'white' : 'transparent'}`, cursor: 'pointer',
                  outline: form.color === color ? `2px solid ${color}` : 'none', outlineOffset: 2
                }} />
              ))}
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 28, height: 28, border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'none', padding: 0 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Syllabus Topics (comma separated)</label>
            <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.syllabus} onChange={e => set('syllabus', e.target.value)} placeholder="Arrays, Linked Lists, Trees, Graphs..." />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : editId ? 'Update Subject' : 'Create Subject'}</button>
            <Link to="/admin/subjects" className="btn btn-secondary">Cancel</Link>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

// ============ Admin Subjects List ============
const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = () => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this subject?')) return;
    await subjectsAPI.delete(id);
    toast.success('Subject deactivated');
    fetchSubjects();
  };

  return (
    <AdminLayout title="Subjects" subtitle="Manage department subjects">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{subjects.length} active subjects</span>
        <Link to="/admin/subjects/new" className="btn btn-primary"><Plus size={15} /> Add Subject</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {loading ? <div className="spinner" /> : subjects.map(s => (
          <div key={s._id} className="card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: '0.72rem', color: s.color, fontWeight: 700, textTransform: 'uppercase' }}>{s.code} · Sem {s.semester}</div>
                </div>
              </div>
              <div className="flex-center gap-2">
                <Link to={`/admin/subjects/edit/${s.code}`} className="btn btn-ghost btn-sm" style={{ padding: '5px 8px' }}><Edit2 size={13} /></Link>
                <button onClick={() => handleDelete(s._id)} className="btn btn-danger btn-sm" style={{ padding: '5px 8px' }}><Trash2 size={13} /></button>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 12 }}>{s.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(s.syllabus || []).slice(0, 3).map(topic => (
                <span key={topic} style={{ fontSize: '0.7rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px', color: 'var(--text2)' }}>{topic}</span>
              ))}
              {(s.syllabus || []).length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>+{s.syllabus.length - 3} more</span>}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminSubjects;

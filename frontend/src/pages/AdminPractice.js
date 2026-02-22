import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { practiceAPI, subjectsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TYPES = ['MCQ', 'SHORT', 'LONG', 'PROBLEM'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

// ============ Practice Form ============
export const PracticeForm = ({ editId }) => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: '', type: 'MCQ', questionText: '', topic: '', difficulty: 'medium',
    marks: 5, tags: '', correctAnswer: '', explanation: '', isPublished: true,
    options: [{ label: 'A', text: '' }, { label: 'B', text: '' }, { label: 'C', text: '' }, { label: 'D', text: '' }]
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.data || []));
    if (editId) {
      practiceAPI.getAll().then(({ data }) => {
        const q = data.data?.find(q => q._id === editId);
        if (q) setForm({ ...q, subject: q.subject?._id || q.subject, tags: (q.tags || []).join(', ') });
      });
    }
  }, [editId]);

  const updateOption = (idx, text) => {
    const opts = [...form.options];
    opts[idx] = { ...opts[idx], text };
    set('options', opts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      if (payload.type !== 'MCQ') delete payload.options;

      if (editId) {
        await practiceAPI.update(editId, payload);
        toast.success('Updated!');
      } else {
        await practiceAPI.create(payload);
        toast.success('Practice question added!');
      }
      navigate('/admin/practice');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={editId ? 'Edit Practice Question' : 'Add Practice Question'}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 20 }}>Question</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Question Text *</label>
                  <textarea className="form-textarea" value={form.questionText} onChange={e => set('questionText', e.target.value)} required placeholder="Enter the practice question..." />
                </div>

                {/* MCQ Options */}
                {form.type === 'MCQ' && (
                  <div>
                    <label className="form-label" style={{ marginBottom: 10, display: 'block' }}>Options</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {form.options.map((opt, idx) => (
                        <div key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ width: 24, height: 24, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, flexShrink: 0 }}>{opt.label}</span>
                          <input className="form-input" value={opt.text} onChange={e => updateOption(idx, e.target.value)} placeholder={`Option ${opt.label}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Correct Answer *</label>
                  {form.type === 'MCQ' ? (
                    <select className="form-select" value={form.correctAnswer} onChange={e => set('correctAnswer', e.target.value)} required>
                      <option value="">Select correct option</option>
                      {form.options.map(o => <option key={o.label} value={o.label}>Option {o.label}</option>)}
                    </select>
                  ) : (
                    <textarea className="form-textarea" value={form.correctAnswer} onChange={e => set('correctAnswer', e.target.value)} placeholder="Model answer or key points..." />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Explanation (shown after reveal)</label>
                  <textarea className="form-textarea" style={{ minHeight: 70 }} value={form.explanation} onChange={e => set('explanation', e.target.value)} placeholder="Why is this the answer?" />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)} required>
                    <option value="">Select...</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.icon} {s.code}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <input className="form-input" value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="e.g. Binary Trees" />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input className="form-input" type="number" value={form.marks} onChange={e => set('marks', parseInt(e.target.value))} min="1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="tag1, tag2" />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? 'Saving...' : editId ? 'Update' : 'Add Question'}
            </button>
            <Link to="/admin/practice" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>Cancel</Link>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

// ============ Practice List ============
const AdminPractice = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subject: '', type: '' });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await practiceAPI.getAll({ ...filters, limit: 50 });
      setQuestions(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.data || []));
  }, []);

  useEffect(() => { fetchQuestions(); }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this practice question?')) return;
    await practiceAPI.delete(id);
    toast.success('Deleted');
    fetchQuestions();
  };

  const typeColors = { MCQ: 'var(--accent2)', SHORT: 'var(--green)', LONG: 'var(--yellow)', PROBLEM: 'var(--pink)' };

  return (
    <AdminLayout title="Practice Questions" subtitle="Manage practice and MCQ questions">
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="flex-center gap-3">
          <select className="form-select" style={{ width: 'auto' }} value={filters.subject} onChange={e => setFilters(p => ({ ...p, subject: e.target.value }))}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s.code}>{s.code}</option>)}
          </select>
          <select className="form-select" style={{ width: 'auto' }} value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}>
            <option value="">All Types</option>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <Link to="/admin/practice/new" className="btn btn-primary"><Plus size={15} /> Add Practice Q.</Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Question', 'Subject', 'Type', 'Difficulty', 'Marks', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
            ) : questions.map(q => (
              <tr key={q._id} style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                  <p className="truncate" style={{ fontSize: '0.85rem' }}>{q.questionText}</p>
                  {q.topic && <p style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 2 }}>{q.topic}</p>}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: q.subject?.color || 'var(--accent2)', fontWeight: 600 }}>{q.subject?.code}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: `${typeColors[q.type]}18`, color: typeColors[q.type], border: `1px solid ${typeColors[q.type]}30`, borderRadius: 100, padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{q.type}</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text2)', textTransform: 'capitalize' }}>{q.difficulty}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text2)' }}>{q.marks}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div className="flex-center gap-2">
                    <Link to={`/admin/practice/edit/${q._id}`} className="btn btn-ghost btn-sm" style={{ padding: '5px 8px' }}><Edit2 size={13} /></Link>
                    <button onClick={() => handleDelete(q._id)} className="btn btn-danger btn-sm" style={{ padding: '5px 8px' }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminPractice;

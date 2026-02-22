import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Upload, X } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { questionsAPI, subjectsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const EXAM_TYPES = ['CT1', 'CT2', 'CT3', 'FINAL'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

// ============ Question Form ============
export const QuestionForm = ({ editId }) => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [form, setForm] = useState({
    subject: '', examType: 'CT1', year: new Date().getFullYear(), semester: 1,
    questionNumber: '', questionText: '', marks: '', difficulty: 'medium', tags: '',
    isPublished: true
  });

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.data || []));
    if (editId) {
      questionsAPI.getById(editId).then(({ data }) => {
        if (data.success) {
          const q = data.data;
          setForm({ ...q, subject: q.subject?._id || q.subject, tags: (q.tags || []).join(', ') });
        }
      });
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
      });
      if (pdfFile) fd.append('pdfFile', pdfFile);

      if (editId) {
        await questionsAPI.update(editId, fd);
        toast.success('Question updated!');
      } else {
        await questionsAPI.create(fd);
        toast.success('Question added!');
      }
      navigate('/admin/questions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving question');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <AdminLayout title={editId ? 'Edit Question' : 'Add New Question'} subtitle="Fill in the question details below">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 20 }}>Question Content</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Question Text *</label>
                  <textarea className="form-textarea" style={{ minHeight: 150 }} value={form.questionText} onChange={e => set('questionText', e.target.value)} placeholder="Enter the full question here..." required />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Question Number</label>
                    <input className="form-input" value={form.questionNumber} onChange={e => set('questionNumber', e.target.value)} placeholder="e.g., Q1, Q2(a)" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Marks</label>
                    <input className="form-input" type="number" value={form.marks} onChange={e => set('marks', e.target.value)} placeholder="10" min="1" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="sorting, binary tree, complexity" />
                </div>
              </div>
            </div>

            {/* PDF upload */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>PDF Attachment (Optional)</h3>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '32px', border: '2px dashed var(--border)', borderRadius: 8, cursor: 'pointer',
                background: pdfFile ? 'rgba(16,185,129,0.05)' : 'transparent',
                borderColor: pdfFile ? 'var(--green)' : 'var(--border)',
              }}>
                <Upload size={24} color={pdfFile ? 'var(--green)' : 'var(--text2)'} />
                <span style={{ fontSize: '0.85rem', color: pdfFile ? 'var(--green)' : 'var(--text2)' }}>
                  {pdfFile ? pdfFile.name : 'Click to upload PDF (max 10MB)'}
                </span>
                <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ display: 'none' }} />
              </label>
              {pdfFile && (
                <button type="button" onClick={() => setPdfFile(null)} className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>
                  <X size={12} /> Remove file
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>Categorization</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)} required>
                    <option value="">Select subject...</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.icon} {s.code} — {s.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Exam Type *</label>
                  <select className="form-select" value={form.examType} onChange={e => set('examType', e.target.value)} required>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select className="form-select" value={form.semester} onChange={e => set('semester', parseInt(e.target.value))} required>
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <input className="form-input" type="number" value={form.year} onChange={e => set('year', parseInt(e.target.value))} min="2010" max={new Date().getFullYear() + 1} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                    {DIFFICULTIES.map(d => <option key={d} value={d} style={{ textTransform: 'capitalize' }}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>Publishing</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                <span style={{ fontSize: '0.875rem' }}>Publish immediately</span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center' }}>
                {loading ? 'Saving...' : editId ? 'Update Question' : 'Add Question'}
              </button>
              <Link to="/admin/questions" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

// ============ Questions List ============
const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ subject: '', examType: '', page: 1 });
  const [subjects, setSubjects] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 20 };
      if (search) params.search = search;
      const { data } = await questionsAPI.getAll(params);
      setQuestions(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.data || []));
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleDelete = async (id, text) => {
    if (!window.confirm(`Delete question: "${text.substring(0, 60)}..."?`)) return;
    try {
      await questionsAPI.delete(id);
      toast.success('Question deleted');
      fetchQuestions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const typeColors = { CT1: '#6366f1', CT2: '#14b8a6', CT3: '#ec4899', FINAL: '#f59e0b' };

  return (
    <AdminLayout title="Questions" subtitle="Manage all exam questions">
      {/* Controls */}
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="flex-center gap-3" style={{ flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
            <Search size={14} color="var(--text2)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '0.875rem', width: 200 }} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={filters.subject} onChange={e => setFilters(p => ({ ...p, subject: e.target.value, page: 1 }))}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s.code}>{s.code}</option>)}
          </select>
          <select className="form-select" style={{ width: 'auto' }} value={filters.examType} onChange={e => setFilters(p => ({ ...p, examType: e.target.value, page: 1 }))}>
            <option value="">All Types</option>
            {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <Link to="/admin/questions/new" className="btn btn-primary">
          <Plus size={15} /> Add Question
        </Link>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Question', 'Subject', 'Type', 'Year', 'Marks', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : questions.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>No questions found</td></tr>
              ) : questions.map(q => (
                <tr key={q._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', maxWidth: 300 }}>
                    <p className="truncate" style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{q.questionText}</p>
                    {q.tags?.length > 0 && <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>{q.tags.slice(0, 2).map(t => <span key={t} style={{ fontSize: '0.68rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', color: 'var(--text2)' }}>{t}</span>)}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: q.subject?.color || 'var(--accent2)' }}>{q.subject?.code || '—'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: `${typeColors[q.examType]}18`, color: typeColors[q.examType] || 'var(--text2)', border: `1px solid ${typeColors[q.examType]}30`, borderRadius: 100, padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{q.examType}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text2)' }}>{q.year}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text2)' }}>{q.marks || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: q.isPublished ? 'var(--green)' : 'var(--text2)', background: q.isPublished ? 'rgba(16,185,129,0.12)' : 'var(--bg)', border: `1px solid ${q.isPublished ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: 100, padding: '3px 8px' }}>{q.isPublished ? 'Published' : 'Draft'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex-center gap-2">
                      <Link to={`/admin/questions/edit/${q._id}`} className="btn btn-ghost btn-sm" style={{ padding: '5px 8px' }}><Edit2 size={13} /></Link>
                      <button onClick={() => handleDelete(q._id, q.questionText)} className="btn btn-danger btn-sm" style={{ padding: '5px 8px' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex-between" style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Total: {pagination.total} questions</span>
            <div className="flex-center gap-2">
              <button onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className="btn btn-secondary btn-sm">Prev</button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Page {pagination.page} of {pagination.pages}</span>
              <button onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.pages} className="btn btn-secondary btn-sm">Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuestions;

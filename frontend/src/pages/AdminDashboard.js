import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Brain, Book, TrendingUp, Plus, Eye, Clock } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { statsAPI } from '../utils/api';

const StatCard = ({ title, value, icon, color, sub }) => (
  <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
    <div className="flex-between" style={{ marginBottom: 12 }}>
      <span style={{ fontSize: '0.78rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{title}</span>
      <div style={{ width: 36, height: 36, background: `${color}18`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
    {sub && <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: 4 }}>{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.getDashboard().then(({ data }) => {
      if (data.success) setStats(data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const typeColorMap = { CT1: '#6366f1', CT2: '#14b8a6', CT3: '#ec4899', FINAL: '#f59e0b' };

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back. Here's an overview of the question bank.">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div className="spinner" />
        </div>
      ) : stats && (
        <>
          {/* Stats row */}
          <div className="grid-4" style={{ marginBottom: 32 }}>
            <StatCard title="Total Questions" value={stats.totalQuestions} icon={<FileText size={18} />} color="var(--accent)" sub="Published exam questions" />
            <StatCard title="Practice Questions" value={stats.totalPractice} icon={<Brain size={18} />} color="var(--green)" sub="MCQ + short answer" />
            <StatCard title="Active Subjects" value={stats.totalSubjects} icon={<Book size={18} />} color="var(--yellow)" sub="Across Sem 1 & 2" />
            <StatCard title="Question Views" value={stats.recentQuestions.reduce((a, q) => a + (q.viewCount || 0), 0)} icon={<Eye size={18} />} color="var(--pink)" sub="Total student views" />
          </div>

          {/* Middle row */}
          <div className="grid-2" style={{ marginBottom: 32 }}>
            {/* By exam type */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>Questions by Exam Type</h3>
              {stats.questionsByType.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ width: 48, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: typeColorMap[item._id] || 'var(--accent2)', fontWeight: 700 }}>{item._id}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: typeColorMap[item._id] || 'var(--accent)', borderRadius: 3, width: `${Math.min(100, (item.count / Math.max(...stats.questionsByType.map(i => i.count))) * 100)}%`, transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, minWidth: 24, textAlign: 'right' }}>{item.count}</span>
                </div>
              ))}
            </div>

            {/* By subject */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>Questions by Subject</h3>
              {stats.questionsBySubject.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ width: 52, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent2)', fontWeight: 700 }}>{item.code}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 3, width: `${Math.min(100, (item.count / Math.max(...stats.questionsBySubject.map(i => i.count))) * 100)}%`, transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, minWidth: 24, textAlign: 'right' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent + quick actions */}
          <div className="grid-2">
            {/* Recent questions */}
            <div className="card">
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>Recent Questions</h3>
                <Link to="/admin/questions" style={{ fontSize: '0.78rem', color: 'var(--accent2)' }}>View all →</Link>
              </div>
              {stats.recentQuestions.map(q => (
                <div key={q._id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: q.subject?.color || 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.questionText}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{q.subject?.code}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{q.examType}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { to: '/admin/questions/new', label: 'Add New Question', icon: <Plus size={16} />, color: 'var(--accent)' },
                  { to: '/admin/practice/new', label: 'Add Practice Question', icon: <Brain size={16} />, color: 'var(--green)' },
                  { to: '/admin/subjects/new', label: 'Add Subject', icon: <Book size={16} />, color: 'var(--yellow)' },
                  { to: '/admin/questions', label: 'Manage Questions', icon: <FileText size={16} />, color: 'var(--text2)' },
                ].map(({ to, label, icon, color }) => (
                  <Link key={to} to={to} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 8, color: 'var(--text)', textDecoration: 'none', fontSize: '0.875rem',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}>
                    <span style={{ color }}>{icon}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;

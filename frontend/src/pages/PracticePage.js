import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Zap, BookOpen, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import { practiceAPI, subjectsAPI } from '../utils/api';

const PracticePage = () => {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subject: initialSubject, type: '', difficulty: '' });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('browse'); // browse | quiz
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => setSubjects(data.data || []));
    fetchQuestions();
  }, []);

  const fetchQuestions = async (overrideFilters) => {
    setLoading(true);
    const f = overrideFilters || filters;
    try {
      const params = { limit: 30 };
      if (f.subject) params.subject = f.subject;
      if (f.type) params.type = f.type;
      if (f.difficulty) params.difficulty = f.difficulty;
      const { data } = await practiceAPI.getAll(params);
      setQuestions(data.data || []);
      setAnswers({});
      setRevealed({});
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (id) => {
    if (revealed[id]) return;
    const { data } = await practiceAPI.getAnswer(id);
    setRevealed(p => ({ ...p, [id]: data.data }));
  };

  const handleFilter = (key, val) => {
    const newFilters = { ...filters, [key]: val };
    setFilters(newFilters);
    fetchQuestions(newFilters);
  };

  const typeColors = { MCQ: '#6366f1', SHORT: '#10b981', LONG: '#f59e0b', PROBLEM: '#ec4899' };
  const diffColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        {/* Hero */}
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
          <div className="container">
            <div className="flex-center gap-3" style={{ marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent2)' }}>
                <Zap size={22} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>Practice Mode</h1>
                <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>MCQs, short answers, and problem-solving questions</p>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <select className="form-select" style={{ width: 'auto' }} value={filters.subject} onChange={e => handleFilter('subject', e.target.value)}>
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s._id} value={s.code}>{s.icon} {s.code}</option>)}
              </select>
              <select className="form-select" style={{ width: 'auto' }} value={filters.type} onChange={e => handleFilter('type', e.target.value)}>
                <option value="">All Types</option>
                {['MCQ', 'SHORT', 'LONG', 'PROBLEM'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="form-select" style={{ width: 'auto' }} value={filters.difficulty} onChange={e => handleFilter('difficulty', e.target.value)}>
                <option value="">All Levels</option>
                {['easy', 'medium', 'hard'].map(d => <option key={d} style={{ textTransform: 'capitalize' }}>{d}</option>)}
              </select>
              <button onClick={() => fetchQuestions()} className="btn btn-secondary btn-sm">
                <RefreshCw size={13} /> Shuffle
              </button>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="container" style={{ padding: '32px 24px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
          ) : questions.length === 0 ? (
            <div className="empty-state">
              <Zap size={48} />
              <p style={{ marginTop: 12 }}>No practice questions found</p>
              <p className="text-sm text-muted" style={{ marginTop: 6 }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: 20 }}>{questions.length} questions loaded</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {questions.map((q, idx) => {
                  const rev = revealed[q._id];
                  const sel = answers[q._id];
                  const isCorrect = rev && sel === rev.correctAnswer;

                  return (
                    <div key={q._id} className="card" style={{ borderLeft: `3px solid ${typeColors[q.type] || 'var(--accent)'}` }}>
                      {/* Header */}
                      <div className="flex-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                        <div className="flex-center gap-2">
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text3)', minWidth: 28 }}>#{idx + 1}</span>
                          <span style={{ background: `${typeColors[q.type]}18`, color: typeColors[q.type], border: `1px solid ${typeColors[q.type]}30`, borderRadius: 100, padding: '3px 9px', fontSize: '0.72rem', fontWeight: 700 }}>{q.type}</span>
                          {q.topic && <span style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>{q.topic}</span>}
                          <span style={{ color: diffColors[q.difficulty], fontSize: '0.75rem' }}>● {q.difficulty}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text2)' }}>{q.marks} marks</span>
                      </div>

                      <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>{q.questionText}</p>

                      {/* MCQ Options */}
                      {q.type === 'MCQ' && q.options && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
                          {q.options.map(opt => {
                            const isSelectedOpt = sel === opt.label;
                            const isCorrectOpt = rev && rev.correctAnswer === opt.label;
                            return (
                              <button key={opt.label} onClick={() => !rev && setAnswers(p => ({ ...p, [q._id]: opt.label }))} style={{
                                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                                background: isCorrectOpt ? 'rgba(16,185,129,0.15)' : isSelectedOpt && !rev ? 'rgba(99,102,241,0.15)' : isSelectedOpt && rev && !isCorrectOpt ? 'rgba(239,68,68,0.1)' : 'var(--bg)',
                                border: `1px solid ${isCorrectOpt ? 'var(--green)' : isSelectedOpt && !rev ? 'var(--accent)' : 'var(--border)'}`,
                                borderRadius: 8, cursor: rev ? 'default' : 'pointer',
                                color: isCorrectOpt ? 'var(--green)' : 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', textAlign: 'left'
                              }}>
                                {isCorrectOpt && rev ? <CheckCircle size={14} color="var(--green)" /> : isSelectedOpt && rev && !isCorrectOpt ? <XCircle size={14} color="var(--red)" /> : (
                                  <span style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${isSelectedOpt ? 'var(--accent)' : 'var(--border)'}`, flexShrink: 0 }} />
                                )}
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text2)', minWidth: 14 }}>{opt.label}.</span>
                                {opt.text}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Answer reveal */}
                      {rev && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
                          <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: 4, fontSize: '0.85rem' }}>✓ Answer: {rev.correctAnswer}</div>
                          {rev.explanation && <p style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.6 }}>{rev.explanation}</p>}
                        </div>
                      )}

                      {!rev && (
                        <button onClick={() => handleReveal(q._id)} className="btn btn-secondary btn-sm">
                          Reveal Answer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;

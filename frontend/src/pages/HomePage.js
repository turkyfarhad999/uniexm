import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Zap, Shield, TrendingUp } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import SubjectCard from '../components/shared/SubjectCard';
import { subjectsAPI } from '../utils/api';

const FEATURES = [
  { icon: <BookOpen size={22} />, title: 'All Exam Questions', desc: 'CT1, CT2, CT3 and Semester Final questions organized by subject and year.' },
  { icon: <Zap size={22} />, title: 'Practice Mode', desc: 'AI-pattern MCQs and structured practice questions to test your understanding.' },
  { icon: <Shield size={22} />, title: 'Verified Content', desc: 'All questions uploaded and verified by the department admin.' },
  { icon: <TrendingUp size={22} />, title: 'Track Progress', desc: 'Browse by topic, difficulty and exam type. Download PDFs anytime.' },
];

const HomePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    subjectsAPI.getAll().then(({ data }) => {
      if (data.success) setSubjects(data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Badge */}
        <div className="fade-in" style={{ marginBottom: 24, animation: 'fadeIn 0.5s ease 0.1s both' }}>
          <span className="badge badge-accent" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            🎓 CSE Department — Semester 1 & 2
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-in" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 20,
          maxWidth: 800,
          animation: 'fadeIn 0.5s ease 0.2s both',
        }}>
          Your Complete
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #6366f1, #ec4899, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Exam Question Bank
          </span>
        </h1>

        <p className="fade-in" style={{ fontSize: '1.1rem', color: 'var(--text2)', maxWidth: 560, marginBottom: 40, lineHeight: 1.7, animation: 'fadeIn 0.5s ease 0.3s both' }}>
          All CT and Semester Final questions for DSA, OOP, EEE, Math & Physics — organized, searchable, and ready to practice.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="fade-in" style={{
          display: 'flex', alignItems: 'center', gap: 0,
          background: 'var(--surface)', border: '1px solid var(--border2)',
          borderRadius: 12, padding: '6px 6px 6px 16px',
          maxWidth: 520, width: '100%',
          marginBottom: 40,
          boxShadow: '0 0 30px rgba(99,102,241,0.12)',
          animation: 'fadeIn 0.5s ease 0.4s both',
        }}>
          <Search size={18} color="var(--text2)" style={{ marginRight: 10, flexShrink: 0 }} />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search questions, topics, or subjects..."
            style={{ background: 'none', border: 'none', outline: 'none', flex: 1, color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 8, padding: '10px 18px' }}>
            Search <ArrowRight size={15} />
          </button>
        </form>

        {/* Quick links */}
        <div className="fade-in" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeIn 0.5s ease 0.5s both' }}>
          {['DSA', 'OOP', 'MATH', 'PHYSICS', 'EEE'].map(sub => (
            <Link key={sub} to={`/subjects/${sub.toLowerCase()}`} className="btn btn-secondary btn-sm">{sub}</Link>
          ))}
        </div>
      </section>

      {/* Subjects section */}
      <section style={{ padding: '60px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
              Browse by Subject
            </h2>
            <p style={{ color: 'var(--text2)' }}>Select a subject to view all questions and practice materials</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {subjects.map(subject => (
                <SubjectCard key={subject._id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Everything You Need</h2>
            <p style={{ color: 'var(--text2)' }}>Built for CSE students to excel in every exam</p>
          </div>
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent2)' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0', background: 'var(--bg2)' }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={14} color="white" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>EduVault</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>CSE Department Question Bank — Semester 1 & 2</p>
          <Link to="/admin/login" style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>Admin Portal</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

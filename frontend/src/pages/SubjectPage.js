import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, BookOpen, Zap } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import QuestionCard from '../components/shared/QuestionCard';
import { questionsAPI, subjectsAPI, practiceAPI } from '../utils/api';

const EXAM_TYPES = ['ALL', 'CT1', 'CT2', 'CT3', 'FINAL'];

const SubjectPage = () => {
  const { code } = useParams();
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState({});
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [activeType, setActiveType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subRes, qRes, pRes] = await Promise.all([
          subjectsAPI.getByCode(code),
          questionsAPI.getBySubject(code),
          practiceAPI.getAll({ subject: code, limit: 50 }),
        ]);
        if (subRes.data.success) setSubject(subRes.data.data);
        if (qRes.data.success) setQuestions(qRes.data.data);
        if (pRes.data.success) setPracticeQuestions(pRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 80 }}>
        <Navbar />
        <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
          <h2>Subject not found</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Go Home</Link>
        </div>
      </div>
    );
  }

  const displayedQuestions = activeType === 'ALL'
    ? Object.values(questions).flat()
    : (questions[activeType] || []);

  const totalQCount = Object.values(questions).flat().length;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        {/* Hero */}
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
          <div className="container">
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: '0.85rem', marginBottom: 20 }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{
                width: 56, height: 56, background: `${subject.color}22`,
                border: `1px solid ${subject.color}44`, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
              }}>
                {subject.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: subject.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 2 }}>{subject.code}</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>{subject.name}</h1>
                <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{subject.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
              {Object.entries(questions).map(([type, qs]) => qs.length > 0 && (
                <div key={type} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: subject.color }}>{qs.length}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text2)', textTransform: 'uppercase' }}>{type}</div>
                </div>
              ))}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--green)' }}>{practiceQuestions.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text2)', textTransform: 'uppercase' }}>Practice</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ padding: '32px 24px' }}>
          {/* Tab nav */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            {['questions', 'practice'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? 'var(--text)' : 'var(--text2)',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: activeTab === tab ? 600 : 400,
                borderBottom: activeTab === tab ? `2px solid ${subject.color}` : '2px solid transparent',
                marginBottom: -1, textTransform: 'capitalize',
              }}>
                {tab === 'questions' ? `📄 Exam Questions (${totalQCount})` : `⚡ Practice (${practiceQuestions.length})`}
              </button>
            ))}
          </div>

          {/* Exam Questions tab */}
          {activeTab === 'questions' && (
            <div>
              {/* Filter */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                <Filter size={16} style={{ color: 'var(--text2)', alignSelf: 'center' }} />
                {EXAM_TYPES.map(type => (
                  <button key={type} onClick={() => setActiveType(type)} style={{
                    padding: '6px 14px', borderRadius: 100, border: '1px solid',
                    borderColor: activeType === type ? subject.color : 'var(--border)',
                    background: activeType === type ? `${subject.color}15` : 'transparent',
                    color: activeType === type ? subject.color : 'var(--text2)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: activeType === type ? 600 : 400,
                    fontFamily: 'var(--font-body)'
                  }}>
                    {type === 'ALL' ? `All (${totalQCount})` : `${type} (${(questions[type] || []).length})`}
                  </button>
                ))}
              </div>

              {displayedQuestions.length === 0 ? (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <p>No questions found for {activeType}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {displayedQuestions.map(q => <QuestionCard key={q._id} question={q} />)}
                </div>
              )}
            </div>
          )}

          {/* Practice tab */}
          {activeTab === 'practice' && (
            <div>
              <div className="flex-between" style={{ marginBottom: 24 }}>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Practice questions based on exam patterns</p>
                <Link to={`/practice?subject=${code}`} className="btn btn-primary btn-sm">
                  <Zap size={13} /> Start Quiz Mode
                </Link>
              </div>

              {practiceQuestions.length === 0 ? (
                <div className="empty-state">
                  <Zap size={48} />
                  <p>No practice questions yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {practiceQuestions.map(pq => (
                    <PracticeQuestionCard key={pq._id} question={pq} subjectColor={subject.color} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PracticeQuestionCard = ({ question, subjectColor }) => {
  const [revealed, setRevealed] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleReveal = async () => {
    if (!answerData) {
      const { data } = await practiceAPI.getAnswer(question._id);
      setAnswerData(data.data);
    }
    setRevealed(true);
  };

  const typeColors = { MCQ: 'var(--accent2)', SHORT: 'var(--green)', LONG: 'var(--yellow)', PROBLEM: 'var(--pink)' };

  return (
    <div className="card" style={{ borderLeft: `3px solid ${subjectColor}` }}>
      <div className="flex-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div className="flex-center gap-2">
          <span style={{ background: `${typeColors[question.type]}15`, color: typeColors[question.type], border: `1px solid ${typeColors[question.type]}30`, borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{question.type}</span>
          {question.topic && <span style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>{question.topic}</span>}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{question.marks} marks</span>
      </div>

      <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>{question.questionText}</p>

      {/* MCQ options */}
      {question.type === 'MCQ' && question.options && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
          {question.options.map(opt => {
            const isCorrect = revealed && answerData?.correctAnswer === opt.label;
            const isSelected = selected === opt.label;
            return (
              <button key={opt.label} onClick={() => !revealed && setSelected(opt.label)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                background: isCorrect ? 'rgba(16,185,129,0.15)' : isSelected && !revealed ? 'rgba(99,102,241,0.15)' : 'var(--bg)',
                border: `1px solid ${isCorrect ? 'var(--green)' : isSelected && !revealed ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8, cursor: revealed ? 'default' : 'pointer', textAlign: 'left',
                color: isCorrect ? 'var(--green)' : 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem'
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text2)', minWidth: 16 }}>{opt.label}.</span>
                {opt.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Answer */}
      {revealed && answerData && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
          <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: 4, fontSize: '0.85rem' }}>✓ Answer: {answerData.correctAnswer}</div>
          {answerData.explanation && <p style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.6 }}>{answerData.explanation}</p>}
        </div>
      )}

      {!revealed && (
        <button onClick={handleReveal} className="btn btn-secondary btn-sm">
          Reveal Answer
        </button>
      )}
    </div>
  );
};

export default SubjectPage;

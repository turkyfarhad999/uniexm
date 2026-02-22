import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Zap, ArrowRight } from 'lucide-react';

const semesterLabel = { 1: '1st Sem', 2: '2nd Sem' };

const SubjectCard = ({ subject }) => {
  const { name, code, icon, color, semester, description, questionCount, practiceCount } = subject;

  return (
    <Link
      to={`/subjects/${code.toLowerCase()}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '12px 12px 0 0' }} />

        {/* Header */}
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44,
            background: `${color}22`,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            border: `1px solid ${color}44`
          }}>
            {icon}
          </div>
          <span style={{
            background: `${color}15`,
            color: color,
            border: `1px solid ${color}30`,
            borderRadius: 100,
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            {semesterLabel[semester]}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 700 }}>{code}</div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>{name}</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: 18, lineHeight: 1.5 }}>{description}</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text2)', fontSize: '0.8rem' }}>
            <FileText size={13} />
            <span>{questionCount || 0} Questions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text2)', fontSize: '0.8rem' }}>
            <Zap size={13} />
            <span>{practiceCount || 0} Practice</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, fontSize: '0.82rem', fontWeight: 600 }}>
          <span>View Questions</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;

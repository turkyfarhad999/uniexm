import React, { useState } from 'react';
import { Download, Tag, Eye, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { questionsAPI } from '../../utils/api';

const examTypeColors = {
  CT1: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  CT2: { bg: 'rgba(20,184,166,0.15)', text: '#2dd4bf', border: 'rgba(20,184,166,0.3)' },
  CT3: { bg: 'rgba(236,72,153,0.15)', text: '#f472b6', border: 'rgba(236,72,153,0.3)' },
  FINAL: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
};

const difficultyColors = {
  easy: 'var(--green)',
  medium: 'var(--yellow)',
  hard: 'var(--red)',
};

const QuestionCard = ({ question, showSubject = false }) => {
  const [expanded, setExpanded] = useState(false);
  const { _id, questionText, examType, year, marks, difficulty, tags, questionNumber, pdfFile, subject, viewCount } = question;
  const typeColor = examTypeColors[examType] || examTypeColors.CT1;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    className="fade-in">

      {/* Header row */}
      <div className="flex-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
          {/* Exam type badge */}
          <span style={{
            background: typeColor.bg, color: typeColor.text, border: `1px solid ${typeColor.border}`,
            borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>{examType}</span>

          {/* Year */}
          <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: '0.75rem', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{year}</span>

          {/* Question number */}
          {questionNumber && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{questionNumber}</span>
          )}

          {/* Subject */}
          {showSubject && subject && (
            <span style={{ background: `${subject.color}15`, color: subject.color, border: `1px solid ${subject.color}30`, borderRadius: 6, padding: '3px 8px', fontSize: '0.72rem', fontWeight: 600 }}>
              {subject.icon} {subject.code}
            </span>
          )}
        </div>

        <div className="flex-center gap-3">
          {/* Difficulty */}
          {difficulty && (
            <span style={{ fontSize: '0.75rem', color: difficultyColors[difficulty], textTransform: 'capitalize', fontWeight: 500 }}>● {difficulty}</span>
          )}
          {/* Marks */}
          {marks && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{marks} marks</span>
          )}
          {/* View count */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text3)' }}>
            <Eye size={12} />{viewCount || 0}
          </span>
        </div>
      </div>

      {/* Question text */}
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text)',
        lineHeight: 1.7,
        overflow: expanded ? 'visible' : 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: expanded ? 'none' : 3,
        WebkitBoxOrient: 'vertical',
        marginBottom: 12,
      }}>
        {questionText}
      </p>

      {/* Footer */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
        <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
          {/* Tags */}
          {tags && tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px', fontSize: '0.72rem', color: 'var(--text2)' }}>
              <Tag size={10} />{tag}
            </span>
          ))}
        </div>

        <div className="flex-center gap-2">
          {/* PDF download */}
          {pdfFile && (
            <a
              href={questionsAPI.downloadPDF(_id)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ padding: '5px 10px' }}
            >
              <Download size={12} />
              <span>PDF</span>
            </a>
          )}

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '5px 10px' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{expanded ? 'Less' : 'More'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

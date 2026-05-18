import React, { useState } from 'react';
import axios from 'axios';

const AIRecommendation = () => {
  const [department, setDepartment] = useState('');
  const [minScore, setMinScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const token = localStorage.getItem('token');
      const payload = {};
      if (department) payload.department = department;
      if (minScore) payload.minScore = Number(minScore);

      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/ai/recommend`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'AI Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container dark-card">
      <h2>AI Performance & Promotion Analysis</h2>
      <div className="ai-controls">
        <input placeholder="Target Department (optional)" value={department} onChange={e => setDepartment(e.target.value)} />
        <input type="number" placeholder="Min Score (optional)" value={minScore} onChange={e => setMinScore(e.target.value)} />
        <button onClick={handleAnalyze} disabled={loading} className="ai-btn">
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="ai-results">
          <div className="summary-box">
            <h3>Department Summary</h3>
            <p>{results.departmentSummary}</p>
          </div>
          
          <div className="rankings-grid">
            {results.rankings && results.rankings.map((r, i) => (
              <div key={i} className="ai-card">
                <div className="rank-badge">#{r.rank}</div>
                <h4>{r.name} ({r.department})</h4>
                <p><strong>Promotion:</strong> {r.promotionRecommendation}</p>
                <div className="training-tags">
                  <strong>Training:</strong>
                  {r.trainingSuggestions.map((t, idx) => <span key={idx} className="tag">{t}</span>)}
                </div>
                <p className="feedback"><strong>Feedback:</strong> {r.improvementFeedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;

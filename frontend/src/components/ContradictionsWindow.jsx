import React, { useState, useEffect } from 'react';
import { theoryService } from '../services/api';

const ContradictionsWindow = () => {
  const [theories, setTheories] = useState([]);
  const [selectedTheoryId, setSelectedTheoryId] = useState(null);
  const [contradictions, setContradictions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTheories();
  }, []);

  useEffect(() => {
    if (selectedTheoryId) {
      loadContradictions();
    }
  }, [selectedTheoryId]);

  const loadTheories = async () => {
    try {
      const data = await theoryService.getTheories();
      setTheories(data);
      if (data.length > 0 && !selectedTheoryId) {
        setSelectedTheoryId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load theories:', err);
    }
  };

  const loadContradictions = async () => {
    try {
      setLoading(true);
      const data = await theoryService.getContradictions(selectedTheoryId);
      setContradictions(data);
    } catch (err) {
      console.error('Failed to load contradictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 0.7) return 'var(--terminal-error)';
    if (severity >= 0.4) return 'var(--terminal-warning)';
    return 'var(--terminal-fg)';
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label>Select Theory:</label>
        <select
          value={selectedTheoryId || ''}
          onChange={(e) => setSelectedTheoryId(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            background: 'var(--terminal-bg)',
            border: '1px solid var(--terminal-border)',
            color: 'var(--terminal-fg)',
            fontFamily: 'Courier New, monospace',
            marginBottom: '12px'
          }}
        >
          {theories.map(theory => (
            <option key={theory.id} value={theory.id}>
              {theory.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">ANALYZING CONTRADICTIONS...</div>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--terminal-accent)' }}>
              CONTRADICTION HEAT MAP
            </h3>
            <div className="heat-map">
              {contradictions.length > 0 ? (
                contradictions.map((contradiction, idx) => (
                  <div
                    key={contradiction.id}
                    className="heat-cell"
                    style={{
                      background: `rgba(255, 0, 0, ${contradiction.severity || 0.3})`,
                      borderColor: getSeverityColor(contradiction.severity)
                    }}
                    title={`Severity: ${((contradiction.severity || 0) * 100).toFixed(0)}%`}
                  >
                    {idx + 1}
                  </div>
                ))
              ) : (
                Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="heat-cell"
                    style={{
                      background: 'rgba(0, 255, 0, 0.1)',
                      borderColor: 'var(--terminal-border)'
                    }}
                  >
                    -
                  </div>
                ))
              )}
            </div>
          </div>

          <ul className="citation-list">
            {contradictions.map(contradiction => (
              <li key={contradiction.id} className="citation-item">
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ 
                    color: getSeverityColor(contradiction.severity),
                    fontWeight: 'bold'
                  }}>
                    ⚠ SEVERITY: {((contradiction.severity || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <p style={{ marginBottom: '8px' }}>{contradiction.contradiction_text}</p>
                <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>
                  Detected: {new Date(contradiction.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>

          {contradictions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
              NO CONTRADICTIONS DETECTED. THEORY APPEARS CONSISTENT.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContradictionsWindow;

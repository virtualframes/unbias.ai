import React, { useState, useEffect } from 'react';
import { theoryService } from '../services/api';

const AssumptionsWindow = () => {
  const [theories, setTheories] = useState([]);
  const [selectedTheoryId, setSelectedTheoryId] = useState(null);
  const [assumptions, setAssumptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTheories();
  }, []);

  useEffect(() => {
    if (selectedTheoryId) {
      loadAssumptions();
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

  const loadAssumptions = async () => {
    try {
      setLoading(true);
      const data = await theoryService.getAssumptions(selectedTheoryId);
      setAssumptions(data);
    } catch (err) {
      console.error('Failed to load assumptions:', err);
    } finally {
      setLoading(false);
    }
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
        <div className="loading">ANALYZING ASSUMPTIONS...</div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', opacity: 0.7 }}>
            <p>Monitor and track assumptions underlying the selected theory.</p>
            <p style={{ fontSize: '11px', marginTop: '8px' }}>
              Total Assumptions Detected: {assumptions.length}
            </p>
          </div>

          <ul className="citation-list">
            {assumptions.map(assumption => (
              <li key={assumption.id} className="citation-item">
                <p style={{ marginBottom: '8px' }}>{assumption.assumption_text}</p>
                {assumption.confidence_level && (
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>
                    Confidence: {(assumption.confidence_level * 100).toFixed(0)}%
                  </div>
                )}
                <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>
                  Detected: {new Date(assumption.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>

          {assumptions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
              NO ASSUMPTIONS DETECTED FOR THIS THEORY.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssumptionsWindow;

import React, { useState, useEffect } from 'react';
import { theoryService } from '../services/api';

const ProvenanceWindow = () => {
  const [theories, setTheories] = useState([]);
  const [selectedTheoryId, setSelectedTheoryId] = useState(null);
  const [provenance, setProvenance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTheories();
  }, []);

  useEffect(() => {
    if (selectedTheoryId) {
      loadProvenance();
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

  const loadProvenance = async () => {
    try {
      setLoading(true);
      const data = await theoryService.getProvenance(selectedTheoryId);
      setProvenance(data);
    } catch (err) {
      console.error('Failed to load provenance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      created: '✨',
      updated: '📝',
      citation_added: '➕',
      citation_validated: '✓',
    };
    return icons[eventType] || '•';
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
        <div className="loading">LOADING PROVENANCE DATA...</div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', opacity: 0.7 }}>
            <p>Complete audit trail of all events for this theory.</p>
            <p style={{ fontSize: '11px', marginTop: '8px' }}>
              Total Events: {provenance.length}
            </p>
          </div>

          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid var(--terminal-border)',
            padding: '12px'
          }}>
            {provenance.map((event, idx) => (
              <div
                key={event.id}
                style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: idx < provenance.length - 1 ? '1px solid var(--terminal-border)' : 'none',
                  opacity: 0.8 + (idx / provenance.length) * 0.2
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ color: 'var(--terminal-accent)' }}>
                    {getEventIcon(event.event_type)} {event.event_type.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
                
                <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>
                  {new Date(event.timestamp).toLocaleString()}
                  {event.user && ` | User: ${event.user}`}
                </div>
                
                {event.event_data && Object.keys(event.event_data).length > 0 && (
                  <div style={{ 
                    fontSize: '10px', 
                    opacity: 0.6,
                    fontFamily: 'monospace',
                    background: 'rgba(0, 255, 0, 0.05)',
                    padding: '4px',
                    marginTop: '4px'
                  }}>
                    {JSON.stringify(event.event_data, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {provenance.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
              NO PROVENANCE DATA AVAILABLE.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProvenanceWindow;

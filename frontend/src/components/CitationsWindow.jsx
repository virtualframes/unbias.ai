import React, { useState, useEffect } from 'react';
import { theoryService } from '../services/api';

const CitationsWindow = () => {
  const [theories, setTheories] = useState([]);
  const [selectedTheoryId, setSelectedTheoryId] = useState(null);
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    citation_text: '',
    source: ''
  });

  useEffect(() => {
    loadTheories();
  }, []);

  useEffect(() => {
    if (selectedTheoryId) {
      loadTheoryCitations();
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

  const loadTheoryCitations = async () => {
    try {
      setLoading(true);
      const theory = await theoryService.getTheory(selectedTheoryId);
      setCitations(theory.citations || []);
    } catch (err) {
      console.error('Failed to load citations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCitation = async (e) => {
    e.preventDefault();
    try {
      await theoryService.addCitation(selectedTheoryId, formData);
      setFormData({ citation_text: '', source: '' });
      setShowForm(false);
      loadTheoryCitations();
    } catch (err) {
      console.error('Failed to add citation:', err);
    }
  };

  const handleValidate = async (citationId) => {
    try {
      setValidating(citationId);
      await theoryService.validateCitation(citationId);
      loadTheoryCitations();
    } catch (err) {
      console.error('Failed to validate citation:', err);
    } finally {
      setValidating(null);
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

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? '[ CANCEL ]' : '[ + ADD CITATION ]'}
      </button>

      {showForm && (
        <form onSubmit={handleAddCitation} style={{ marginTop: '16px' }}>
          <label>Citation Text:</label>
          <textarea
            value={formData.citation_text}
            onChange={(e) => setFormData({ ...formData, citation_text: e.target.value })}
            required
            placeholder="Enter citation text..."
            rows={4}
          />
          
          <label>Source:</label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="Enter source URL or reference..."
          />
          
          <button type="submit">[ SUBMIT ]</button>
        </form>
      )}

      {loading ? (
        <div className="loading">LOADING CITATIONS...</div>
      ) : (
        <ul className="citation-list" style={{ marginTop: '16px' }}>
          {citations.map(citation => (
            <li key={citation.id} className="citation-item">
              <div className={`citation-status ${citation.validation_status}`}>
                {citation.validation_status.toUpperCase()}
                {citation.confidence_score && ` (${(citation.confidence_score * 100).toFixed(0)}%)`}
              </div>
              
              <p style={{ marginBottom: '8px' }}>{citation.citation_text}</p>
              
              {citation.source && (
                <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '8px' }}>
                  Source: {citation.source}
                </p>
              )}
              
              {citation.validation_result && (
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.8, 
                  marginTop: '8px',
                  padding: '8px',
                  border: '1px solid var(--terminal-border)'
                }}>
                  <div>Analysis: {citation.validation_result.analysis}</div>
                  {citation.validation_result.suggestions?.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      Suggestions: {citation.validation_result.suggestions.join(', ')}
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => handleValidate(citation.id)}
                disabled={validating === citation.id}
                style={{ marginTop: '8px' }}
              >
                {validating === citation.id ? '[ VALIDATING... ]' : '[ VALIDATE ]'}
              </button>
            </li>
          ))}
        </ul>
      )}

      {citations.length === 0 && !loading && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          NO CITATIONS FOUND. ADD ONE TO GET STARTED.
        </div>
      )}
    </div>
  );
};

export default CitationsWindow;

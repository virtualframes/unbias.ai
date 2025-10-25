import React, { useState, useEffect } from 'react';
import { theoryService } from '../services/api';

const TheoriesWindow = () => {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    loadTheories();
  }, []);

  const loadTheories = async () => {
    try {
      setLoading(true);
      const data = await theoryService.getTheories();
      setTheories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load theories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await theoryService.createTheory(formData);
      setFormData({ title: '', content: '', author: '' });
      setShowForm(false);
      loadTheories();
    } catch (err) {
      setError('Failed to create theory: ' + err.message);
    }
  };

  if (loading) return <div className="loading">LOADING THEORIES...</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? '[ CANCEL ]' : '[ + NEW THEORY ]'}
        </button>
      </div>

      {error && <div className="status-message error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Enter theory title..."
          />
          
          <label>Author:</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Enter author name..."
          />
          
          <label>Content:</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            placeholder="Enter theory content..."
            rows={6}
          />
          
          <button type="submit">[ SUBMIT ]</button>
        </form>
      )}

      <ul className="theory-list">
        {theories.map(theory => (
          <li key={theory.id} className="theory-item">
            <h3>{theory.title}</h3>
            <p>by {theory.author || 'Unknown'}</p>
            <p style={{ fontSize: '10px', opacity: 0.6, marginTop: '8px' }}>
              Created: {new Date(theory.created_at).toLocaleString()}
            </p>
            <p style={{ fontSize: '10px', opacity: 0.6 }}>
              Citations: {theory.citations?.length || 0} | 
              Provenance Events: {theory.provenances?.length || 0}
            </p>
          </li>
        ))}
      </ul>

      {theories.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          NO THEORIES FOUND. CREATE ONE TO GET STARTED.
        </div>
      )}
    </div>
  );
};

export default TheoriesWindow;

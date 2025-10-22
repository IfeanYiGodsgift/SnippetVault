// src/components/SnippetForm.jsx
import React, { useState } from 'react';
import './SnippetForm.css';

// We receive two functions as props from App.jsx
function SnippetForm({ onClose, onSave }) {
  // State for each input
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [tags, setTags] = useState(''); // This will be a comma-separated string
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the form from reloading the page

    // Convert the tags string into an array
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    // Call the onSave function we got from App.jsx
    onSave({
      title,
      language,
      tags: tagsArray,
      code
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="snippet-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>New Snippet</h2>
          <button className="form-close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Language</label>
            <input 
              type="text" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input 
              type="text" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Code</label>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="form-save-btn">Save Snippet</button>
        </form>
      </div>
    </div>
  );
}

export default SnippetForm;
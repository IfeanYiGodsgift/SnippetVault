// src/components/SnippetCard.jsx
import './SnippetCard.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React, { useState } from 'react';

// 1. Accept the 'onFilterByLanguage' prop
function SnippetCard({ snippet, onDelete, onFilterByLanguage }) {

  const [isCopied, setIsCopied] = useState(false);

  // Function to handle the copy
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setIsCopied(true);
    // Reset the "Copied!" message after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="snippet-card">
      <div className="card-header">
        <h3>{snippet.title}</h3>
        {/* 2. Add the onClick handler to the language span */}
        <span 
          className="card-language"
          onClick={() => onFilterByLanguage(snippet.language)}
        >
          {snippet.language}
        </span>
      </div>
    
    <div className="code-block-wrapper">

      <SyntaxHighlighter 
        language={snippet.language} 
        style={atomDark}
        customStyle={{ 
          margin: 0, 
          borderRadius: 0, 
          padding: "1rem", 
          backgroundColor: "var(--bg-color)" 
        }}
        wrapLongLines={true}
      >
        {snippet.code}
      </SyntaxHighlighter>
      <button className="copy-btn" onClick={handleCopy}>
        {isCopied ? 'Copied' : 'Copy'}
      </button>

    </div>
      

      <div className="card-footer">
        <div className="card-tags">
          {snippet.tags.map((tag, index) => (
            <span key={index} className="card-tag">{tag}</span>
          ))}
        </div>

        <button 
          className="delete-btn"
          onClick={() => onDelete(snippet.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default SnippetCard;
// src/components/SnippetList.jsx
import React from 'react';
import SnippetCard from './SnippetCard.jsx';

// 1. Accept the new 'onFilterByLanguage' prop
function SnippetList({ snippets, onDelete, onFilterByLanguage }) {
  if (snippets.length === 0) {
    return <p>No snippets found.</p>;
  }

  return (
    <div className="snippet-list">
      {snippets.map((snippet) => (
        <SnippetCard 
          key={snippet.id} 
          snippet={snippet} 
          onDelete={onDelete}
          onFilterByLanguage={onFilterByLanguage} // 2. Pass it down
        />
      ))}
    </div>
  );
}

export default SnippetList;
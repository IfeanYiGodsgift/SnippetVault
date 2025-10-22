import { useState, useEffect, useRef, useMemo} from "react";
import "./App.css";
import {
  fetchAllSnippets,
  createSnippet,
  searchSnippets,
  deleteSnippet,
  filterByLanguage,
} from "./api";
import SnippetList from "./components/SnippetList.jsx";
import SnippetForm from "./components/SnippetForm.jsx";
// import { useState, useEffect, useRef,  } from "react";

function App() {
  // === STATE ===
  const [snippets, setSnippets] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainContentRef = useRef(null); // Ref for scrolling

  // === EFFECTS ===
  useEffect(() => {
    loadSnippets(false); // Don't scroll on initial load
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        if (snippets.length > 0) loadSnippets(false); // Don't scroll on clear
      } else {
        handleSearch();
      }
    }, 300); // Debounce time
    return () => clearTimeout(timer); // Cleanup timer
  }, [searchQuery]);


  // === DATA & EVENT HANDLERS ===
  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const loadSnippets = async (shouldScroll = true) => {
    if (shouldScroll) scrollToTop();
    try {
      const data = await fetchAllSnippets();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load snippets:", err);
      setSnippets([]);
    }
  };

  const handleSaveSnippet = async (snippetData) => {
    try {
      await createSnippet(snippetData);
      setIsFormVisible(false);
      loadSnippets();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchSnippets(searchQuery);
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to search snippets:", err);
      setSnippets([]);
    }
  };

  const handleDeleteSnippet = async (id) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      try {
        await deleteSnippet(id);
        loadSnippets(false);
      } catch (err) {
        alert("Failed to delete snippet.");
      }
    }
  };

  const handleFilterByLanguage = async (lang) => {
    scrollToTop();
    try {
      const data = await filterByLanguage(lang);
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to filter snippets:", err);
      setSnippets([]);
    }
  };

  // const getUniqueLanguages = () => {
  //   const allLangs = snippets.map((s) => s.language);
  //   return [...new Set(allLangs.filter(lang => lang))].sort();
  // };
  // const uniqueLanguages = getUniqueLanguages();

  const uniqueLanguages = useMemo(() => {
    const allLangs = snippets.map((s) => s.language);
    return [...new Set(allLangs.filter(lang => lang))].sort();
  }, [snippets]); // The dependency array


  // === RENDER ===
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1
          className="logo"
          onClick={() => loadSnippets()}
          title="Show all snippets"
        >
          Snippet Vault
        </h1>
        <input
          type="text"
          className="search"
          placeholder="Search as you type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      {/* Body */}
      <div className="body">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
          {/* New Snippet Button */}
          <button
            className="new-snippet-btn"
            onClick={() => setIsFormVisible(true)}
            aria-hidden={!isSidebarOpen && window.innerWidth > 768}
          >
            {isSidebarOpen ? "+ New Snippet" : "+"}
          </button>

          {/* Sidebar Content */}
          <div className="sidebar-content" aria-hidden={!isSidebarOpen}>
            <h2>Languages</h2>
            <ul>
              <li onClick={() => loadSnippets()}>All Snippets</li>
              {uniqueLanguages.map((lang) => (
                <li key={lang} onClick={() => handleFilterByLanguage(lang)}>
                  {lang}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Toggle Button (Content handled by CSS) */}
          <button
            className="sidebar-toggle"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </aside>

        {/* Main Content Area */}
        <main className="main" ref={mainContentRef}>
          <h2>My Snippets</h2>
          <SnippetList
            snippets={snippets}
            onDelete={handleDeleteSnippet}
            onFilterByLanguage={handleFilterByLanguage}
          />
        </main>
      </div>

      {/* Snippet Form Modal */}
      {isFormVisible && (
        <SnippetForm
          onClose={() => setIsFormVisible(false)}
          onSave={handleSaveSnippet}
        />
      )}
    </div>
  );
}

export default App;
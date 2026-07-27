import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCopy, FaCheck, FaSearch, FaTimes,
  FaMoon, FaSun, FaVolumeUp, FaVolumeMute,
  FaChevronLeft, FaChevronRight, FaRandom,
  FaSpinner, FaBookOpen, FaGraduationCap,
  FaFire, FaStar, FaHeart, FaArrowUp,
  FaTh, FaList, FaGlobe
} from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";

const VITE_OMS_HSK_CN = import.meta.env.VITE_OMS_HSK_CN;
// ============ API CONFIG ============
const API_URL = `${VITE_OMS_HSK_CN}?limit=24`;

// ============ API SERVICE ============
interface VocabularyItem {
  number: number;
  hanzi: string;
  pinyin: string;
  english: string;
  thai: string;
  lao: string;
  hsk_level: number;
}

interface ApiResponse {
  success: boolean;
  total_count: number;
  returned_count: number;
  levels_fetched: number[];
  all_words: VocabularyItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

// ============ TEXT TO SPEECH ============
const speak = (text: string, lang: string = 'zh') => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'th': 'th-TH',
    'lo': 'lo-LA',
  };
  utterance.lang = langMap[lang] || 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(langMap[lang]?.split('-')[0] || 'en'));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

// ============ MAIN COMPONENT ============
export default function ChineseVocabularyApp() {
  // State
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [filteredWords, setFilteredWords] = useState<VocabularyItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLanguage, setShowLanguage] = useState<'all' | 'en' | 'th' | 'lo'>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const itemsPerPage = 24;
  const containerRef = useRef<HTMLDivElement>(null);

  // ============ FETCH DATA ============
  const fetchWords = useCallback(async (level: number | 'all' = 'all', page = 1, searchQuery = '') => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      let url = `${API_URL}?limit=${itemsPerPage}&offset=${offset}`;
      
      if (level !== 'all') url += `&level=${level}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setWords(data.all_words);
        setFilteredWords(data.all_words);
        setTotalWords(data.total_count);
        setTotalPages(Math.ceil(data.total_count / itemsPerPage));
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchWords('all', 1);
  }, []);

  // Handle level change
  useEffect(() => {
    setCurrentPage(1);
    fetchWords(selectedLevel, 1, search);
  }, [selectedLevel]);

  // Handle search (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchWords(selectedLevel, 1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle page change
  useEffect(() => {
    fetchWords(selectedLevel, currentPage, search);
  }, [currentPage]);

  // Scroll to top on page change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hsk_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('hsk_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // ============ HANDLERS ============
  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: number, lang: string = 'zh') => {
    setIsSpeaking(id);
    speak(text, lang);
    setTimeout(() => setIsSpeaking(null), 1500);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLevelLabel = (level: number) => {
    const labels: Record<number, string> = {
      1: 'HSK 1',
      2: 'HSK 2',
      3: 'HSK 3',
      4: 'HSK 4',
      5: 'HSK 5',
      6: 'HSK 6'
    };
    return labels[level] || `HSK ${level}`;
  };

  // ============ FILTER WORDS ============
  const getDisplayWords = () => {
    let result = filteredWords;
    
    // Filter by language
    if (showLanguage !== 'all') {
      result = result.filter(w => {
        if (showLanguage === 'en') return w.english;
        if (showLanguage === 'th') return w.thai;
        if (showLanguage === 'lo') return w.lao;
        return true;
      });
    }
    
    // Filter favorites
    if (showFavorites) {
      result = result.filter(w => favorites.includes(w.number));
    }
    
    return result;
  };

  const displayWords = getDisplayWords();

  // ============ RENDER ============
  return (
    <div className={`app-container ${isDark ? 'dark' : 'light'}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <FaBookOpen size={20} />
            <span>Learn</span>Chinese
            <span className="brand-badge">HSK</span>
          </div>
          
          <div className="header-actions">
            <button 
              className="theme-btn"
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" ref={containerRef}>
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{totalWords}</span>
            <span className="stat-label">Total Words</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{selectedLevel === 'all' ? 'All' : `HSK ${selectedLevel}`}</span>
            <span className="stat-label">Level</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{displayWords.length}</span>
            <span className="stat-label">Showing</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">{favorites.length}</span>
            <span className="stat-label">⭐ Favorites</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-bar">
          {/* Level Selector */}
          <div className="level-selector">
            <button
              className={`level-btn ${selectedLevel === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('all')}
            >
              All
            </button>
            {[1, 2, 3, 4, 5, 6].map(level => (
              <button
                key={level}
                className={`level-btn ${selectedLevel === level ? 'active' : ''}`}
                onClick={() => setSelectedLevel(level)}
              >
                HSK {level}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search Chinese, Pinyin, English, Thai, Lao..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <FaTimes />
              </button>
            )}
          </div>

          {/* View Controls */}
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <FaTh size={14} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <FaList size={14} />
            </button>
            <button
              className={`view-btn ${showLanguage !== 'all' ? 'active' : ''}`}
              onClick={() => {
                const langs = ['all', 'en', 'th', 'lo'];
                const current = langs.indexOf(showLanguage);
                setShowLanguage(langs[(current + 1) % langs.length] as any);
              }}
              title="Toggle translation language"
            >
              <FaGlobe size={14} />
              <span className="lang-indicator">
                {showLanguage === 'all' ? '🌐' : 
                 showLanguage === 'en' ? '🇬🇧' : 
                 showLanguage === 'th' ? '🇹🇭' : '🇱🇦'}
              </span>
            </button>
            <button
              className={`view-btn ${showFavorites ? 'active' : ''}`}
              onClick={() => setShowFavorites(!showFavorites)}
              title="Show favorites only"
            >
              <FaStar size={14} />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span>
            {isLoading ? (
              <FaSpinner className="spinner" />
            ) : (
              `Showing ${displayWords.length} of ${totalWords} words`
            )}
          </span>
          {!isLoading && displayWords.length === 0 && (
            <span className="no-results">No words found</span>
          )}
        </div>

        {/* Word Grid */}
        {isLoading ? (
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <span>Loading words...</span>
          </div>
        ) : (
          <>
            <div className={`word-grid ${viewMode}`}>
              {displayWords.map((word, index) => (
                <motion.div
                  key={word.number}
                  className="word-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Sound Button */}
                  <button
                    className={`sound-btn ${isSpeaking === word.number ? 'speaking' : ''}`}
                    onClick={() => handleSpeak(word.hanzi, word.number)}
                  >
                    {isSpeaking === word.number ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                  </button>

                  {/* Favorite Button */}
                  <button
                    className={`fav-btn ${favorites.includes(word.number) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(word.number)}
                    title={favorites.includes(word.number) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FaStar size={14} />
                  </button>

                  <div className="word-main">
                    <span className="hanzi">{word.hanzi}</span>
                    <span className="pinyin">{word.pinyin}</span>
                  </div>

                  <div className="word-translations">
                    {(showLanguage === 'all' || showLanguage === 'en') && word.english && (
                      <div className="translation-item en">
                        <span className="lang-tag">EN</span>
                        <span className="translation-text">{word.english}</span>
                        <button
                          className="mini-speak"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(word.english, word.number, 'en');
                          }}
                        >
                          <FaVolumeUp size={10} />
                        </button>
                      </div>
                    )}
                    {(showLanguage === 'all' || showLanguage === 'th') && word.thai && (
                      <div className="translation-item th">
                        <span className="lang-tag">TH</span>
                        <span className="translation-text">{word.thai}</span>
                        <button
                          className="mini-speak"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(word.thai, word.number, 'th');
                          }}
                        >
                          <FaVolumeUp size={10} />
                        </button>
                      </div>
                    )}
                    {(showLanguage === 'all' || showLanguage === 'lo') && word.lao && (
                      <div className="translation-item lo">
                        <span className="lang-tag">LO</span>
                        <span className="translation-text">{word.lao}</span>
                        <button
                          className="mini-speak"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(word.lao, word.number, 'lo');
                          }}
                        >
                          <FaVolumeUp size={10} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="word-actions">
                    <button
                      className={`action-btn copy-btn ${copiedId === word.number ? 'copied' : ''}`}
                      onClick={() => handleCopy(word.hanzi, word.number)}
                    >
                      {copiedId === word.number ? <FaCheck size={12} /> : <FaCopy size={12} />}
                      {copiedId === word.number ? 'Copied' : 'Copy'}
                    </button>
                    <span className="word-level">{getLevelLabel(word.hsk_level)}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft size={14} />
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <FaArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

// ============ STYLES ============
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .app-container {
    min-height: 100vh;
    background: #0a1210;
    font-family: -apple-system, 'Inter', sans-serif;
    transition: background 0.3s;
  }

  .app-container.light {
    background: #f0f2f5;
  }

  /* ============ HEADER ============ */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10, 18, 16, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    padding: 12px 20px;
  }

  .app-container.light .header {
    background: rgba(255,255,255,0.85);
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-brand {
    font-size: 1.2rem;
    font-weight: 800;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .app-container.light .header-brand {
    color: #0a1210;
  }

  .header-brand span { color: #0d7a68; }

  .brand-badge {
    font-size: 0.55rem;
    padding: 2px 10px;
    border-radius: 12px;
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
    font-weight: 600;
  }

  .theme-btn {
    padding: 8px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.3s;
  }

  .app-container.light .theme-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: rgba(0,0,0,0.6);
  }

  .theme-btn:hover {
    background: rgba(13,122,104,0.15);
    color: #0d7a68;
  }

  /* ============ MAIN CONTENT ============ */
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  /* ============ STATS BAR ============ */
  .stats-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 20px;
    background: rgba(255,255,255,0.03);
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .app-container.light .stats-bar {
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(0,0,0,0.04);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stat-number {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
  }

  .app-container.light .stat-number {
    color: #0a1210;
  }

  .stat-label {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.3);
    font-weight: 500;
  }

  .app-container.light .stat-label {
    color: rgba(0,0,0,0.3);
  }

  .stat-divider {
    width: 1px;
    height: 20px;
    background: rgba(255,255,255,0.06);
  }

  .app-container.light .stat-divider {
    background: rgba(0,0,0,0.06);
  }

  /* ============ CONTROLS BAR ============ */
  .controls-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .level-selector {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.04);
    flex-wrap: wrap;
  }

  .app-container.light .level-selector {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04);
  }

  .level-btn {
    padding: 6px 14px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.4);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .app-container.light .level-btn {
    color: rgba(0,0,0,0.4);
  }

  .level-btn:hover {
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.04);
  }

  .app-container.light .level-btn:hover {
    color: rgba(0,0,0,0.7);
    background: rgba(0,0,0,0.04);
  }

  .level-btn.active {
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
  }

  .app-container.light .level-btn.active {
    background: rgba(13,122,104,0.1);
    color: #0d7a68;
  }

  .search-wrapper {
    flex: 1;
    position: relative;
    min-width: 180px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.15);
  }

  .app-container.light .search-icon {
    color: rgba(0,0,0,0.15);
  }

  .search-input {
    width: 100%;
    padding: 8px 12px 8px 38px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: #fff;
    font-size: 0.85rem;
    outline: none;
    transition: all 0.3s;
  }

  .app-container.light .search-input {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: #0a1210;
  }

  .search-input:focus {
    border-color: rgba(13,122,104,0.3);
  }

  .search-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .app-container.light .search-input::placeholder {
    color: rgba(0,0,0,0.2);
  }

  .search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255,255,255,0.2);
    cursor: pointer;
  }

  .app-container.light .search-clear {
    color: rgba(0,0,0,0.2);
  }

  .view-controls {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.04);
    align-items: center;
  }

  .app-container.light .view-controls {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04);
  }

  .view-btn {
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
  }

  .app-container.light .view-btn {
    color: rgba(0,0,0,0.3);
  }

  .view-btn:hover {
    color: rgba(255,255,255,0.6);
  }

  .app-container.light .view-btn:hover {
    color: rgba(0,0,0,0.6);
  }

  .view-btn.active {
    background: rgba(13,122,104,0.12);
    color: #4db8a8;
  }

  .lang-indicator {
    font-size: 12px;
  }

  /* ============ RESULTS INFO ============ */
  .results-info {
    display: flex;
    justify-content: space-between;
    padding: 8px 4px;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.2);
    margin-bottom: 12px;
  }

  .app-container.light .results-info {
    color: rgba(0,0,0,0.2);
  }

  .results-info .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .no-results {
    color: rgba(255,255,255,0.3);
  }

  .app-container.light .no-results {
    color: rgba(0,0,0,0.3);
  }

  /* ============ WORD GRID ============ */
  .word-grid {
    display: grid;
    gap: 12px;
  }

  .word-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .word-grid.list {
    grid-template-columns: 1fr;
  }

  .word-card {
    position: relative;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 16px;
    padding: 18px;
    transition: all 0.3s;
  }

  .app-container.light .word-card {
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }

  .word-card:hover {
    border-color: rgba(13,122,104,0.2);
    box-shadow: 0 8px 24px rgba(13,122,104,0.05);
  }

  .app-container.light .word-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  }

  /* Sound Button */
  .sound-btn {
    position: absolute;
    top: 10px;
    right: 44px;
    padding: 6px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.3s;
  }

  .app-container.light .sound-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: rgba(0,0,0,0.2);
  }

  .sound-btn:hover {
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
  }

  .sound-btn.speaking {
    background: rgba(13,122,104,0.2);
    color: #4db8a8;
    animation: pulse 0.8s ease infinite;
  }

  /* Favorite Button */
  .fav-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 6px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.3s;
  }

  .app-container.light .fav-btn {
    color: rgba(0,0,0,0.1);
  }

  .fav-btn:hover {
    color: #fbbf24;
    transform: scale(1.1);
  }

  .fav-btn.active {
    color: #fbbf24;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .word-main {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }

  .hanzi {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
  }

  .app-container.light .hanzi {
    color: #0a1210;
  }

  .pinyin {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.2);
    margin-top: 2px;
  }

  .app-container.light .pinyin {
    color: rgba(0,0,0,0.2);
  }

  .word-translations {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }

  .translation-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    padding: 2px 0;
  }

  .lang-tag {
    font-size: 0.55rem;
    font-weight: 700;
    color: rgba(255,255,255,0.15);
    min-width: 24px;
  }

  .app-container.light .lang-tag {
    color: rgba(0,0,0,0.15);
  }

  .translation-item.en .lang-tag { color: #3b82f6; }
  .translation-item.th .lang-tag { color: #ef4444; }
  .translation-item.lo .lang-tag { color: #8b5cf6; }

  .translation-text {
    color: rgba(255,255,255,0.6);
  }

  .app-container.light .translation-text {
    color: rgba(0,0,0,0.6);
  }

  .mini-speak {
    padding: 2px 4px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.15);
    cursor: pointer;
    transition: all 0.3s;
  }

  .app-container.light .mini-speak {
    color: rgba(0,0,0,0.15);
  }

  .mini-speak:hover {
    color: #4db8a8;
  }

  .word-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }

  .app-container.light .word-actions {
    border-top: 1px solid rgba(0,0,0,0.04);
  }

  .action-btn {
    padding: 4px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.3);
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .app-container.light .action-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: rgba(0,0,0,0.3);
  }

  .action-btn:hover {
    background: rgba(13,122,104,0.1);
    color: #4db8a8;
    border-color: rgba(13,122,104,0.2);
  }

  .action-btn.copied {
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
    border-color: rgba(13,122,104,0.2);
  }

  .word-level {
    font-size: 0.55rem;
    color: rgba(255,255,255,0.15);
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    background: rgba(255,255,255,0.03);
  }

  .app-container.light .word-level {
    color: rgba(0,0,0,0.15);
    background: rgba(0,0,0,0.03);
  }

  /* ============ PAGINATION ============ */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 24px;
    padding: 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.04);
  }

  .app-container.light .pagination {
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(0,0,0,0.04);
  }

  .page-btn {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: transparent;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
  }

  .app-container.light .page-btn {
    border: 1px solid rgba(0,0,0,0.06);
    color: rgba(0,0,0,0.3);
  }

  .page-btn:hover:not(:disabled) {
    background: rgba(13,122,104,0.1);
    color: #4db8a8;
    border-color: rgba(13,122,104,0.2);
  }

  .page-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 4px;
  }

  .page-num {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.8rem;
  }

  .app-container.light .page-num {
    color: rgba(0,0,0,0.3);
  }

  .page-num:hover {
    color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.04);
  }

  .app-container.light .page-num:hover {
    color: rgba(0,0,0,0.6);
    background: rgba(0,0,0,0.04);
  }

  .page-num.active {
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
  }

  /* ============ LOADING ============ */
  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px;
    color: rgba(255,255,255,0.2);
  }

  .app-container.light .loading-state {
    color: rgba(0,0,0,0.2);
  }

  .loading-state .spinner {
    animation: spin 1s linear infinite;
  }

  /* ============ SCROLL TO TOP ============ */
  .scroll-top {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px;
    border-radius: 50%;
    border: none;
    background: rgba(13,122,104,0.9);
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(13,122,104,0.3);
    z-index: 50;
  }

  .scroll-top:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(13,122,104,0.4);
  }

  /* ============ RESPONSIVE ============ */
  @media (max-width: 768px) {
    .controls-bar {
      flex-direction: column;
    }
    .level-selector {
      justify-content: center;
      overflow-x: auto;
      flex-wrap: nowrap;
    }
    .level-btn {
      font-size: 0.65rem;
      padding: 4px 10px;
      white-space: nowrap;
    }
    .word-grid.grid {
      grid-template-columns: 1fr 1fr;
    }
    .stats-bar {
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }
    .stat-divider {
      display: none;
    }
    .pagination {
      flex-wrap: wrap;
      gap: 4px;
    }
    .page-numbers {
      flex-wrap: wrap;
      justify-content: center;
    }
    .sound-btn {
      right: 38px;
    }
  }

  @media (max-width: 480px) {
    .word-grid.grid {
      grid-template-columns: 1fr;
    }
    .header-brand {
      font-size: 1rem;
    }
    .brand-badge {
      display: none;
    }
    .main-content {
      padding: 12px;
    }
    .word-card {
      padding: 14px;
    }
    .hanzi {
      font-size: 1.6rem;
    }
    .view-controls .view-btn {
      padding: 4px 6px;
    }
    .view-controls .view-btn .lang-indicator {
      font-size: 10px;
    }
  }
`;
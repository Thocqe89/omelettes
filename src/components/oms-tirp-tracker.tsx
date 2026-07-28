import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AiOutlineCopy, AiOutlineCheck, AiOutlineSearch, AiOutlineClose,
  AiOutlineSun, AiOutlineMoon, AiOutlineSound, AiOutlineMuted,
  AiOutlineLeft, AiOutlineRight, AiOutlineStar,
  AiOutlineHome, AiOutlineBook, AiOutlineThunderbolt,
  AiOutlineAppstore, AiOutlineUnorderedList,
  AiOutlineArrowUp, AiOutlineArrowLeft,
  AiOutlineAudioMuted, AiOutlineDelete, AiOutlineMenu
} from "react-icons/ai";

const VITE_OMS_HSK_CN = import.meta.env.VITE_OMS_HSK_CN;
const API_URL = VITE_OMS_HSK_CN;

// ============ INTERFACES ============
interface VocabularyItem {
  number: number;
  hanzi: string;
  pinyin: string;
  english: string;
  thai: string;
  lao: string;
  hsk_level: number;
}

interface NumbersItem {
  number: number;
  hanzi: string;
  pinyin: string;
  english: string;
  thai: string;
  lao: string;
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

interface NumbersResponse {
  success: boolean;
  type: string;
  total_count: number;
  returned_count: number;
  data: NumbersItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface HSKLevel {
  id?: string;
  level?: number;
  label: string;
  words: number;
  icon: string;
  color: string;
  bg: string;
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

// ============ LEVEL DATA ============
const HSK_LEVELS: HSKLevel[] = [
  { id: 'numbers', label: 'Numbers', words: 18, icon: '🔢', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { level: 1, label: 'HSK 1', words: 150, icon: '🌟', color: '#4db8a8', bg: 'rgba(77,184,168,0.1)' },
  { level: 2, label: 'HSK 2', words: 150, icon: '⭐', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  { level: 3, label: 'HSK 3', words: 300, icon: '🔥', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { level: 4, label: 'HSK 4', words: 600, icon: '💪', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { level: 5, label: 'HSK 5', words: 1300, icon: '🏆', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  { level: 6, label: 'HSK 6', words: 2500, icon: '👑', color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
];

// ============ MAIN COMPONENT ============
export default function ChineseVocabularyApp() {
  // ============ STATE ============
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [filteredWords, setFilteredWords] = useState<VocabularyItem[]>([]);
  const [numbers, setNumbers] = useState<NumbersItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | number>('all');
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'learn' | 'game'>('home');
  const [gameScore, setGameScore] = useState(0);
  const [gameTotal, setGameTotal] = useState(0);
  const [gameWords, setGameWords] = useState<VocabularyItem[]>([]);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameOptions, setGameOptions] = useState<string[]>([]);
  const [gameAnswered, setGameAnswered] = useState(false);
  const [gameCorrect, setGameCorrect] = useState(false);
  const [gameShowAnswer, setGameShowAnswer] = useState(false);
  const [gameLanguage, setGameLanguage] = useState<'en' | 'th' | 'lo'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const itemsPerPage = 25;
  const containerRef = useRef<HTMLDivElement>(null);

  // ============ DETECT MOBILE ============
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============ FETCH NUMBERS ============
  const fetchNumbers = useCallback(async () => {
    setIsLoading(true);
    setLoadingMessage('Loading numbers...');
    try {
      const url = `${API_URL}?type=numbers`;
      const response = await fetch(url);
      const data: NumbersResponse = await response.json();
      
      if (data.success) {
        setNumbers(data.data);
        setFilteredWords(data.data as unknown as VocabularyItem[]);
        setTotalWords(data.total_count);
        setTotalPages(Math.ceil(data.total_count / itemsPerPage));
      }
    } catch (error) {
      console.error('Failed to fetch numbers:', error);
      setLoadingMessage('Failed to load. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ FETCH WORDS ============
  const fetchWords = useCallback(async (level: string | number = 'all', page = 1, searchQuery = '') => {
    setIsLoading(true);
    setLoadingMessage('Loading vocabulary...');
    try {
      const offset = (page - 1) * itemsPerPage;
      let url = `${API_URL}?type=vocabulary&limit=${itemsPerPage}&offset=${offset}`;
      
      if (level !== 'all' && level !== 'numbers') url += `&level=${level}`;
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
      setLoadingMessage('Failed to load. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ LIFECYCLE EFFECTS ============
  useEffect(() => {
    if (currentView === 'home') {
      setIsLoading(false);
      return;
    }
    setCurrentPage(1);
    if (selectedLevel === 'numbers') {
      fetchNumbers();
    } else {
      fetchWords(selectedLevel, 1);
    }
  }, [currentView, selectedLevel, fetchNumbers, fetchWords]);

  useEffect(() => {
    if (currentView === 'home') return;
    if (selectedLevel === 'numbers') {
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const filtered = numbers.filter(num => 
          num.hanzi.includes(query) ||
          num.pinyin.toLowerCase().includes(query) ||
          num.english.toLowerCase().includes(query) ||
          num.thai.includes(query) ||
          num.lao.includes(query) ||
          num.number.toString().includes(query)
        );
        setFilteredWords(filtered as unknown as VocabularyItem[]);
        setTotalWords(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      } else {
        setFilteredWords(numbers as unknown as VocabularyItem[]);
        setTotalWords(numbers.length);
        setTotalPages(Math.ceil(numbers.length / itemsPerPage));
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchWords(selectedLevel, 1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedLevel, numbers, currentView, fetchWords]);

  useEffect(() => {
    if (currentView === 'home') return;
    if (selectedLevel === 'numbers') {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = numbers.slice(start, end);
      setFilteredWords(paginated as unknown as VocabularyItem[]);
      return;
    }
    fetchWords(selectedLevel, currentPage, search);
  }, [currentPage, selectedLevel, currentView, fetchWords, search, numbers]);

  useEffect(() => {
    if (containerRef.current && currentView !== 'home') {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // ============ GAME FUNCTIONS ============
  const startGame = (level: string | number) => {
    let wordsToUse: VocabularyItem[] = [];
    
    if (level === 'numbers') {
      wordsToUse = numbers as unknown as VocabularyItem[];
    } else if (level === 'all') {
      wordsToUse = filteredWords;
    } else {
      wordsToUse = words.filter(w => w.hsk_level === level as number);
    }
    
    if (wordsToUse.length < 4) {
      alert('Not enough words for a game! Need at least 4 words.');
      return;
    }
    
    const shuffled = [...wordsToUse].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    
    setGameWords(selected);
    setGameIndex(0);
    setGameScore(0);
    setGameTotal(0);
    setGameAnswered(false);
    setGameCorrect(false);
    setGameShowAnswer(false);
    setGameLanguage('en');
    generateGameOptions(selected[0], selected, 'en');
    setCurrentView('game');
  };

  const generateGameOptions = (word: VocabularyItem, allWords: VocabularyItem[], lang: 'en' | 'th' | 'lo') => {
    const langMap: Record<string, keyof VocabularyItem> = {
      'en': 'english',
      'th': 'thai',
      'lo': 'lao'
    };
    const correctKey = langMap[lang];
    const correctAnswer = word[correctKey] as string;
    
    const others = allWords.filter(w => w.number !== word.number);
    const shuffledOthers = others.sort(() => Math.random() - 0.5);
    const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w[correctKey] as string);
    
    // Ensure we have enough wrong answers
    const options = [correctAnswer, ...wrongAnswers];
    while (options.length < 4) {
      options.push('---');
    }
    setGameOptions(options.sort(() => Math.random() - 0.5));
  };

  const handleGameAnswer = (answer: string) => {
    if (gameAnswered) return;
    
    const langMap: Record<string, keyof VocabularyItem> = {
      'en': 'english',
      'th': 'thai',
      'lo': 'lao'
    };
    const correctKey = langMap[gameLanguage];
    const currentWord = gameWords[gameIndex];
    const correctAnswer = currentWord[correctKey] as string;
    
    setGameAnswered(true);
    setGameTotal(prev => prev + 1);
    setGameShowAnswer(true);
    
    if (answer === correctAnswer) {
      setGameScore(prev => prev + 1);
      setGameCorrect(true);
    } else {
      setGameCorrect(false);
    }
  };

  const nextGameQuestion = () => {
    const nextIndex = gameIndex + 1;
    if (nextIndex >= gameWords.length) {
      const percentage = Math.round((gameScore / gameWords.length) * 100);
      alert(`🎉 Game Complete!\n\nScore: ${gameScore}/${gameWords.length}\nAccuracy: ${percentage}%\n\n${percentage >= 70 ? '🌟 Excellent!' : '💪 Keep practicing!'}`);
      setCurrentView('learn');
      return;
    }
    
    setGameIndex(nextIndex);
    setGameAnswered(false);
    setGameCorrect(false);
    setGameShowAnswer(false);
    generateGameOptions(gameWords[nextIndex], gameWords, gameLanguage);
  };

  const changeGameLanguage = (lang: 'en' | 'th' | 'lo') => {
    setGameLanguage(lang);
    if (gameWords.length > 0 && gameIndex < gameWords.length) {
      generateGameOptions(gameWords[gameIndex], gameWords, lang);
      setGameAnswered(false);
      setGameCorrect(false);
      setGameShowAnswer(false);
    }
  };

  // ============ FILTER WORDS ============
  const getDisplayWords = () => {
    let result = filteredWords;
    if (showFavorites) {
      result = result.filter(w => favorites.includes(w.number));
    }
    return result;
  };

  const displayWords = getDisplayWords();

  // ============ CLEAR FAVORITES ============
  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
    }
  };

  // ============ RENDER HOME ============
  const renderHome = () => (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">
          <span>Learn</span> Chinese <span>HSK</span>
        </h1>
        <p className="home-sub">Master 9000+ words with voice pronunciation support</p>
      </div>
      <div className="home-levels">
        {HSK_LEVELS.map((level, index) => (
          <motion.div
            key={level.id || level.level}
            className="home-level-card"
            style={{ borderColor: level.color + '40' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => {
              const levelValue = level.id === 'numbers' ? 'numbers' : (level.level ?? 'all');
              setSelectedLevel(levelValue);
              setCurrentView('learn');
              setMobileMenuOpen(false);
              if (level.id === 'numbers') {
                fetchNumbers();
              } else {
                fetchWords(level.level ?? 'all', 1);
              }
            }}
          >
            <div className="level-icon" style={{ color: level.color }}>{level.icon}</div>
            <div className="level-name">{level.label}</div>
            <div className="level-words">{level.words} words</div>
            <button className="level-start-btn" style={{ color: level.color, borderColor: level.color + '60' }}>
              Start Learning →
            </button>
          </motion.div>
        ))}
      </div>
      <div className="home-footer-text">
        <span>✨ Learn Chinese • Practice • Master • Succeed</span>
      </div>
    </div>
  );

  // ============ RENDER GAME ============
  const renderGame = () => {
    const currentWord = gameWords[gameIndex];
    if (!currentWord) return <div className="loading-state"><div className="spinner"></div> Loading...</div>;
    
    const langLabels: Record<string, string> = {
      'en': 'English',
      'th': 'Thai',
      'lo': 'Lao'
    };
    
    const langMap: Record<string, keyof VocabularyItem> = {
      'en': 'english',
      'th': 'thai',
      'lo': 'lao'
    };
    
    const correctKey = langMap[gameLanguage];
    const correctAnswer = currentWord[correctKey] as string;
    
    return (
      <div className="game-container">
        <div className="game-header">
          <button className="game-back-btn" onClick={() => setCurrentView('learn')}>
            <AiOutlineArrowLeft size={16} /> Back
          </button>
          <div className="game-score-display">
            <span className="game-score-number">{gameScore}</span>
            <span className="game-score-label">/ {gameWords.length}</span>
          </div>
        </div>
        <div className="game-card">
          <div className="game-progress">
            <div className="game-progress-bar">
              <div style={{ width: `${((gameIndex + 1) / gameWords.length) * 100}%` }} />
            </div>
            <span className="game-progress-text">{gameIndex + 1} / {gameWords.length}</span>
          </div>

          <div className="game-lang-selector">
            {['en', 'th', 'lo'].map((lang) => (
              <button
                key={lang}
                className={`game-lang-btn ${gameLanguage === lang ? 'active' : ''}`}
                onClick={() => changeGameLanguage(lang as 'en' | 'th' | 'lo')}
              >
                {langLabels[lang as keyof typeof langLabels]}
              </button>
            ))}
          </div>

          <div className="game-question">
            <div 
              className="game-hanzi"
              onClick={() => handleSpeak(currentWord.hanzi, currentWord.number)}
              style={{ cursor: 'pointer' }}
            >
              {currentWord.hanzi}
              <span className="game-play-icon">▶</span>
            </div>
            <div className="game-pinyin">{currentWord.pinyin}</div>
            <div className="game-hint">Match to {langLabels[gameLanguage]}</div>
          </div>

          <div className="game-options">
            {gameOptions.map((option, i) => {
              let className = 'game-option';
              if (gameAnswered && gameShowAnswer) {
                if (option === correctAnswer) {
                  className += ' correct';
                }
              }
              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => handleGameAnswer(option)}
                  disabled={gameAnswered || option === '---'}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {gameAnswered && gameShowAnswer && (
            <div className={`game-result ${gameCorrect ? 'correct' : 'wrong'}`}>
              {gameCorrect ? '✅ Correct!' : `❌ Answer: ${correctAnswer}`}
            </div>
          )}

          {gameAnswered && (
            <button className="game-next-btn" onClick={nextGameQuestion}>
              {gameIndex + 1 >= gameWords.length ? 'Finish 🎯' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============ RENDER LEARN ============
  const renderLearn = () => (
    <div className="learn-page">
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AiOutlineMenu size={20} />
          {mobileMenuOpen ? ' Close' : ' Menu'}
        </button>
      )}

      <AnimatePresence>
        {(!isMobile || mobileMenuOpen) && (
          <motion.div 
            className="controls-bar"
            initial={isMobile ? { x: -300, opacity: 0 } : undefined}
            animate={isMobile ? { x: 0, opacity: 1 } : undefined}
            exit={isMobile ? { x: -300, opacity: 0 } : undefined}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="level-selector">
              <button
                className={`level-btn ${selectedLevel === 'all' ? 'active' : ''}`}
                onClick={() => { setSelectedLevel('all'); setMobileMenuOpen(false); }}
              >
                All
              </button>
              <button
                className={`level-btn ${selectedLevel === 'numbers' ? 'active' : ''}`}
                onClick={() => { setSelectedLevel('numbers'); setMobileMenuOpen(false); fetchNumbers(); }}
              >
                Numbers
              </button>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <button
                  key={level}
                  className={`level-btn ${selectedLevel === level ? 'active' : ''}`}
                  onClick={() => { setSelectedLevel(level); setMobileMenuOpen(false); }}
                >
                  HSK {level}
                </button>
              ))}
            </div>
            
            <div className="search-wrapper">
              <AiOutlineSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>
                  <AiOutlineClose size={14} />
                </button>
              )}
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <AiOutlineAppstore size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <AiOutlineUnorderedList size={16} />
              </button>
              <button
                className={`view-btn ${showFavorites ? 'active' : ''}`}
                onClick={() => setShowFavorites(!showFavorites)}
                title="Show favorites"
              >
                <AiOutlineStar size={16} />
              </button>
              {showFavorites && favorites.length > 0 && (
                <button
                  className="view-btn delete-btn"
                  onClick={clearAllFavorites}
                  title="Clear all favorites"
                >
                  <AiOutlineDelete size={16} />
                </button>
              )}
              <button
                className="view-btn game-btn"
                onClick={() => startGame(selectedLevel)}
                title="Start Game"
              >
                <AiOutlineThunderbolt size={16} />
              </button>
              <button
                className="view-btn back-home-btn"
                onClick={() => setCurrentView('home')}
                title="Back to Home"
              >
                <AiOutlineHome size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{totalWords}</span>
          <span className="stat-label">Total</span>
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

      <div className="results-info">
        {isLoading ? (
          <span className="loading-indicator">⏳ {loadingMessage}</span>
        ) : (
          `Showing ${displayWords.length} of ${totalWords} words`
        )}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>{loadingMessage}</span>
        </div>
      ) : displayWords.length === 0 ? (
        <div className="empty-state">
          <p>No words found</p>
          <button onClick={() => { setSearch(''); setShowFavorites(false); }}>Reset filters</button>
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
                transition={{ delay: Math.min((index % 10) * 0.05, 0.5) }}
                whileHover={!isMobile ? { y: -4 } : undefined}
              >
                <div className="word-header">
                  <span className="word-number">#{word.number}</span>
                  <div className="word-actions-top">
                    <button
                      className={`sound-btn ${isSpeaking === word.number ? 'speaking' : ''}`}
                      onClick={() => handleSpeak(word.hanzi, word.number)}
                    >
                      {isSpeaking === word.number ? <AiOutlineMuted size={16} /> : <AiOutlineSound size={16} />}
                    </button>
                    <button
                      className={`fav-btn ${favorites.includes(word.number) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(word.number)}
                    >
                      <AiOutlineStar size={16} />
                    </button>
                  </div>
                </div>

                <div className="word-main">
                  <span className="hanzi">{word.hanzi}</span>
                  <span className="pinyin">{word.pinyin}</span>
                </div>

                <div className="translations-grid">
                  <div className="translation-card lao">
                    <div className="translation-header">
                      <span className="lang-flag">🇱🇦</span>
                      <span className="lang-name">Lao</span>
                    </div>
                    <div className="translation-body">
                      <span className="translation-text">{word.lao}</span>
                      <button className="mini-speak disabled" disabled title="Not available">
                        <AiOutlineAudioMuted size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="translation-card english">
                    <div className="translation-header">
                      <span className="lang-flag">🇬🇧</span>
                      <span className="lang-name">English</span>
                    </div>
                    <div className="translation-body">
                      <span className="translation-text">{word.english}</span>
                      <button
                        className="mini-speak"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(word.english, word.number, 'en');
                        }}
                      >
                        <AiOutlineSound size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="translation-card thai">
                    <div className="translation-header">
                      <span className="lang-flag">🇹🇭</span>
                      <span className="lang-name">Thai</span>
                    </div>
                    <div className="translation-body">
                      <span className="translation-text">{word.thai}</span>
                      <button
                        className="mini-speak"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(word.thai, word.number, 'th');
                        }}
                      >
                        <AiOutlineSound size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="word-footer">
                  <button
                    className={`copy-btn ${copiedId === word.number ? 'copied' : ''}`}
                    onClick={() => handleCopy(word.hanzi, word.number)}
                  >
                    {copiedId === word.number ? <AiOutlineCheck size={14} /> : <AiOutlineCopy size={14} />}
                    {copiedId === word.number ? 'Copied!' : 'Copy'}
                  </button>
                  <span className="word-level">
                    {selectedLevel === 'numbers' ? 'Numbers' : `HSK ${word.hsk_level}`}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <AiOutlineLeft size={14} />
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
                <AiOutlineRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ============ RENDER ============
  return (
    <div className={`app-container ${isDark ? 'dark' : 'light'}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <AiOutlineBook size={20} />
            <span>Learn</span>Chinese
            <span className="brand-badge">HSK</span>
          </div>
          
          <div className="header-actions">
            <button 
              className="theme-btn"
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <AiOutlineSun size={18} /> : <AiOutlineMoon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content" ref={containerRef}>
        {currentView === 'home' && renderHome()}
        {currentView === 'learn' && renderLearn()}
        {currentView === 'game' && renderGame()}
      </main>

      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <AiOutlineArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

// ============ STYLES - FULLY RESPONSIVE ============
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { -webkit-font-smoothing: antialiased; }
  
  .app-container {
    min-height: 100vh;
    background: #0a1210;
    font-family: -apple-system, 'Inter', sans-serif;
    transition: background 0.3s;
    position: relative;
  }
  .app-container.light {
    background: #f0f2f5;
  }
  
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10, 18, 16, 0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    padding: 12px 16px;
  }
  .app-container.light .header {
    background: rgba(255,255,255,0.92);
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
  }
  .header-brand {
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .app-container.light .header-brand {
    color: #0a1210;
  }
  .header-brand span { color: #0d7a68; }
  .brand-badge {
    font-size: 0.5rem;
    padding: 2px 8px;
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
  
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
  }
  
  .home-page {
    padding: 0;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .home-hero {
    text-align: center;
    margin-bottom: 32px;
  }
  .home-title {
    font-size: 2.2rem;
    font-weight: 900;
    color: #fff;
  }
  .app-container.light .home-title {
    color: #0a1210;
  }
  .home-title span { color: #0d7a68; }
  .home-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.4);
    margin-top: 8px;
  }
  .app-container.light .home-sub {
    color: rgba(0,0,0,0.4);
  }
  .home-levels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    max-width: 100%;
  }
  .home-level-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 16px 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  .app-container.light .home-level-card {
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(0,0,0,0.06);
  }
  .home-level-card:active {
    transform: scale(0.95);
  }
  .home-level-card:hover {
    border-color: rgba(13,122,104,0.3);
    box-shadow: 0 8px 32px rgba(13,122,104,0.05);
    transform: translateY(-2px);
  }
  .level-icon {
    font-size: 1.8rem;
    margin-bottom: 6px;
  }
  .level-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
  }
  .app-container.light .level-name {
    color: #0a1210;
  }
  .level-words {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.3);
    margin: 3px 0 8px;
  }
  .app-container.light .level-words {
    color: rgba(0,0,0,0.3);
  }
  .level-start-btn {
    padding: 5px 12px;
    border-radius: 16px;
    border: 1px solid rgba(13,122,104,0.2);
    background: transparent;
    font-size: 0.6rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  .level-start-btn:hover {
    background: rgba(13,122,104,0.1);
  }
  .home-footer-text {
    text-align: center;
    margin-top: 32px;
    color: rgba(255,255,255,0.15);
    font-size: 0.75rem;
  }
  .app-container.light .home-footer-text {
    color: rgba(0,0,0,0.15);
  }
  
  .learn-page {
    animation: fadeIn 0.3s ease;
  }
  
  .mobile-menu-btn {
    display: none;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    margin-bottom: 12px;
    font-size: 0.85rem;
    width: 100%;
    text-align: left;
  }
  .app-container.light .mobile-menu-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: rgba(0,0,0,0.6);
  }
  
  .controls-bar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .level-selector {
    display: flex;
    gap: 3px;
    padding: 3px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.04);
    flex-wrap: wrap;
  }
  .app-container.light .level-selector {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .level-btn {
    padding: 5px 11px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.4);
    font-size: 0.7rem;
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
    min-width: 120px;
  }
  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.15);
    font-size: 0.85rem;
  }
  .app-container.light .search-icon {
    color: rgba(0,0,0,0.15);
  }
  .search-input {
    width: 100%;
    padding: 7px 10px 7px 32px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: #fff;
    font-size: 0.8rem;
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
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255,255,255,0.2);
    cursor: pointer;
    padding: 4px;
  }
  .app-container.light .search-clear {
    color: rgba(0,0,0,0.2);
  }
  .view-controls {
    display: flex;
    gap: 3px;
    padding: 3px;
    background: rgba(255,255,255,0.03);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.04);
    align-items: center;
    flex-wrap: wrap;
  }
  .app-container.light .view-controls {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .view-btn {
    padding: 5px 8px;
    border-radius: 5px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
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
  .view-btn.game-btn {
    color: #fbbf24;
  }
  .view-btn.game-btn:hover {
    background: rgba(251,191,36,0.1);
  }
  .view-btn.delete-btn {
    color: #ff6b6b;
  }
  .view-btn.delete-btn:hover {
    background: rgba(255,70,70,0.1);
  }
  .view-btn.back-home-btn {
    color: #4db8a8;
  }
  
  .stats-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  .app-container.light .stats-bar {
    background: rgba(255,255,255,0.8);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    min-width: 80px;
  }
  .stat-number {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
  }
  .app-container.light .stat-number {
    color: #0a1210;
  }
  .stat-label {
    font-size: 0.55rem;
    color: rgba(255,255,255,0.3);
    font-weight: 500;
  }
  .app-container.light .stat-label {
    color: rgba(0,0,0,0.3);
  }
  .stat-divider {
    width: 1px;
    height: 12px;
    background: rgba(255,255,255,0.06);
  }
  .app-container.light .stat-divider {
    background: rgba(0,0,0,0.06);
  }
  
  .results-info {
    padding: 4px 0;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.2);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .app-container.light .results-info {
    color: rgba(0,0,0,0.2);
  }
  .loading-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .word-grid {
    display: grid;
    gap: 12px;
    margin-bottom: 16px;
  }
  .word-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .word-grid.list {
    grid-template-columns: 1fr;
  }
  .word-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 14px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .word-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #0d7a68, #4db8a8);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .word-card:hover::before {
    opacity: 1;
  }
  .app-container.light .word-card {
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  }
  .word-card:active {
    transform: scale(0.98);
  }
  .word-card:hover {
    transform: translateY(-2px);
    border-color: rgba(13,122,104,0.2);
    box-shadow: 0 6px 20px rgba(13,122,104,0.08);
  }
  .app-container.light .word-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }
  
  .word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .word-number {
    font-size: 0.5rem;
    font-weight: 600;
    color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.03);
    padding: 2px 8px;
    border-radius: 8px;
  }
  .app-container.light .word-number {
    color: rgba(0,0,0,0.15);
    background: rgba(0,0,0,0.03);
  }
  .word-actions-top {
    display: flex;
    gap: 3px;
    align-items: center;
  }
  .sound-btn {
    padding: 4px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
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
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  .fav-btn {
    padding: 4px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
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
  
  .word-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    padding: 6px 0;
  }
  .hanzi {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
  }
  .app-container.light .hanzi {
    color: #0a1210;
  }
  .pinyin {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.2);
    margin-top: 2px;
  }
  .app-container.light .pinyin {
    color: rgba(0,0,0,0.2);
  }
  
  .translations-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4px;
    margin-bottom: 10px;
  }
  .translation-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 8px;
    padding: 6px 8px;
    transition: all 0.3s;
  }
  .app-container.light .translation-card {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .translation-card:hover {
    border-color: rgba(13,122,104,0.15);
  }
  .translation-card.lao { border-color: rgba(139,92,246,0.15); }
  .translation-card.english { border-color: rgba(59,130,246,0.15); }
  .translation-card.thai { border-color: rgba(239,68,68,0.15); }
  
  .translation-header {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 2px;
  }
  .lang-flag {
    font-size: 0.5rem;
  }
  .lang-name {
    font-size: 0.45rem;
    font-weight: 600;
    color: rgba(255,255,255,0.2);
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .app-container.light .lang-name {
    color: rgba(0,0,0,0.2);
  }
  .translation-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3px;
  }
  .translation-text {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.7);
    flex: 1;
    min-width: 0;
    word-break: break-word;
  }
  .app-container.light .translation-text {
    color: rgba(0,0,0,0.7);
  }
  .mini-speak {
    padding: 2px;
    border-radius: 3px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .app-container.light .mini-speak {
    color: rgba(0,0,0,0.1);
  }
  .mini-speak:hover:not(.disabled) {
    color: #4db8a8;
    background: rgba(13,122,104,0.05);
  }
  .mini-speak.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .word-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.04);
    gap: 6px;
  }
  .app-container.light .word-footer {
    border-top: 1px solid rgba(0,0,0,0.04);
  }
  .copy-btn {
    padding: 3px 10px;
    border-radius: 5px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.3);
    font-size: 0.55rem;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 1;
    justify-content: center;
  }
  .app-container.light .copy-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: rgba(0,0,0,0.3);
  }
  .copy-btn:hover {
    background: rgba(13,122,104,0.1);
    color: #4db8a8;
    border-color: rgba(13,122,104,0.2);
  }
  .copy-btn.copied {
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
  }
  .word-level {
    font-size: 0.45rem;
    color: rgba(255,255,255,0.15);
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    background: rgba(255,255,255,0.03);
  }
  .app-container.light .word-level {
    color: rgba(0,0,0,0.15);
    background: rgba(0,0,0,0.03);
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: rgba(255,255,255,0.2);
  }
  .app-container.light .empty-state {
    color: rgba(0,0,0,0.2);
  }
  .empty-state button {
    margin-top: 12px;
    padding: 6px 16px;
    border-radius: 6px;
    border: 1px solid rgba(13,122,104,0.2);
    background: rgba(13,122,104,0.1);
    color: #4db8a8;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.85rem;
  }
  .empty-state button:hover {
    background: rgba(13,122,104,0.2);
  }
  
  .game-container {
    max-width: 500px;
    margin: 0 auto;
    animation: fadeIn 0.3s ease;
    padding: 0 8px;
  }
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    gap: 10px;
  }
  .game-back-btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .app-container.light .game-back-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.04);
    color: rgba(0,0,0,0.6);
  }
  .game-back-btn:hover {
    background: rgba(13,122,104,0.1);
    color: #4db8a8;
  }
  .game-score-display {
    display: flex;
    align-items: baseline;
    gap: 3px;
    font-weight: 700;
    color: #fbbf24;
    font-size: 1rem;
  }
  .game-score-label {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.3);
  }
  .app-container.light .game-score-label {
    color: rgba(0,0,0,0.3);
  }
  .game-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 16px;
  }
  .app-container.light .game-card {
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(0,0,0,0.06);
  }
  .game-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .game-progress-bar {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
  }
  .app-container.light .game-progress-bar {
    background: rgba(0,0,0,0.06);
  }
  .game-progress-bar > div {
    height: 100%;
    background: linear-gradient(90deg, #0d7a68, #4db8a8);
    border-radius: 2px;
    transition: width 0.3s;
  }
  .game-progress-text {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.3);
    white-space: nowrap;
  }
  .app-container.light .game-progress-text {
    color: rgba(0,0,0,0.3);
  }
  
  .game-lang-selector {
    display: flex;
    gap: 5px;
    margin-bottom: 12px;
    justify-content: center;
  }
  .game-lang-btn {
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.4);
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
  }
  .app-container.light .game-lang-btn {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.03);
    color: rgba(0,0,0,0.4);
  }
  .game-lang-btn:hover {
    border-color: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7);
  }
  .app-container.light .game-lang-btn:hover {
    border-color: rgba(0,0,0,0.15);
    color: rgba(0,0,0,0.7);
  }
  .game-lang-btn.active {
    background: rgba(13,122,104,0.15);
    border-color: rgba(13,122,104,0.2);
    color: #4db8a8;
  }
  .app-container.light .game-lang-btn.active {
    background: rgba(13,122,104,0.1);
    border-color: rgba(13,122,104,0.15);
    color: #0d7a68;
  }
  
  .game-question {
    text-align: center;
    padding: 16px;
    background: rgba(255,255,255,0.02);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.04);
    margin-bottom: 16px;
  }
  .app-container.light .game-question {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .game-hanzi {
    font-size: 2.8rem;
    font-weight: 700;
    color: #fff;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.3s;
    cursor: pointer;
  }
  .app-container.light .game-hanzi {
    color: #0a1210;
  }
  .game-hanzi:hover {
    color: #4db8a8;
  }
  .game-play-icon {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.15);
    opacity: 0.4;
    transition: opacity 0.3s;
  }
  .game-hanzi:hover .game-play-icon {
    opacity: 1;
  }
  .game-pinyin {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.3);
    margin-top: 4px;
  }
  .app-container.light .game-pinyin {
    color: rgba(0,0,0,0.3);
  }
  .game-hint {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.2);
    margin-top: 6px;
  }
  .app-container.light .game-hint {
    color: rgba(0,0,0,0.2);
  }
  
  .game-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
  }
  .game-option {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    word-break: break-word;
  }
  .app-container.light .game-option {
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(0,0,0,0.02);
    color: rgba(0,0,0,0.7);
  }
  .game-option:hover:not(:disabled) {
    background: rgba(255,255,255,0.06);
    transform: scale(1.02);
  }
  .app-container.light .game-option:hover:not(:disabled) {
    background: rgba(0,0,0,0.06);
  }
  .game-option.correct {
    background: rgba(13,122,104,0.2);
    border-color: #0d7a68;
    color: #4db8a8;
  }
  .game-option:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .game-result {
    text-align: center;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 0.9rem;
  }
  .game-result.correct {
    background: rgba(13,122,104,0.08);
    border: 1px solid rgba(13,122,104,0.1);
    color: #4db8a8;
  }
  .game-result.wrong {
    background: rgba(255,70,70,0.06);
    border: 1px solid rgba(255,70,70,0.08);
    color: #ff6b6b;
  }
  
  .game-next-btn {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: none;
    background: rgba(13,122,104,0.2);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;
  }
  .app-container.light .game-next-btn {
    color: #0a1210;
  }
  .game-next-btn:hover {
    background: rgba(13,122,104,0.35);
  }
  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    margin-top: 16px;
    padding: 8px;
    background: rgba(255,255,255,0.02);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.04);
    flex-wrap: wrap;
  }
  .app-container.light .pagination {
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .page-btn {
    padding: 5px 8px;
    border-radius: 5px;
    border: 1px solid rgba(255,255,255,0.06);
    background: transparent;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.75rem;
  }
  .app-container.light .page-btn {
    border: 1px solid rgba(0,0,0,0.06);
    color: rgba(0,0,0,0.3);
  }
  .page-btn:hover:not(:disabled) {
    background: rgba(13,122,104,0.1);
    color: #4db8a8;
  }
  .page-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
  .page-numbers {
    display: flex;
    gap: 2px;
  }
  .page-num {
    padding: 3px 8px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.7rem;
  }
  .app-container.light .page-num {
    color: rgba(0,0,0,0.3);
  }
  .page-num:hover {
    background: rgba(255,255,255,0.04);
  }
  .app-container.light .page-num:hover {
    background: rgba(0,0,0,0.04);
  }
  .page-num.active {
    background: rgba(13,122,104,0.15);
    color: #4db8a8;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 60px 20px;
    color: rgba(255,255,255,0.2);
  }
  .app-container.light .loading-state {
    color: rgba(0,0,0,0.2);
  }
  .loading-state .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(13,122,104,0.1);
    border-top-color: #0d7a68;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .scroll-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 8px;
    border-radius: 50%;
    border: none;
    background: rgba(13,122,104,0.9);
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(13,122,104,0.3);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .scroll-top:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(13,122,104,0.4);
  }
  
  @media (max-width: 1024px) {
    .home-levels {
      grid-template-columns: repeat(3, 1fr);
    }
    .word-grid.grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
    .controls-bar {
      gap: 8px;
    }
  }
  
  @media (max-width: 768px) {
    .header {
      padding: 10px 12px;
    }
    .header-brand {
      font-size: 0.95rem;
    }
    .brand-badge {
      padding: 1px 6px;
      font-size: 0.45rem;
    }
    .main-content {
      padding: 12px;
    }
    .mobile-menu-btn {
      display: block;
    }
    .controls-bar {
      display: none;
      flex-direction: column;
      position: fixed;
      left: 0;
      right: 0;
      top: 52px;
      background: rgba(10,18,16,0.95);
      border-bottom: 1px solid rgba(255,255,255,0.04);
      z-index: 99;
      padding: 12px;
      gap: 8px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .controls-bar[style*="display: none"] {
      display: none !important;
    }
    .app-container.light .controls-bar {
      background: rgba(255,255,255,0.95);
    }
    .level-selector {
      gap: 2px;
      padding: 2px;
      justify-content: center;
    }
    .level-btn {
      padding: 4px 8px;
      font-size: 0.65rem;
    }
    .search-wrapper {
      min-width: 100%;
    }
    .view-controls {
      gap: 2px;
      padding: 2px;
      justify-content: center;
    }
    .view-btn {
      padding: 4px 6px;
    }
    .home-title {
      font-size: 1.8rem;
    }
    .home-levels {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .word-grid.grid {
      grid-template-columns: 1fr;
    }
    .word-card {
      padding: 12px;
    }
    .hanzi {
      font-size: 1.5rem;
    }
    .stats-bar {
      gap: 8px;
      padding: 8px 10px;
    }
    .stat-item {
      gap: 3px;
    }
    .stat-number {
      font-size: 0.8rem;
    }
    .stat-label {
      font-size: 0.5rem;
    }
    .game-container {
      padding: 0;
    }
    .game-options {
      grid-template-columns: 1fr;
    }
    .game-hanzi {
      font-size: 2.2rem;
    }
    .pagination {
      gap: 2px;
      padding: 6px;
    }
  }
  
  @media (max-width: 480px) {
    .header {
      padding: 8px 10px;
    }
    .header-brand {
      font-size: 0.85rem;
      gap: 4px;
    }
    .brand-badge {
      display: none;
    }
    .main-content {
      padding: 8px;
    }
    .home-hero {
      margin-bottom: 20px;
    }
    .home-title {
      font-size: 1.5rem;
    }
    .home-sub {
      font-size: 0.9rem;
    }
    .home-levels {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .home-level-card {
      padding: 12px 10px;
    }
    .level-icon {
      font-size: 1.6rem;
      margin-bottom: 4px;
    }
    .level-name {
      font-size: 0.8rem;
    }
    .level-words {
      font-size: 0.6rem;
    }
    .level-start-btn {
      padding: 4px 10px;
      font-size: 0.55rem;
    }
    .controls-bar {
      top: 50px;
      padding: 10px;
      gap: 6px;
    }
    .mobile-menu-btn {
      padding: 6px 10px;
      font-size: 0.8rem;
    }
    .level-selector {
      gap: 2px;
      padding: 2px;
    }
    .level-btn {
      padding: 3px 6px;
      font-size: 0.6rem;
    }
    .search-input {
      padding: 6px 10px 6px 28px;
      font-size: 0.75rem;
    }
    .search-icon {
      font-size: 0.7rem;
    }
    .word-grid {
      gap: 8px;
    }
    .word-card {
      padding: 10px;
    }
    .word-header {
      margin-bottom: 6px;
    }
    .hanzi {
      font-size: 1.4rem;
    }
    .pinyin {
      font-size: 0.6rem;
    }
    .translations-grid {
      gap: 3px;
      margin-bottom: 8px;
    }
    .translation-card {
      padding: 4px 6px;
    }
    .translation-text {
      font-size: 0.6rem;
    }
    .word-footer {
      padding-top: 6px;
    }
    .stats-bar {
      gap: 6px;
      padding: 6px 8px;
    }
    .stat-number {
      font-size: 0.75rem;
    }
    .stat-label {
      font-size: 0.45rem;
    }
    .game-card {
      padding: 12px;
    }
    .game-hanzi {
      font-size: 2rem;
    }
    .game-option {
      padding: 10px;
      font-size: 0.8rem;
    }
    .scroll-top {
      bottom: 16px;
      right: 16px;
      padding: 6px;
    }
    .pagination {
      gap: 2px;
      padding: 4px;
    }
    .page-btn, .page-num {
      font-size: 0.65rem;
      padding: 2px 6px;
    }
  }
`;
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineCopy, AiOutlineCheck, AiOutlineSearch, AiOutlineClose,
  AiOutlineSun, AiOutlineMoon, AiOutlineLoading3Quarters,
  AiOutlineLeft, AiOutlineRight, AiOutlineStar, AiFillStar,
  AiOutlineHome, AiOutlineBook, AiOutlineThunderbolt,
  AiOutlineTrophy, AiOutlineFire, AiOutlineHeart,
  AiOutlineDelete, AiOutlineMenu,
  AiOutlineFlag, AiOutlineBulb, AiOutlinePlayCircle,
  AiOutlineEye, AiOutlineEyeInvisible
} from "react-icons/ai";
import {
  BiVolumeFull, BiWorld, BiBookOpen, BiTargetLock,
  BiFilterAlt, BiGridAlt, BiListUl
} from "react-icons/bi";
import {
  HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineChartBar,
  HiOutlineSparkles, HiOutlineClock
} from "react-icons/hi";
import {
  MdOutlineTranslate, MdOutlineSchool, MdOutlineFeedback,
  MdOutlineAutoStories, MdOutlineSlideshow
} from "react-icons/md";
import {
    IoCloseSharp,
  IoLanguageOutline, IoRocketOutline, IoStarOutline
} from "react-icons/io5";
import { Image } from "@heroui/image";
import { SiFoodpanda, SiHomebridge } from "react-icons/si";

const VITE_OMS_HSK_CN = import.meta.env.VITE_OMS_HSK_CN;
const API_URL = VITE_OMS_HSK_CN;

// ============ TYPES ============
interface Word {
  uid: string;
  displayNumber: number;
  hanzi: string;
  pinyin: string;
  english: string;
  thai: string;
  lao: string;
  hsk_level: number | null;
}

interface StudyStats {
  correctCount: number;
  incorrectCount: number;
  lastStudied: string;
  srsStage: number;
  nextReview: string;
  word?: Word;
}

// ============ NORMALIZATION ============
const normalizeVocabWord = (raw: any): Word => ({
  uid: `hsk${raw.hsk_level}-${raw.hsk_number}`,
  displayNumber: raw.hsk_number,
  hanzi: raw.hanzi || "",
  pinyin: raw.pinyin || "",
  english: raw.english || "",
  thai: raw.thai || "",
  lao: raw.lao || "",
  hsk_level: raw.hsk_level,
});

const normalizeNumberWord = (raw: any): Word => ({
  uid: `num-${raw.number}`,
  displayNumber: raw.number,
  hanzi: raw.hanzi || "",
  pinyin: raw.pinyin || "",
  english: raw.english || "",
  thai: raw.thai || "",
  lao: raw.lao || "",
  hsk_level: null,
});

const isGameReady = (w: Word) => !!(w?.hanzi && w?.pinyin && w?.english?.trim() && w?.thai?.trim() && w?.lao?.trim());

// ============ TEXT TO SPEECH ============
const SPEAKABLE_LANGS: Record<string, string> = { zh: "zh-CN", en: "en-US", th: "th-TH" };

const speak = (text: string, lang: string = "zh", rate: number = 0.65) => {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const bcp47 = SPEAKABLE_LANGS[lang] || "en-US";
  utterance.lang = bcp47;
  utterance.rate = rate;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith(bcp47.split("-")[0]));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

const playSound = (type: 'correct' | 'wrong' | 'click' | 'complete') => {
  console.log(`sound: ${type}`);
};

// ============ SPACED REPETITION ============
const SRS_INTERVALS_DAYS = [0, 1, 2, 4, 7, 14, 30, 90];
const MAX_SRS_STAGE = SRS_INTERVALS_DAYS.length - 1;

const computeNextReview = (stage: number): string => {
  const days = SRS_INTERVALS_DAYS[Math.min(Math.max(stage, 0), MAX_SRS_STAGE)];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

// ============ LEVEL DATA ============
const HSK_LEVELS = [
  { id: "numbers", label: "Numbers", shortLabel: "NUM", icon: BiBookOpen, words: 18, color: "#FF6B6B", bgGradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" },
  { level: 1, label: "HSK Level 1", shortLabel: "1", icon: HiOutlineSparkles, words: 150, color: "#4ECDC4", bgGradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)" },
  { level: 2, label: "HSK Level 2", shortLabel: "2", icon: HiOutlineAcademicCap, words: 150, color: "#45B7D1", bgGradient: "linear-gradient(135deg, #45B7D1 0%, #4A90E2 100%)" },
  { level: 3, label: "HSK Level 3", shortLabel: "3", icon: IoLanguageOutline, words: 300, color: "#A78BFA", bgGradient: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)" },
  { level: 4, label: "HSK Level 4", shortLabel: "4", icon: IoRocketOutline, words: 600, color: "#F59E0B", bgGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" },
  { level: 5, label: "HSK Level 5", shortLabel: "5", icon: HiOutlineLightningBolt, words: 1300, color: "#10B981", bgGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)" },
  { level: 6, label: "HSK Level 6", shortLabel: "6", icon: AiOutlineTrophy, words: 2500, color: "#8B5CF6", bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" },
];

const ITEMS_PER_PAGE = 20;
const API_BATCH_LIMIT = 50;
const GAME_POOL_CAP = 200;

// ============ API HELPERS ============
async function apiFetchVocabularyRaw(level: string | number, offset: number, limit: number, search = "") {
  let url = `${API_URL}?type=vocabulary&limit=${limit}&offset=${offset}`;
  if (level !== "all") url += `&level=${level}`;
  if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
  const res = await fetch(url);
  return res.json();
}

async function apiFetchNumbersRaw(limit = API_BATCH_LIMIT, offset = 0, search = "") {
  let url = `${API_URL}?type=numbers&limit=${limit}&offset=${offset}`;
  if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
  const res = await fetch(url);
  return res.json();
}

// ============ MAIN COMPONENT ============
export default function ChineseVocabularyApp() {
  const [levelWords, setLevelWords] = useState<Word[]>([]);
  const [numbers, setNumbers] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | number>("all");
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Word[]>([]);
  const [studyStats, setStudyStats] = useState<Map<string, StudyStats>>(new Map());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentView, setCurrentView] = useState<"home" | "learn" | "gameMenu" | "game">("home");
  const [gameLoading, setGameLoading] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [gameIndex, setGameIndex] = useState(0);
  const [gameOptions, setGameOptions] = useState<string[]>([]);
  const [gameAnswered, setGameAnswered] = useState(false);
  const [gameCorrect, setGameCorrect] = useState(false);
  const [gameLanguage, setGameLanguage] = useState<"en" | "th" | "lo">("en");
  const [gameResult, setGameResult] = useState<{ score: number; total: number } | null>(null);
  const [gameNotice, setGameNotice] = useState("");
  const [gameLevelToPlay, setGameLevelToPlay] = useState<string | number>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [presentationRevealed, setPresentationRevealed] = useState(false);
  const [gameAutoNextTimer, setGameAutoNextTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Map<string, { list: Word[]; total: number }>>(new Map());
  const numbersLoadedRef = useRef(false);

  // ============ DETECT MOBILE ============
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ============ FETCH FUNCTIONS ============
  const fetchNumbers = useCallback(async () => {
    if (numbersLoadedRef.current) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError(false);
    try {
      const data = await apiFetchNumbersRaw(API_BATCH_LIMIT, 0, "");
      if (data.success) {
        const normalized = data.data.map(normalizeNumberWord);
        numbersLoadedRef.current = true;
        setNumbers(normalized);
        setTotalWords(data.total_count);
        setTotalPages(Math.max(1, Math.ceil(data.total_count / ITEMS_PER_PAGE)));
      } else {
        setLoadError(true);
      }
    } catch (error) {
      console.error("Failed to fetch numbers:", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWords = useCallback(async (level: string | number = "all", page = 1, searchQuery = "") => {
    const cacheKey = `${level}|${page}|${searchQuery.trim().toLowerCase()}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setLevelWords(cached.list);
      setTotalWords(cached.total);
      setTotalPages(Math.max(1, Math.ceil(cached.total / ITEMS_PER_PAGE)));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError(false);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const data = await apiFetchVocabularyRaw(level, offset, ITEMS_PER_PAGE, searchQuery);
      if (data.success) {
        const normalized: Word[] = data.all_words.map(normalizeVocabWord);
        cacheRef.current.set(cacheKey, { list: normalized, total: data.total_count });
        setLevelWords(normalized);
        setTotalWords(data.total_count);
        setTotalPages(Math.max(1, Math.ceil(data.total_count / ITEMS_PER_PAGE)));
      } else {
        setLoadError(true);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ LIFECYCLE ============
  useEffect(() => {
    if (currentView === "home" || currentView === "gameMenu") {
      setIsLoading(false);
      return;
    }
    setCurrentPage(1);
    if (selectedLevel === "numbers") fetchNumbers();
    else fetchWords(selectedLevel, 1);
  }, [currentView, selectedLevel, fetchNumbers, fetchWords]);

  useEffect(() => {
    if (currentView === "home" || currentView === "gameMenu" || selectedLevel === "numbers") return;
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchWords(selectedLevel, 1, search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, currentView, selectedLevel, fetchWords]);

  useEffect(() => {
    if (currentView === "home" || currentView === "gameMenu" || selectedLevel === "numbers") return;
    fetchWords(selectedLevel, currentPage, search);
  }, [currentPage, currentView, selectedLevel, fetchWords, search]);

  useEffect(() => {
    if (containerRef.current && currentView !== "home") {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage, currentView]);

  useEffect(() => {
    const saved = localStorage.getItem("hsk_favorites_v3");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        setFavorites([]);
      }
    }
    const savedStats = localStorage.getItem("hsk_stats_v2");
    if (savedStats) {
      try {
        setStudyStats(new Map(JSON.parse(savedStats)));
      } catch {
        setStudyStats(new Map());
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hsk_favorites_v3", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("hsk_stats_v2", JSON.stringify(Array.from(studyStats.entries())));
  }, [studyStats]);

  // ============ NUMBERS PAGINATION ============
  const numbersPage = useMemo(() => {
    if (selectedLevel !== "numbers") return null;
    let list = numbers;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.hanzi.includes(q) ||
          w.pinyin.toLowerCase().includes(q) ||
          w.english.toLowerCase().includes(q) ||
          w.thai.includes(q) ||
          w.lao.includes(q) ||
          w.displayNumber.toString().includes(q)
      );
    }
    return list;
  }, [numbers, search, selectedLevel]);

  useEffect(() => {
    if (numbersPage) {
      setTotalWords(numbersPage.length);
      setTotalPages(Math.max(1, Math.ceil(numbersPage.length / ITEMS_PER_PAGE)));
    }
  }, [numbersPage]);

  const pageWords: Word[] = useMemo(() => {
    if (selectedLevel === "numbers") {
      if (!numbersPage) return [];
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return numbersPage.slice(start, start + ITEMS_PER_PAGE);
    }
    return levelWords;
  }, [selectedLevel, numbersPage, currentPage, levelWords]);

  const filteredFavorites = useMemo(() => {
    if (!search.trim()) return favorites;
    const q = search.toLowerCase().trim();
    return favorites.filter(
      (w) => w.hanzi.includes(q) || w.pinyin.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || w.thai.includes(q) || w.lao.includes(q)
    );
  }, [favorites, search]);

  const wordsToRender = showFavorites ? filteredFavorites : pageWords;

  // ============ SPACED REPETITION QUEUE ============
  const dueReviewWords = useMemo(() => {
    const now = new Date();
    const map = new Map<string, Word>();
    studyStats.forEach((stat, uid) => {
      if (stat?.word && stat.nextReview && new Date(stat.nextReview) <= now) {
        map.set(uid, stat.word);
      }
    });
    return Array.from(map.values());
  }, [studyStats]);

  // ============ HANDLERS ============
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSound('click');
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleSpeak = (text: string, id: string, lang: string = "zh", rate: number = 0.65) => {
    setSpeakingId(id);
    speak(text, lang, rate);
    playSound('click');
    setTimeout(() => setSpeakingId(null), 2000);
  };

  const isFavorited = (uid: string) => favorites.some((f) => f.uid === uid);

  const toggleFavorite = (word: Word) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.uid === word.uid);
      playSound(exists ? 'click' : 'correct');
      return exists ? prev.filter((f) => f.uid !== word.uid) : [...prev, word];
    });
  };

  const clearAllFavorites = () => {
    if (confirm("Clear all favorites? This can't be undone.")) {
      setFavorites([]);
      playSound('click');
    }
  };

  const goToLevel = (level: string | number) => {
    setShowFavorites(false);
    setSelectedLevel(level);
    playSound('click');
  };

  // ============ PRESENTATION MODE ============
  const enterPresentationMode = () => {
    const deck = showFavorites ? filteredFavorites : pageWords;
    if (deck.length === 0) return;
    setPresentationIndex(0);
    setPresentationRevealed(false);
    setPresentationMode(true);
    setSidebarOpen(false);
    playSound('click');
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const exitPresentationMode = () => {
    setPresentationMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    playSound('click');
  };

  const presentationNext = () => {
    const deck = showFavorites ? filteredFavorites : pageWords;
    setPresentationRevealed(false);
    setPresentationIndex((i) => Math.min(i + 1, Math.max(deck.length - 1, 0)));
    playSound('click');
  };

  const presentationPrev = () => {
    setPresentationRevealed(false);
    setPresentationIndex((i) => Math.max(i - 1, 0));
    playSound('click');
  };

  useEffect(() => {
    if (!presentationMode) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") presentationNext();
      else if (e.key === "ArrowLeft") presentationPrev();
      else if (e.key === " ") { e.preventDefault(); setPresentationRevealed((r) => !r); }
      else if (e.key === "Escape") exitPresentationMode();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [presentationMode, pageWords, filteredFavorites, showFavorites]);

  // ============ GAME LOGIC ============
  const buildGamePool = async (level: string | number): Promise<Word[]> => {
    if (level === "numbers") {
      if (numbers.length) return numbers;
      const raw = await apiFetchNumbersRaw(API_BATCH_LIMIT, 0, "");
      return raw.success ? raw.data.map(normalizeNumberWord) : [];
    }
    const first = await apiFetchVocabularyRaw(level, 0, API_BATCH_LIMIT, "");
    if (!first.success) return [];
    let pool: Word[] = first.all_words.map(normalizeVocabWord);
    const cap = Math.min(first.total_count, GAME_POOL_CAP);
    const offsets: number[] = [];
    for (let off = API_BATCH_LIMIT; off < cap; off += API_BATCH_LIMIT) offsets.push(off);
    if (offsets.length) {
      const rest = await Promise.all(offsets.map((off) => apiFetchVocabularyRaw(level, off, API_BATCH_LIMIT, "")));
      rest.forEach((r) => {
        if (r.success) pool = pool.concat(r.all_words.map(normalizeVocabWord));
      });
    }
    return pool;
  };

  const startGame = async (level: string | number) => {
    setGameNotice("");
    setGameLevelToPlay(level);
    let pool: Word[];
    if (level === "review") {
      pool = dueReviewWords;
    } else if (showFavorites) {
      pool = favorites;
    } else {
      setGameLoading(true);
      try {
        pool = await buildGamePool(level);
      } catch (error) {
        console.error("Failed to build game pool:", error);
        pool = [];
      } finally {
        setGameLoading(false);
      }
    }
    const uniqueReady = Array.from(new Map(pool.filter(isGameReady).map((w) => [w.uid, w])).values());
    if (uniqueReady.length < 4) {
      setGameNotice(
        level === "review"
          ? "No words due for review yet — keep learning and check back later!"
          : showFavorites
          ? "Favorite at least 4 complete words to practice!"
          : "Not enough words here yet — try another level."
      );
      setTimeout(() => setGameNotice(""), 3500);
      return;
    }
    const shuffled = [...uniqueReady].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    setGameWords(selected);
    setGameIndex(0);
    setGameScore(0);
    setGameAnswered(false);
    setGameCorrect(false);
    setGameResult(null);
    setGameLanguage("en");
    generateGameOptions(selected[0], selected, "en");
    setCurrentView("game");
    playSound('click');
  };

  const generateGameOptions = (word: Word, allWords: Word[], lang: "en" | "th" | "lo") => {
    const langMap: Record<string, keyof Word> = { en: "english", th: "thai", lo: "lao" };
    const correctKey = langMap[lang];
    const correctAnswer = word[correctKey] as string;
    const others = allWords.filter((w) => w.uid !== word.uid && (w[correctKey] as string)?.trim());
    const wrongAnswers = [...others].sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w[correctKey] as string);
    setGameOptions([correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5));
  };

  const handleGameAnswer = (answer: string) => {
    if (gameAnswered) return;
    const langMap: Record<string, keyof Word> = { en: "english", th: "thai", lo: "lao" };
    const correctAnswer = gameWords[gameIndex][langMap[gameLanguage]] as string;
    setGameAnswered(true);
    const correct = answer === correctAnswer;
    setGameCorrect(correct);
    const word = gameWords[gameIndex];

    if (correct) {
      setGameScore((prev) => prev + 1);
      playSound('correct');
      setStudyStats((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(word.uid) || { correctCount: 0, incorrectCount: 0, lastStudied: "", srsStage: 0, nextReview: new Date().toISOString(), word };
        const newStage = Math.min((current.srsStage || 0) + 1, MAX_SRS_STAGE);
        newMap.set(word.uid, {
          correctCount: current.correctCount + 1,
          incorrectCount: current.incorrectCount,
          lastStudied: new Date().toISOString(),
          srsStage: newStage,
          nextReview: computeNextReview(newStage),
          word,
        });
        return newMap;
      });
    } else {
      playSound('wrong');
      setStudyStats((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(word.uid) || { correctCount: 0, incorrectCount: 0, lastStudied: "", srsStage: 0, nextReview: new Date().toISOString(), word };
        newMap.set(word.uid, {
          correctCount: current.correctCount,
          incorrectCount: current.incorrectCount + 1,
          lastStudied: new Date().toISOString(),
          srsStage: 0,
          nextReview: computeNextReview(0),
          word,
        });
        return newMap;
      });
    }

    // AUTO-ADVANCE after 1.5 seconds
    const timer = setTimeout(() => {
      nextGameQuestion();
    }, 1500);
    setGameAutoNextTimer(timer);
  };

  const nextGameQuestion = () => {
    if (gameAutoNextTimer) {
      clearTimeout(gameAutoNextTimer);
      setGameAutoNextTimer(null);
    }

    const nextIndex = gameIndex + 1;
    if (nextIndex >= gameWords.length) {
      setGameResult({ score: gameScore, total: gameWords.length });
      playSound('complete');
      return;
    }
    setGameIndex(nextIndex);
    setGameAnswered(false);
    setGameCorrect(false);
    generateGameOptions(gameWords[nextIndex], gameWords, gameLanguage);
    playSound('click');
  };

  const changeGameLanguage = (lang: "en" | "th" | "lo") => {
    if (gameAnswered) return;
    setGameLanguage(lang);
    if (gameWords.length > 0 && gameIndex < gameWords.length) {
      generateGameOptions(gameWords[gameIndex], gameWords, lang);
      setGameAnswered(false);
      setGameCorrect(false);
    }
    playSound('click');
  };

  // ============ RENDER: HOME ============
  const renderHome = () => {
    const totalPracticed = studyStats.size;
    const totalCorrect = Array.from(studyStats.values()).reduce((sum, s) => sum + s.correctCount, 0);
    const totalAnswers = Array.from(studyStats.values()).reduce((sum, s) => sum + s.correctCount + s.incorrectCount, 0);
    const avgAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

    return (
      <div className="home-layout">
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="hero-badge">
            <IoLanguageOutline size={24} />
            <span>Chinese Learning Platform</span>
          </div>
          <h1 className="hero-heading">
            Master Chinese with<br />
            <span className="gradient-text">Multi-Language Support</span>
          </h1>
          <p className="hero-description">
            Learn 5,000+ Chinese words with translations in English, Thai & Lao.
            Track your progress and practice with interactive, spaced-repetition games.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => setCurrentView("learn")}>
              <AiOutlineBook size={20} />
              Start Learning
            </button>
            <button className="btn-hero-secondary" onClick={() => setCurrentView("gameMenu")}>
              <AiOutlinePlayCircle size={20} />
              Practice Now
            </button>
          </div>
        </motion.div>

        <motion.div className="stats-dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-card-large">
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <AiOutlineFire size={28} />
            </div>
            <div className="stat-content-large">
              <div className="stat-value-large">{totalPracticed}</div>
              <div className="stat-label-large">Words Practiced</div>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <HiOutlineChartBar size={28} />
            </div>
            <div className="stat-content-large">
              <div className="stat-value-large">{avgAccuracy}%</div>
              <div className="stat-label-large">Accuracy Rate</div>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <AiOutlineHeart size={28} />
            </div>
            <div className="stat-content-large">
              <div className="stat-value-large">{favorites.length}</div>
              <div className="stat-label-large">Saved Words</div>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #0d7a68 0%, #0a5f52 100%)' }}>
              <HiOutlineClock size={28} />
            </div>
            <div className="stat-content-large">
              <div className="stat-value-large">{dueReviewWords.length}</div>
              <div className="stat-label-large">Due for Review</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="levels-showcase" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="section-header">
            <h2>Choose Your Level</h2>
            <p>Start from basics or jump to advanced levels</p>
          </div>
          <div className="levels-masonry">
            {HSK_LEVELS.map((level, index) => {
              const Icon = level.icon;
              return (
                <motion.div
                  key={level.id || level.level}
                  className="level-showcase-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => {
                    const levelValue = level.id === "numbers" ? "numbers" : level.level ?? "all";
                    goToLevel(levelValue);
                    setCurrentView("learn");
                  }}
                  style={{ background: level.bgGradient }}
                >
                  <div className="level-showcase-content">
                    <Icon size={40} className="level-showcase-icon" />
                    <h3>{level.label}</h3>
                    <p className="level-word-count">{level.words.toLocaleString()} words</p>
                  </div>
                  <div className="level-showcase-badge">{level.shortLabel}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {dueReviewWords.length > 0 && (
          <motion.div className="review-banner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} onClick={() => startGame("review")}>
            <HiOutlineClock size={32} />
            <div>
              <h3>Words Due for Review</h3>
              <p>{dueReviewWords.length} word{dueReviewWords.length === 1 ? "" : "s"} scheduled by spaced repetition — review now to keep them fresh</p>
            </div>
            <AiOutlineRight size={24} />
          </motion.div>
        )}

        {favorites.length > 0 && (
          <motion.div className="favorites-banner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} onClick={() => {
            setShowFavorites(true);
            setCurrentView("learn");
          }}>
            <IoStarOutline size={32} />
            <div>
              <h3>Your Favorites</h3>
              <p>{favorites.length} saved word{favorites.length === 1 ? "" : "s"} ready to review</p>
            </div>
            <AiOutlineRight size={24} />
          </motion.div>
        )}
      </div>
    );
  };

  // ============ RENDER: GAME MENU ============
  const renderGameMenu = () => (
    <div className="game-menu-layout">
      <motion.div className="game-menu-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="game-hero-icon">
          <HiOutlineLightningBolt size={48} />
        </div>
        <h1>Practice Mode</h1>
        <p>Test your knowledge and track your progress</p>
      </motion.div>

      <motion.div className="game-levels-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {dueReviewWords.length > 0 && (
          <motion.button className="game-review-special" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
            setShowFavorites(false);
            startGame("review");
          }}>
            <HiOutlineClock size={28} />
            <div>
              <h3>Review Due Words</h3>
              <p>{dueReviewWords.length} word{dueReviewWords.length === 1 ? "" : "s"} scheduled by spaced repetition</p>
            </div>
          </motion.button>
        )}

        <div className="game-levels-grid">
          {HSK_LEVELS.map((level, index) => {
            const Icon = level.icon;
            const levelValue = level.id === "numbers" ? "numbers" : level.level ?? "all";
            return (
              <motion.button
                key={level.id || level.level}
                className="game-level-btn"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startGame(levelValue)}
              >
                <div className="game-level-icon-box" style={{ background: level.color }}>
                  <Icon size={28} />
                </div>
                <div className="game-level-text">
                  <h3>{level.label}</h3>
                  <span>{level.words} words</span>
                </div>
                <AiOutlinePlayCircle size={24} className="game-level-play" />
              </motion.button>
            );
          })}
        </div>

        {favorites.length >= 4 && (
          <motion.button className="game-favorites-special" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => {
            setShowFavorites(true);
            startGame("favorites");
          }}>
            <AiFillStar size={28} />
            <div>
              <h3>Practice Favorites</h3>
              <p>{favorites.length} saved words</p>
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* <button className="game-back-home" onClick={() => setCurrentView("home")}>
        <AiOutlineHome size={18} />
        Back to Home
      </button> */}

      {gameNotice && (
        <motion.div className="game-notice-alert" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <AiOutlineBulb size={20} />
          {gameNotice}
        </motion.div>
      )}

      {gameLoading && (
        <div className="game-loading-overlay">
          <AiOutlineLoading3Quarters className="spinner-large" size={48} />
          <p>Preparing your practice session...</p>
        </div>
      )}
    </div>
  );

  // ============ RENDER: GAME ============
  const renderGame = () => {
    if (gameResult) {
      const pct = Math.round((gameResult.score / gameResult.total) * 100);
      const grade = pct >= 90 ? "excellent" : pct >= 70 ? "good" : "okay";
      return (
        <div className="game-result-layout">
          <motion.div className={`result-card ${grade}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="result-trophy">
              {grade === "excellent" && <AiOutlineTrophy size={72} />}
              {grade === "good" && <AiOutlineHeart size={72} />}
              {grade === "okay" && <BiTargetLock size={72} />}
            </div>
            <div className="result-score-display">{pct}%</div>
            <div className="result-details">
              <span>{gameResult.score} / {gameResult.total}</span>
              <span>correct answers</span>
            </div>
            <p className="result-message">
              {grade === "excellent" && "Outstanding! You've mastered this level!"}
              {grade === "good" && "Great work! Keep practicing to reach perfection."}
              {grade === "okay" && "Good effort! More practice will help you improve."}
            </p>
            <div className="result-actions-row">
              <button className="btn-result-secondary" onClick={() => setCurrentView("gameMenu")}>
                <AiOutlineLeft size={18} />
                Choose Level
              </button>
              <button className="btn-result-primary" onClick={() => startGame(gameLevelToPlay)}>
                <AiOutlineThunderbolt size={18} />
                Play Again
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    const currentWord = gameWords[gameIndex];
    if (!currentWord) {
      return (
        <div className="game-loading-screen">
          <AiOutlineLoading3Quarters className="spinner-large" size={56} />
          <p>Loading game...</p>
        </div>
      );
    }

    const langData = {
      en: { label: "English", icon: <BiWorld size={18} /> },
      th: { label: "Thai", icon: <MdOutlineTranslate size={18} /> },
      lo: { label: "Lao", icon: <MdOutlineSchool size={18} /> }
    };
    const langMap: Record<string, keyof Word> = { en: "english", th: "thai", lo: "lao" };
    const correctAnswer = currentWord[langMap[gameLanguage]] as string;

    return (
      <div className="game-play-layout">
        <div className="game-topbar">
          <button className="game-menu-btn" onClick={() => setCurrentView("gameMenu")}>
           <IoCloseSharp size={20} />
          </button>
          <div className="game-progress-display">
            <HiOutlineClock size={18} />
            <span>{gameIndex + 1} / {gameWords.length}</span>
          </div>
          <div className="game-score-chip">
            <AiOutlineTrophy size={18} />
            <span>{gameScore}</span>
          </div>
        </div>

        <div className="game-progress-line">
          <motion.div className="game-progress-bar" initial={{ width: 0 }} animate={{ width: `${((gameIndex + 1) / gameWords.length) * 100}%` }} />
        </div>

        <div className="game-lang-tabs">
          {(["en", "th", "lo"] as const).map((lang) => (
            <motion.button
              key={lang}
              className={`lang-tab ${gameLanguage === lang ? "active" : ""}`}
              onClick={() => changeGameLanguage(lang)}
              whileTap={{ scale: 0.95 }}
              disabled={gameAnswered}
            >
              {langData[lang].icon}
              <span>{langData[lang].label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div className="game-word-spotlight" key={currentWord.uid} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="word-display-zone">
            <div className="hanzi-xl">{currentWord.hanzi}</div>
            <div className="pinyin-xl">{currentWord.pinyin}</div>
          </div>
          <button className={`voice-btn-large ${speakingId === currentWord.uid ? "playing" : ""}`} onClick={() => handleSpeak(currentWord.hanzi, currentWord.uid, "zh", 0.65)}>
            <BiVolumeFull size={20} />
          </button>
        </motion.div>

        <p className="game-instruction">
          Select the correct <strong>{langData[gameLanguage].label}</strong> translation
        </p>

        {/* 2x2 GRID LAYOUT FOR GAME CHOICES */}
        <div className="game-choices-grid">
          {gameOptions.map((option, i) => {
            const isCorrect = option === correctAnswer;
            let btnClass = "game-choice-btn";
            if (gameAnswered && isCorrect) btnClass += " correct-choice";
            if (gameAnswered && !isCorrect && option !== correctAnswer) btnClass += " faded-choice";

            return (
              <motion.button
                key={i}
                className={btnClass}
                onClick={() => handleGameAnswer(option)}
                disabled={gameAnswered}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={!gameAnswered ? { scale: 1.05 } : {}}
                whileTap={!gameAnswered ? { scale: 0.95 } : {}}
              >
                <span className="choice-num">{String.fromCharCode(65 + i)}</span>
                <span className="choice-text">{option}</span>
                {gameAnswered && isCorrect && <AiOutlineCheck size={24} className="choice-check" />}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {gameAnswered && (
            <motion.div
              className={`game-result-banner ${gameCorrect ? "success" : "error"}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <div className="result-banner-content">
                {gameCorrect ? (
                  <>
                    <AiOutlineCheck size={32} />
                    <span>Correct! Next in 1.5s...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineClose size={32} />
                    <div>
                      <span>Incorrect</span>
                      <small>Answer: {correctAnswer}</small>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ============ RENDER: PRESENTATION ============
  const renderPresentation = () => {
    const deck = showFavorites ? filteredFavorites : pageWords;
    const word = deck[presentationIndex];
    return (
      <div className="presentation-overlay">
        <button className="presentation-exit-btn" onClick={exitPresentationMode}>
          <AiOutlineClose size={20} />
          <span>Exit</span>
        </button>
        {word ? (
          <>
            <div className="presentation-counter">{presentationIndex + 1} / {deck.length}</div>
            <motion.div className="presentation-card" key={word.uid} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="presentation-hanzi">{word.hanzi}</div>
              <div className="presentation-pinyin">{word.pinyin}</div>
              <button className="presentation-voice-btn" onClick={() => handleSpeak(word.hanzi, word.uid, "zh", 0.6)}>
                <BiVolumeFull size={20} />
              </button>
              <AnimatePresence>
                {presentationRevealed && (
                  <motion.div className="presentation-translations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div><strong>EN</strong> {word.english || "—"}</div>
                    <div><strong>TH</strong> {word.thai || "—"}</div>
                    <div><strong>LO</strong> {word.lao || "—"}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="presentation-controls">
              <button className="presentation-nav-btn" onClick={presentationPrev} disabled={presentationIndex === 0}>
                <AiOutlineLeft size={26} />
              </button>
              <button className="presentation-reveal-btn" onClick={() => setPresentationRevealed((r) => !r)}>
                {presentationRevealed ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                {presentationRevealed ? "Hide Answer" : "Show Answer"}
              </button>
              <button className="presentation-nav-btn" onClick={presentationNext} disabled={presentationIndex >= deck.length - 1}>
                <AiOutlineRight size={26} />
              </button>
            </div>
            <p className="presentation-hint">Arrow keys to move · Space to reveal · Esc to exit</p>
          </>
        ) : (
          <p className="presentation-empty">No words to present in this list.</p>
        )}
      </div>
    );
  };

  // ============ RENDER: LEARN ============
  const renderLearn = () => {
    if (presentationMode) return renderPresentation();
    return (
      <div className="learn-layout">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="learn-sidebar"
              initial={isMobile ? { x: -280 } : false}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="sidebar-header">
                <h2>
                  <BiFilterAlt size={22} />
                  Filters
                </h2>
                {isMobile && (
                  <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                    <AiOutlineClose size={20} />
                  </button>
                )}
              </div>
              <div className="sidebar-section">
                <h3>Levels</h3>
                <div className="sidebar-levels">
                  <button className={`sidebar-level-btn ${!showFavorites && selectedLevel === "all" ? "active" : ""}`} onClick={() => goToLevel("all")}>
                    All Levels
                  </button>
                  {HSK_LEVELS.map((level) => {
                    const Icon = level.icon;
                    const levelValue = level.id === "numbers" ? "numbers" : level.level ?? "all";
                    return (
                      <button
                        key={level.id || level.level}
                        className={`sidebar-level-btn ${!showFavorites && selectedLevel === levelValue ? "active" : ""}`}
                        onClick={() => goToLevel(levelValue)}
                      >
                        <Icon size={18} />
                        <span>{level.label}</span>
                        <span className="level-count">{level.words}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="sidebar-section">
                <h3>Quick Actions</h3>
                <button className={`sidebar-action-btn ${showFavorites ? "active" : ""}`} onClick={() => setShowFavorites(!showFavorites)}>
                  {showFavorites ? <AiFillStar size={18} /> : <AiOutlineStar size={18} />}
                  <span>Favorites</span>
                  <span className="count-badge">{favorites.length}</span>
                </button>
                {showFavorites && favorites.length > 0 && (
                  <button className="sidebar-action-btn danger" onClick={clearAllFavorites}>
                    <AiOutlineDelete size={18} />
                    <span>Clear All</span>
                  </button>
                )}
                <button className="sidebar-action-btn" onClick={() => setCurrentView("gameMenu")} disabled={gameLoading}>
                  {gameLoading ? (
                    <AiOutlineLoading3Quarters className="spinner-sm" size={18} />
                  ) : (
                    <AiOutlineThunderbolt size={18} />
                  )}
                  <span>Practice</span>
                </button>
                <button className="sidebar-action-btn" onClick={enterPresentationMode}>
                  <MdOutlineSlideshow size={18} />
                  <span>Classroom Mode</span>
                </button>
                <button className="sidebar-action-btn" onClick={() => setCurrentView("home")}>
                  <AiOutlineHome size={18} />
                  <span>Home</span>
                </button>
              </div>
              <div className="sidebar-footer">
                <div className="sidebar-stat">
                  <AiOutlineBook size={16} />
                  <span>{showFavorites ? favorites.length : totalWords} words</span>
                </div>
                <div className="sidebar-stat">
                  <AiFillStar size={16} />
                  <span>{favorites.length} saved</span>
                </div>
                <div className="sidebar-stat">
                  <HiOutlineClock size={16} />
                  <span>{dueReviewWords.length} due for review</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="learn-main">
          <div className="learn-topbar">
            {!sidebarOpen && (
              <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
                <AiOutlineMenu size={20} />
              </button>
            )}
            <div className="search-wrapper-modern">
              {/* <AiOutlineSearch className="search-icon-modern" size={20} /> */}
              <input
                type="text"
                placeholder="Search by hanzi, pinyin, meaning..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-modern"
              />
              {search && (
                <button className="search-clear-modern" onClick={() => setSearch("")}>
                  <AiOutlineClose size={16} />
                </button>
              )}
            </div>
            <div className="view-toggles">
              <button className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid view">
                <BiGridAlt size={20} />
              </button>
              <button className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List view">
                <BiListUl size={20} />
              </button>
              <button className="view-toggle-btn presentation-toggle-btn" onClick={enterPresentationMode} title="Classroom / monitor mode">
                <MdOutlineSlideshow size={20} />
              </button>
            </div>
          </div>

          <div className="learn-content-area">
            {showFavorites ? (
              favorites.length === 0 ? (
                <div className="empty-state-modern">
                  <AiOutlineStar size={64} className="empty-icon-modern" />
                  <h3>No favorites yet</h3>
                  <p>Star words to save them here for quick access</p>
                  <button className="btn-modern-primary" onClick={() => setShowFavorites(false)}>
                    Browse Words
                  </button>
                </div>
              ) : filteredFavorites.length === 0 ? (
                <div className="empty-state-modern">
                  <AiOutlineSearch size={64} className="empty-icon-modern" />
                  <h3>No matches</h3>
                  <p>No favorites match "{search}"</p>
                  <button className="btn-modern-secondary" onClick={() => setSearch("")}>
                    Clear Search
                  </button>
                </div>
              ) : (
                renderWordsList(filteredFavorites)
              )
            ) : isLoading ? (
              <div className={`words-container ${viewMode}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="word-skeleton-modern" key={i} />
                ))}
              </div>
            ) : loadError ? (
              <div className="empty-state-modern">
                <AiOutlineClose size={64} className="empty-icon-modern error" />
                <h3>Failed to load</h3>
                <p>Could not fetch words. Please try again.</p>
                <button className="btn-modern-primary" onClick={() => (selectedLevel === "numbers" ? fetchNumbers() : fetchWords(selectedLevel, currentPage, search))}>
                  Retry
                </button>
              </div>
            ) : pageWords.length === 0 ? (
              <div className="empty-state-modern">
                <AiOutlineSearch size={64} className="empty-icon-modern" />
                <h3>No words found</h3>
                <p>{search ? `No results for "${search}"` : "This level has no words yet"}</p>
                <button className="btn-modern-secondary" onClick={() => setSearch("")}>
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                {renderWordsList(pageWords)}
                {!showFavorites && totalPages > 1 && (
                  <div className="pagination-modern">
                    <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <AiOutlineLeft size={18} />
                    </button>
                    <div className="pagination-info">
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </div>
                    <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <AiOutlineRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============ RENDER: WORDS LIST ============
  function renderWordsList(list: Word[]) {
    return (
      <div className={`words-container ${viewMode}`}>
        {list.map((word, index) => {
          const stats = studyStats.get(word.uid);
          const accuracy = stats && (stats.correctCount + stats.incorrectCount) > 0
            ? Math.round((stats.correctCount / (stats.correctCount + stats.incorrectCount)) * 100)
            : null;
          const isDue = stats?.nextReview && new Date(stats.nextReview) <= new Date();
          return (
            <motion.div
              key={word.uid}
              className="word-card-modern"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              whileHover={{ y: -4 }}
            >
              <div className="word-card-header-modern">
                <span className="word-id-badge">#{word.displayNumber}</span>
                <div className="word-card-actions">
                  {isDue && (
                    <span className="due-chip" title="Due for spaced-repetition review">
                      <HiOutlineClock size={14} />
                      Due
                    </span>
                  )}
                  {accuracy !== null && (
                    <span className="accuracy-chip">
                      <HiOutlineChartBar size={14} />
                      {accuracy}%
                    </span>
                  )}
                  <motion.button className={`fav-btn-modern ${isFavorited(word.uid) ? "active" : ""}`} onClick={() => toggleFavorite(word)} whileTap={{ scale: 0.9 }}>
                    {isFavorited(word.uid) ? <AiFillStar size={22} /> : <AiOutlineStar size={22} />}
                  </motion.button>
                </div>
              </div>

              <div className="chinese-main-section">
                <div className="hanzi-center">{word.hanzi}</div>
                <div className="pinyin-center">{word.pinyin}</div>
                <motion.button className={`voice-main-btn ${speakingId === word.uid ? "pulsing" : ""}`} onClick={() => handleSpeak(word.hanzi, word.uid, "zh", 0.65)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <BiVolumeFull size={16} />
                  <span>Listen</span>
                </motion.button>
              </div>

              <div className="translations-grid">
                <div className="translation-block">
                  <div className="trans-header">
                    <MdOutlineSchool size={16} />
                    <span>Lao</span>
                  </div>
                  <div className="trans-text lao-script">{word.lao || "—"}</div>
                </div>
                <div className="translation-block">
                  <div className="trans-header">
                    <BiWorld size={16} />
                    <span>English</span>
                    {word.english && (
                      <motion.button className="mini-voice-btn" onClick={() => handleSpeak(word.english, word.uid, "en", 0.7)} whileTap={{ scale: 0.9 }}>
                        <BiVolumeFull size={14} />
                      </motion.button>
                    )}
                  </div>
                  <div className="trans-text">{word.english || "—"}</div>
                </div>
                <div className="translation-block">
                  <div className="trans-header">
                    <MdOutlineTranslate size={16} />
                    <span>Thai</span>
                    {word.thai && (
                      <motion.button className="mini-voice-btn" onClick={() => handleSpeak(word.thai, word.uid, "th", 0.7)} whileTap={{ scale: 0.9 }}>
                        <BiVolumeFull size={14} />
                      </motion.button>
                    )}
                  </div>
                  <div className="trans-text thai-script">{word.thai || "—"}</div>
                </div>
              </div>

              <div className="word-card-footer-modern">
                <motion.button className={`copy-btn-modern ${copiedId === word.uid ? "copied" : ""}`} onClick={() => handleCopy(word.hanzi, word.uid)} whileTap={{ scale: 0.95 }}>
                  {copiedId === word.uid ? (
                    <>
                      <AiOutlineCheck size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <AiOutlineCopy size={16} />
                      Copy
                    </>
                  )}
                </motion.button>
                <span className="level-badge-modern">
                  {word.hsk_level ? `HSK ${word.hsk_level}` : "Numbers"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // ============ RENDER: MAIN APP ============
  return (
    <div className={`app-modern ${isDark ? "dark" : "light"}`} ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: ultraModernStyles }} />
      {!presentationMode && (
        <nav className="navbar-modern">
          <div className="navbar-content">
            <div className="navbar-brand" onClick={() => setCurrentView("home")} role="button">
              <Image
                isBlurred
                alt="three leaves logo"
                src="https://res.cloudinary.com/deahgtn57/image/upload/v1785343479/omelett%27s/public/logo/web-app%20logo/ChatGPT_Image_Jul_29_2026_11_37_20_PM_1_kmedoq.png"
                width={50}
                height={50}
                className="rounded-lg shadow-sm block dark:hidden"
              />
              <Image
                isBlurred
                alt="three leaves logo"
                src="https://res.cloudinary.com/deahgtn57/image/upload/v1785342396/omelett%27s/public/logo/web-app%20logo/leave.png"
                width={50}
                height={50}
                className="rounded-lg shadow-sm hidden dark:block"
              />
              <span>Three<span className="text-red-600">|</span><span>Leaves</span></span>
            </div>
            <div className="navbar-actions">
              <button className="navbar-home-btn" onClick={() => setCurrentView("home")} title="Home">
              <SiFoodpanda size={20} />
              </button>
              <button className="theme-switcher" onClick={() => {
                setIsDark(!isDark);
                playSound('click');
              }} title={isDark ? "Light mode" : "Dark mode"}>
                {isDark ? <AiOutlineSun size={22} /> : <AiOutlineMoon size={22} />}
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className="app-content-modern">
        <AnimatePresence mode="wait">
          {currentView === "home" && <div key="home">{renderHome()}</div>}
          {currentView === "learn" && <div key="learn">{renderLearn()}</div>}
          {currentView === "gameMenu" && <div key="gameMenu">{renderGameMenu()}</div>}
          {currentView === "game" && <div key="game">{renderGame()}</div>}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {currentView === "learn" && !showFeedbackForm && !presentationMode && (
          <motion.button
            className="fab-feedback"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFeedbackForm(true)}
          >
            <MdOutlineFeedback size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackForm && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedbackForm(false)}
          >
            <motion.div
              className="modal-content-modern"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setShowFeedbackForm(false)}>
                <AiOutlineClose size={22} />
              </button>
              <div className="modal-header-modern">
                <AiOutlineFlag size={32} />
                <h2>Report Translation</h2>
              </div>
              <div className="modal-notice">
                <AiOutlineBulb size={18} />
                <p>All translations are from Google Translate. Found an error? Let us know!</p>
              </div>
              <textarea
                className="modal-textarea-modern"
                placeholder="Describe the issue: word number, what's wrong, and your suggested correction..."
                rows={6}
              />
              <button className="modal-submit-btn" onClick={() => {
                alert("Thank you! Your feedback has been submitted.");
                setShowFeedbackForm(false);
                playSound('correct');
              }}>
                <AiOutlineCheck size={20} />
                Submit Feedback
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ ULTRA MODERN STYLES ============
const ultraModernStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Thai:wght@400;500;600&family=Noto+Sans+Lao:wght@400;500;600&display=swap');
  
  :root {
    --font-primary: 'Inter', system-ui, sans-serif;
    --font-chinese: 'Noto Sans SC', serif;
    --font-thai: 'Noto Sans Thai', sans-serif;
    --font-lao: 'Noto Sans Lao', sans-serif;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: var(--font-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* ========== THEME VARIABLES ========== */
  .app-modern {
    --bg-primary: #F8F9FB;
    --bg-secondary: #FFFFFF;
    --bg-tertiary: #F1F3F6;
    --bg-hover: #E8EBEF;
    --border: #DFE3E8;
    --border-light: #F0F2F5;
    --text-primary: #0D1117;
    --text-secondary: #57606A;
    --text-tertiary: #8B949E;
    --text-inverse: #FFFFFF;
    --accent: #0969DA;
    --accent-hover: #0550AE;
    --accent-light: #DDF4FF;
    --voice: #0d7a68;
    --voice-hover: #095e4f;
    --voice-light: rgba(13, 122, 104, 0.1);
    --success: #1A7F37;
    --success-light: #D1F4DD;
    --error: #CF222E;
    --error-light: #FFEBE9;
    --warning: #9A6700;
    --warning-light: #FFF8C5;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 32px rgba(0,0,0,0.12);
    --shadow-xl: 0 20px 48px rgba(0,0,0,0.16);
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 18px;
    --radius-full: 9999px;
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }
  
  .app-modern.dark {
    --bg-primary: #0D1117;
    --bg-secondary: #161B22;
    --bg-tertiary: #21262D;
    --bg-hover: #30363D;
    --border: #30363D;
    --border-light: #21262D;
    --text-primary: #E6EDF3;
    --text-secondary: #8B949E;
    --text-tertiary: #6E7681;
    --accent: #2F81F7;
    --accent-hover: #58A6FF;
    --accent-light: #1C2D41;
    --voice: #16a892;
    --voice-hover: #13c2a8;
    --voice-light: rgba(22, 168, 146, 0.16);
    --success: #3FB950;
    --success-light: #1C2D20;
    --error: #F85149;
    --error-light: #2D1517;
    --warning: #D29922;
    --warning-light: #2D2A1A;
  }
  
  /* ========== NAVBAR ========== */
  .navbar-modern {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-sm);
  }
  
  .navbar-content {
    max-width: 1600px;
    margin: 0 auto;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
  }
  
  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .navbar-home-btn, .theme-switcher {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .navbar-home-btn:hover {
    background: var(--voice);
    color: white;
    border-color: var(--voice);
  }
  
  .theme-switcher:hover {
    background: var(--accent);
    color: var(--text-inverse);
    border-color: var(--accent);
    transform: rotate(15deg);
  }
  
  /* ========== MAIN CONTENT ========== */
  .app-content-modern {
    max-width: 1600px;
    margin: 0 auto;
    min-height: calc(100vh - 73px);
  }
  
  /* ========== HOME LAYOUT ========== */
  .home-layout {
    padding: 40px 24px 80px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .hero-section {
    text-align: center;
    margin-bottom: 60px;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    background: var(--accent-light);
    color: var(--accent);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 24px;
  }
  
  .hero-heading {
    font-size: clamp(1.8rem, 5vw, 3.5rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-description {
    font-size: clamp(0.95rem, 2vw, 1.15rem);
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto 32px;
    line-height: 1.6;
  }
  
  .hero-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-hero-primary, .btn-hero-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: clamp(10px, 2vw, 14px) clamp(16px, 3vw, 28px);
    border-radius: var(--radius-lg);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-hero-primary {
    background: var(--accent);
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
  }
  
  .btn-hero-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .btn-hero-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border);
  }
  
  .btn-hero-secondary:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
  }
  
  /* ========== STATS DASHBOARD - MOBILE RESPONSIVE ========== */
  .stats-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
    gap: clamp(12px, 3vw, 24px);
    margin-bottom: 60px;
  }
  
  @media (max-width: 768px) {
    .stats-dashboard {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
  
  @media (max-width: 480px) {
    .stats-dashboard {
      grid-template-columns: 1fr;
      gap: 10px;
      margin-bottom: 40px;
    }
  }
  
  .stat-card-large {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 20px);
    padding: clamp(12px, 2vw, 24px);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    transition: all 0.3s;
  }
  
  .stat-card-large:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
  
  .stat-icon-wrapper {
    width: clamp(44px, 8vw, 64px);
    height: clamp(44px, 8vw, 64px);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  
  .stat-value-large {
    font-size: clamp(1.4rem, 3vw, 2.5rem);
    font-weight: 900;
    line-height: 1;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  
  .stat-label-large {
    font-size: clamp(0.75rem, 1.5vw, 0.9rem);
    color: var(--text-tertiary);
    font-weight: 600;
  }
  
  /* ========== LEVELS MASONRY - MOBILE RESPONSIVE ========== */
  .section-header {
    text-align: center;
    margin-bottom: clamp(24px, 6vw, 40px);
  }
  
  .section-header h2 {
    font-size: clamp(1.4rem, 4vw, 2.5rem);
    font-weight: 800;
    margin-bottom: 12px;
  }
  
  .section-header p {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    color: var(--text-secondary);
  }
  
  .levels-masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
    gap: clamp(12px, 2vw, 20px);
  }
  
  @media (max-width: 768px) {
    .levels-masonry {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
  
  @media (max-width: 480px) {
    .levels-masonry {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }
  
  .level-showcase-card {
    position: relative;
    padding: clamp(16px, 3vw, 32px);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    color: white;
    min-height: clamp(140px, 25vw, 200px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .level-showcase-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .level-showcase-card:hover::before {
    opacity: 1;
  }
  
  .level-showcase-content {
    position: relative;
    z-index: 1;
  }
  
  .level-showcase-icon {
    margin-bottom: clamp(8px, 2vw, 16px);
    font-size: clamp(20px, 5vw, 40px);
  }
  
  .level-showcase-card h3 {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    font-weight: 700;
    margin-bottom: clamp(4px, 1vw, 8px);
  }
  
  .level-word-count {
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    opacity: 0.9;
  }
  
  .level-showcase-badge {
    position: absolute;
    top: clamp(8px, 2vw, 20px);
    right: clamp(8px, 2vw, 20px);
    width: clamp(32px, 8vw, 48px);
    height: clamp(32px, 8vw, 48px);
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: clamp(0.8rem, 2vw, 1.25rem);
  }
  
  /* ========== BANNERS ========== */
  .favorites-banner, .review-banner {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 20px);
    padding: clamp(16px, 3vw, 28px);
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: var(--shadow-md);
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    .favorites-banner, .review-banner {
      flex-direction: column;
      text-align: center;
      padding: 16px 12px;
    }
  }
  
  .favorites-banner:hover {
    border-color: var(--accent);
    transform: translateX(6px);
    box-shadow: var(--shadow-lg);
  }
  
  .review-banner {
    color: var(--voice);
  }
  
  .review-banner:hover {
    border-color: var(--voice);
    transform: translateX(6px);
    box-shadow: var(--shadow-lg);
  }
  
  .favorites-banner h3, .review-banner h3 {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 700;
    margin-bottom: 4px;
    color: var(--text-primary);
  }
  
  .favorites-banner p, .review-banner p {
    color: var(--text-secondary);
    font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  }
  
  /* ========== GAME MENU ========== */
  .game-menu-layout {
    padding: clamp(24px, 5vw, 60px) clamp(12px, 3vw, 24px) 80px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .game-menu-hero {
    text-align: center;
    margin-bottom: clamp(30px, 8vw, 60px);
  }
  
  .game-hero-icon {
    width: clamp(60px, 12vw, 80px);
    height: clamp(60px, 12vw, 80px);
    border-radius: var(--radius-xl);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto clamp(16px, 3vw, 24px);
    box-shadow: var(--shadow-lg);
    font-size: clamp(32px, 6vw, 48px);
  }
  
  .game-menu-hero h1 {
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 900;
    margin-bottom: 12px;
  }
  
  .game-menu-hero p {
    font-size: clamp(0.9rem, 2vw, 1.15rem);
    color: var(--text-secondary);
  }
  
  .game-levels-grid {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 2vw, 14px);
    margin-bottom: clamp(20px, 5vw, 32px);
  }
  
  .game-level-btn {
    display: flex;
    align-items: center;
    gap: clamp(12px, 2vw, 18px);
    padding: clamp(12px, 2vw, 20px) clamp(14px, 3vw, 24px);
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  
  @media (max-width: 480px) {
    .game-level-btn {
      padding: 12px 12px;
    }
  }
  
  .game-level-btn:hover {
    border-color: var(--accent);
    background: var(--bg-hover);
    transform: translateX(8px);
  }
  
  .game-level-icon-box {
    width: clamp(40px, 8vw, 56px);
    height: clamp(40px, 8vw, 56px);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  
  .game-level-text h3 {
    font-size: clamp(0.9rem, 2vw, 1.15rem);
    font-weight: 700;
    margin-bottom: 2px;
  }
  
  .game-level-text span {
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
    color: var(--text-tertiary);
  }
  
  .game-level-play {
    color: var(--text-tertiary);
    transition: all 0.2s;
    margin-left: auto;
  }
  
  .game-level-btn:hover .game-level-play {
    color: var(--accent);
    transform: scale(1.2);
  }
  
  .game-favorites-special {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 22px 26px;
    background: linear-gradient(135deg, #FFD89B 0%, #19547B 100%);
    border: none;
    border-radius: var(--radius-lg);
    color: white;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: var(--shadow-lg);
  }
  
  @media (max-width: 480px) {
    .game-favorites-special {
      flex-direction: column;
      text-align: center;
      padding: 18px 16px;
    }
  }
  
  .game-favorites-special:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-xl);
  }
  
  .game-favorites-special h3 {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  .game-favorites-special p {
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    opacity: 0.9;
  }
  
  .game-back-home {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px auto;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .game-back-home:hover {
    background: var(--bg-hover);
  }
  
  .game-notice-alert {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
    padding: 16px 20px;
    border-radius: var(--radius-md);
    background: var(--warning-light);
    color: var(--warning);
    font-weight: 600;
  }
  
  .game-loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    z-index: 9999;
    color: white;
  }
  
  .spinner-large {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* ========== GAME PLAY ========== */
  .game-play-layout {
    padding: clamp(12px, 3vw, 32px) clamp(8px, 3vw, 24px) 80px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .game-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(10px, 2vw, 20px);
    gap: clamp(4px, 1vw, 8px);
  }
  
  .game-menu-btn {
    width: clamp(36px, 7vw, 48px);
    height: clamp(36px, 7vw, 48px);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .game-menu-btn:hover {
    background: var(--bg-hover);
  }
  
  .game-progress-display, .game-score-chip {
    display: flex;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
    padding: clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 18px);
    border-radius: var(--radius-lg);
    font-weight: 700;
    font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  }
  
  .game-progress-display {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text-primary);
  }
  
  .game-score-chip {
    background: linear-gradient(135deg, #FFD89B 0%, #19547B 100%);
    color: white;
  }
  
  .game-progress-line {
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: clamp(14px, 3vw, 28px);
  }
  
  .game-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.4s ease;
  }
  
  .game-lang-tabs {
    display: flex;
    gap: clamp(6px, 1.5vw, 10px);
    margin-bottom: clamp(16px, 4vw, 32px);
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .lang-tab {
    display: flex;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
    padding: clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 20px);
    border-radius: var(--radius-lg);
    border: 2px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: clamp(0.75rem, 1.5vw, 0.85rem);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .lang-tab:hover:not(:disabled) {
    background: var(--bg-hover);
  }
  
  .lang-tab.active {
    border-color: var(--accent);
    background: var(--accent);
    color: white;
  }
  
  .lang-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .game-word-spotlight {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: clamp(20px, 5vw, 48px) clamp(14px, 3vw, 32px);
    text-align: center;
    margin-bottom: clamp(14px, 3vw, 32px);
    box-shadow: var(--shadow-lg);
  }
  
  .word-display-zone {
    margin-bottom: clamp(12px, 2vw, 20px);
  }
  
  .hanzi-xl {
    font-family: var(--font-chinese);
    font-size: clamp(2.5rem, 10vw, 6rem);
    font-weight: 700;
    line-height: 1;
    color: var(--text-primary);
    margin-bottom: clamp(8px, 2vw, 16px);
  }
  
  .pinyin-xl {
    font-size: clamp(1rem, 2.5vw, 1.75rem);
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .voice-btn-large {
    width: clamp(36px, 7vw, 46px);
    height: clamp(36px, 7vw, 46px);
    border-radius: var(--radius-full);
    border: 2px solid var(--voice);
    background: var(--voice-light);
    color: var(--voice);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    flex-shrink: 0;
    font-size: clamp(14px, 3vw, 20px);
  }
  
  .voice-btn-large:hover {
    background: var(--voice);
    color: white;
    transform: scale(1.1);
  }
  
  .voice-btn-large.playing {
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  .game-instruction {
    text-align: center;
    font-size: clamp(0.85rem, 2vw, 1.15rem);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: clamp(14px, 3vw, 28px);
  }
  
  /* ========== GAME CHOICES 2x2 GRID ========== */
  .game-choices-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(8px, 2vw, 12px);
    margin-bottom: clamp(14px, 3vw, 20px);
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 480px) {
    .game-choices-grid {
      gap: 8px;
      margin-bottom: 12px;
    }
  }
  
  .game-choice-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(6px, 1.5vw, 10px);
    padding: clamp(12px, 2.5vw, 20px) clamp(10px, 2vw, 14px);
    border-radius: var(--radius-lg);
    border: 2px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 600;
    font-size: clamp(0.75rem, 1.8vw, 0.9rem);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    min-height: clamp(100px, 22vw, 120px);
    text-align: center;
  }
  
  @media (max-width: 480px) {
    .game-choice-btn {
      min-height: 90px;
      padding: 10px 8px;
    }
  }
  
  .game-choice-btn:hover:not(:disabled) {
    border-color: var(--accent);
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .choice-num {
    width: clamp(28px, 6vw, 36px);
    height: clamp(28px, 6vw, 36px);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: clamp(0.8rem, 2vw, 1rem);
    flex-shrink: 0;
  }
  
  .choice-text {
    flex: 1;
    word-break: break-word;
    line-height: 1.3;
  }
  
  .choice-check {
    color: var(--success);
    position: absolute;
    top: 6px;
    right: 6px;
    animation: checkPulse 0.5s ease-out;
  }
  
  @keyframes checkPulse {
    from {
      transform: scale(0) rotate(-45deg);
    }
    to {
      transform: scale(1) rotate(0deg);
    }
  }
  
  .game-choice-btn.correct-choice {
    border-color: var(--success);
    background: var(--success-light);
    color: var(--success);
  }
  
  .game-choice-btn.correct-choice .choice-num {
    background: var(--success);
    color: white;
  }
  
  .game-choice-btn.faded-choice {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .game-result-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 2vw, 12px);
    padding: clamp(12px, 2.5vw, 16px) clamp(12px, 2.5vw, 18px);
    border-radius: var(--radius-lg);
    margin-top: clamp(12px, 3vw, 20px);
  }
  
  @media (max-width: 480px) {
    .game-result-banner {
      flex-direction: column;
    }
  }
  
  .game-result-banner.success {
    background: var(--success-light);
    border: 2px solid var(--success);
    color: var(--success);
  }
  
  .game-result-banner.error {
    background: var(--error-light);
    border: 2px solid var(--error);
    color: var(--error);
  }
  
  .result-banner-content {
    display: flex;
    align-items: center;
    gap: clamp(8px, 2vw, 12px);
    font-weight: 700;
    font-size: clamp(0.8rem, 1.8vw, 0.95rem);
  }
  
  .result-banner-content small {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    margin-top: 2px;
    opacity: 0.8;
  }
  
  /* ========== GAME RESULT ========== */
  .game-result-layout {
    padding: clamp(24px, 5vw, 60px) clamp(12px, 3vw, 24px) 80px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .game-loading-screen {
    padding: clamp(40px, 10vw, 80px) 24px;
    text-align: center;
  }
  
  .result-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: clamp(30px, 5vw, 60px) clamp(24px, 4vw, 40px);
    text-align: center;
    box-shadow: var(--shadow-xl);
  }
  
  @media (max-width: 480px) {
    .result-card {
      padding: 24px 16px;
    }
  }
  
  .result-trophy {
    margin-bottom: clamp(16px, 3vw, 28px);
    color: var(--text-tertiary);
    font-size: clamp(48px, 10vw, 72px);
  }
  
  .result-card.excellent .result-trophy {
    color: #FFD700;
  }
  
  .result-card.good .result-trophy {
    color: var(--success);
  }
  
  .result-score-display {
    font-family: var(--font-chinese);
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: clamp(12px, 2vw, 20px);
  }
  
  .result-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: clamp(12px, 2vw, 16px);
  }
  
  .result-details span:first-child {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .result-details span:last-child {
    font-size: clamp(0.9rem, 1.5vw, 1rem);
    color: var(--text-secondary);
  }
  
  .result-message {
    font-size: clamp(0.95rem, 1.8vw, 1.1rem);
    color: var(--text-secondary);
    margin-bottom: clamp(20px, 4vw, 36px);
    line-height: 1.5;
  }
  
  .result-actions-row {
    display: flex;
    gap: clamp(8px, 2vw, 14px);
    justify-content: center;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    .result-actions-row {
      flex-direction: column;
      gap: 10px;
    }
  }
  
  .btn-result-primary, .btn-result-secondary {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1vw, 10px);
    padding: clamp(10px, 2vw, 14px) clamp(16px, 3vw, 28px);
    border-radius: var(--radius-lg);
    font-weight: 700;
    font-size: clamp(0.8rem, 1.5vw, 0.95rem);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  @media (max-width: 480px) {
    .btn-result-primary, .btn-result-secondary {
      width: 100%;
      justify-content: center;
    }
  }
  
  .btn-result-primary {
    background: var(--accent);
    color: white;
    border: none;
  }
  
  .btn-result-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
  }
  
  .btn-result-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 2px solid var(--border);
  }
  
  .btn-result-secondary:hover {
    background: var(--bg-hover);
  }
  
  /* ========== LEARN LAYOUT ========== */
  .learn-layout {
    display: flex;
    min-height: calc(100vh - 73px);
  }
  
  .learn-sidebar {
    width: clamp(220px, 30vw, 280px);
    background: var(--bg-secondary);
    border-right: 1px solid var(--border);
    padding: clamp(12px, 2vw, 24px) clamp(8px, 2vw, 16px);
    overflow-y: auto;
    flex-shrink: 0;
  }
  
  @media (max-width: 1024px) {
    .learn-sidebar {
      position: fixed;
      top: 73px;
      left: 0;
      bottom: 0;
      z-index: 999;
      box-shadow: var(--shadow-xl);
      width: 260px;
    }
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(14px, 2vw, 24px);
    padding-bottom: clamp(10px, 2vw, 16px);
    border-bottom: 1px solid var(--border);
  }
  
  .sidebar-header h2 {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 10px);
    font-size: clamp(0.95rem, 2vw, 1.25rem);
    font-weight: 700;
  }
  
  .sidebar-close {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    border: none;
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: pointer;
  }
  
  .sidebar-section {
    margin-bottom: clamp(16px, 3vw, 28px);
  }
  
  .sidebar-section h3 {
    font-size: clamp(0.65rem, 1.2vw, 0.8rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    margin-bottom: clamp(8px, 1.5vw, 12px);
  }
  
  .sidebar-levels {
    display: flex;
    flex-direction: column;
    gap: clamp(3px, 1vw, 6px);
  }
  
  .sidebar-level-btn, .sidebar-action-btn {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 10px);
    padding: clamp(7px, 1.5vw, 10px) clamp(8px, 2vw, 14px);
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: clamp(0.75rem, 1.5vw, 0.9rem);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }
  
  .sidebar-level-btn:hover, .sidebar-action-btn:hover {
    background: var(--bg-tertiary);
  }
  
  .sidebar-level-btn.active, .sidebar-action-btn.active {
    background: var(--accent-light);
    color: var(--accent);
  }
  
  .sidebar-level-btn .level-count, .sidebar-action-btn .count-badge {
    margin-left: auto;
    font-size: clamp(0.65rem, 1.2vw, 0.8rem);
    color: var(--text-tertiary);
    background: var(--bg-tertiary);
    padding: clamp(2px, 0.5vw, 4px) clamp(6px, 1vw, 8px);
    border-radius: var(--radius-sm);
  }
  
  .sidebar-action-btn.danger {
    color: var(--error);
  }
  
  .sidebar-action-btn.danger:hover {
    background: var(--error-light);
  }
  
  .sidebar-footer {
    padding-top: clamp(10px, 2vw, 16px);
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: clamp(4px, 1vw, 8px);
  }
  
  .sidebar-stat {
    display: flex;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
    font-size: clamp(0.7rem, 1.3vw, 0.875rem);
    color: var(--text-secondary);
  }
  
  .learn-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .learn-topbar {
    display: flex;
    align-items: center;
    gap: clamp(8px, 2vw, 16px);
    padding: clamp(10px, 2vw, 20px) clamp(12px, 3vw, 24px);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }
  
  @media (max-width: 768px) {
    .learn-topbar {
      gap: 6px;
      padding: 8px 10px;
    }
  }
  
  .sidebar-toggle {
    width: clamp(36px, 7vw, 44px);
    height: clamp(36px, 7vw, 44px);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .search-wrapper-modern {
    position: relative;
    flex: 1;
    min-width: 150px;
    max-width: 500px;
  }
  
  .search-icon-modern {
    position: absolute;
    left: clamp(8px, 2vw, 16px);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
  }
  
  .search-input-modern {
    width: 100%;
    padding: clamp(8px, 1.5vw, 12px) clamp(28px, 5vw, 48px) clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 16px);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: clamp(0.8rem, 1.5vw, 0.95rem);
    outline: none;
    transition: all 0.2s;
  }
  
  @media (max-width: 480px) {
    .search-input-modern {
      padding: 6px 28px 6px 36px;
      font-size: 0.8rem;
    }
  }
  
  .search-input-modern:focus {
    border-color: var(--accent);
    background: var(--bg-secondary);
  }
  
  .search-clear-modern {
    position: absolute;
    right: clamp(8px, 2vw, 12px);
    top: 50%;
    transform: translateY(-50%);
    width: clamp(24px, 5vw, 32px);
    height: clamp(24px, 5vw, 32px);
    border: none;
    background: none;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
  }
  
  .search-clear-modern:hover {
    background: var(--bg-hover);
  }
  
  .view-toggles {
    display: flex;
    gap: clamp(3px, 1vw, 6px);
    padding: clamp(2px, 0.5vw, 4px);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }
  
  .view-toggle-btn {
    width: clamp(36px, 7vw, 44px);
    height: clamp(36px, 7vw, 44px);
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .view-toggle-btn:hover {
    background: var(--bg-hover);
  }
  
  .view-toggle-btn.active {
    background: var(--bg-secondary);
    color: var(--accent);
  }
  
  .presentation-toggle-btn:hover {
    color: var(--voice);
  }
  
  .learn-content-area {
    flex: 1;
    padding: clamp(12px, 3vw, 32px) clamp(8px, 3vw, 24px) 80px;
    overflow-y: auto;
  }
  
  /* ========== WORDS CONTAINER ========== */
  .words-container {
    display: grid;
    gap: clamp(12px, 3vw, 24px);
  }
  
  .words-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(clamp(260px, 45vw, 340px), 1fr));
  }
  
  @media (max-width: 768px) {
    .words-container.grid {
      grid-template-columns: 1fr;
    }
  }
  
  .words-container.list {
    grid-template-columns: 1fr;
    max-width: 900px;
  }
  
  .word-card-modern {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: clamp(12px, 2.5vw, 24px);
    transition: all 0.3s;
    box-shadow: var(--shadow-sm);
  }
  
  .word-card-modern:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--accent);
  }
  
  .word-card-header-modern {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: clamp(12px, 2vw, 20px);
  }
  
  .word-id-badge {
    font-size: clamp(0.65rem, 1.2vw, 0.8rem);
    font-weight: 700;
    color: var(--text-tertiary);
    background: var(--bg-tertiary);
    padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1.5vw, 12px);
    border-radius: var(--radius-sm);
  }
  
  .word-card-actions {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 10px);
  }
  
  .due-chip {
    display: inline-flex;
    align-items: center;
    gap: clamp(2px, 0.5vw, 4px);
    font-size: clamp(0.65rem, 1.2vw, 0.75rem);
    font-weight: 700;
    color: var(--voice);
    background: var(--voice-light);
    padding: clamp(2px, 0.5vw, 4px) clamp(6px, 1vw, 10px);
    border-radius: var(--radius-sm);
  }
  
  .accuracy-chip {
    display: inline-flex;
    align-items: center;
    gap: clamp(2px, 0.5vw, 4px);
    font-size: clamp(0.65rem, 1.2vw, 0.75rem);
    font-weight: 700;
    color: var(--success);
    background: var(--success-light);
    padding: clamp(2px, 0.5vw, 4px) clamp(6px, 1vw, 10px);
    border-radius: var(--radius-sm);
  }
  
  .fav-btn-modern {
    width: clamp(32px, 6vw, 40px);
    height: clamp(32px, 6vw, 40px);
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .fav-btn-modern:hover {
    background: var(--bg-tertiary);
  }
  
  .fav-btn-modern.active {
    color: #FFD700;
  }
  
  .chinese-main-section {
    text-align: center;
    padding: clamp(16px, 4vw, 40px) clamp(10px, 2vw, 20px);
    background: var(--bg-tertiary);
    border-radius: var(--radius-lg);
    margin-bottom: clamp(12px, 3vw, 24px);
  }
  
  .hanzi-center {
    font-family: var(--font-chinese);
    font-size: clamp(2.5rem, 10vw, 6.5rem);
    font-weight: 900;
    line-height: 1;
    color: var(--text-primary);
    margin-bottom: clamp(8px, 2vw, 16px);
  }
  
  .pinyin-center {
    font-size: clamp(1rem, 3vw, 2rem);
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: clamp(12px, 2vw, 22px);
  }
  
  .voice-main-btn {
    display: inline-flex;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
    padding: clamp(6px, 1.5vw, 9px) clamp(12px, 2vw, 18px);
    border-radius: var(--radius-full);
    border: 2px solid var(--voice);
    background: var(--voice-light);
    color: var(--voice);
    font-weight: 700;
    font-size: clamp(0.7rem, 1.5vw, 0.85rem);
    cursor: pointer;
    transition: all 0.25s;
  }
  
  .voice-main-btn:hover {
    background: var(--voice);
    color: white;
  }
  
  .voice-main-btn.pulsing {
    animation: voicePulse 1.5s infinite;
  }
  
  @keyframes voicePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .translations-grid {
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 2vw, 12px);
    margin-bottom: clamp(12px, 2vw, 20px);
  }
  
  .translation-block {
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    padding: clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 14px);
    transition: all 0.2s;
  }
  
  .translation-block:hover {
    background: var(--bg-hover);
  }
  
  .trans-header {
    display: flex;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
    font-size: clamp(0.65rem, 1.2vw, 0.8rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-tertiary);
    margin-bottom: clamp(3px, 1vw, 6px);
  }
  
  .trans-text {
    font-size: clamp(0.85rem, 1.8vw, 1rem);
    font-weight: 500;
    color: var(--text-primary);
    word-break: break-word;
    line-height: 1.4;
  }
  
  .lao-script {
    font-family: var(--font-lao);
  }
  
  .thai-script {
    font-family: var(--font-thai);
  }
  
  .mini-voice-btn {
    width: clamp(20px, 4vw, 28px);
    height: clamp(20px, 4vw, 28px);
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--voice);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    transition: all 0.2s;
  }
  
  .mini-voice-btn:hover {
    background: var(--voice-light);
    transform: scale(1.1);
  }
  
  .word-card-footer-modern {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: clamp(10px, 2vw, 16px);
    border-top: 1px solid var(--border);
  }
  
  @media (max-width: 480px) {
    .word-card-footer-modern {
      padding-top: 8px;
      gap: 8px;
    }
  }
  
  .copy-btn-modern {
    display: flex;
    align-items: center;
    gap: clamp(4px, 1vw, 6px);
    padding: clamp(6px, 1.5vw, 9px) clamp(10px, 2vw, 16px);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: clamp(0.7rem, 1.3vw, 0.875rem);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  @media (max-width: 480px) {
    .copy-btn-modern {
      padding: 6px 10px;
      font-size: 0.7rem;
    }
  }
  
  .copy-btn-modern:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
  }
  
  .copy-btn-modern.copied {
    background: var(--success);
    color: white;
    border-color: var(--success);
  }
  
  .level-badge-modern {
    font-size: clamp(0.65rem, 1.2vw, 0.8rem);
    font-weight: 700;
    color: var(--text-tertiary);
    background: var(--bg-tertiary);
    padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1.5vw, 12px);
    border-radius: var(--radius-sm);
  }
  
  .word-skeleton-modern {
    height: clamp(300px, 70vw, 480px);
    border-radius: var(--radius-xl);
    background: linear-gradient(100deg, var(--bg-secondary) 30%, var(--bg-tertiary) 50%, var(--bg-secondary) 70%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .pagination-modern {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 2vw, 16px);
    margin-top: clamp(24px, 5vw, 40px);
  }
  
  .pagination-btn {
    width: clamp(36px, 7vw, 48px);
    height: clamp(36px, 7vw, 48px);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  
  .pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .pagination-info {
    font-weight: 600;
    color: var(--text-primary);
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  }
  
  .empty-state-modern {
    text-align: center;
    padding: clamp(40px, 10vw, 80px) clamp(16px, 4vw, 32px);
  }
  
  .empty-icon-modern {
    color: var(--text-tertiary);
    margin-bottom: clamp(14px, 3vw, 24px);
    font-size: clamp(48px, 12vw, 64px);
  }
  
  .empty-icon-modern.error {
    color: var(--error);
  }
  
  .empty-state-modern h3 {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-weight: 700;
    margin-bottom: clamp(6px, 1.5vw, 10px);
  }
  
  .empty-state-modern p {
    font-size: clamp(0.85rem, 1.8vw, 1rem);
    color: var(--text-secondary);
    margin-bottom: clamp(14px, 3vw, 24px);
  }
  
  .btn-modern-primary, .btn-modern-secondary {
    padding: clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px);
    border-radius: var(--radius-md);
    font-weight: 700;
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-modern-primary {
    background: var(--accent);
    color: white;
    border: none;
  }
  
  .btn-modern-primary:hover {
    background: var(--accent-hover);
  }
  
  .btn-modern-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }
  
  .btn-modern-secondary:hover {
    background: var(--bg-hover);
  }
  
  .fab-feedback {
    position: fixed;
    width: clamp(44px, 10vw, 56px);
    height: clamp(44px, 10vw, 56px);
    border-radius: var(--radius-full);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    z-index: 100;
    transition: all 0.3s;
    bottom: clamp(16px, 4vw, 24px);
    right: clamp(16px, 4vw, 24px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-size: clamp(20px, 4vw, 24px);
  }
  
  .fab-feedback:hover {
    transform: rotate(15deg) scale(1.1);
  }
  
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: clamp(12px, 3vw, 24px);
  }
  
  .modal-content-modern {
    max-width: clamp(280px, 90vw, 540px);
    width: 100%;
    background: var(--bg-secondary);
    border-radius: var(--radius-xl);
    padding: clamp(16px, 3vw, 36px);
    box-shadow: var(--shadow-xl);
    position: relative;
  }
  
  .modal-close-btn {
    position: absolute;
    top: clamp(10px, 2vw, 16px);
    right: clamp(10px, 2vw, 16px);
    width: clamp(32px, 6vw, 40px);
    height: clamp(32px, 6vw, 40px);
    border-radius: var(--radius-full);
    border: none;
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .modal-close-btn:hover {
    background: var(--error);
    color: white;
  }
  
  .modal-header-modern {
    display: flex;
    align-items: center;
    gap: clamp(10px, 2vw, 14px);
    margin-bottom: clamp(12px, 2vw, 20px);
    color: var(--accent);
  }
  
  .modal-header-modern h2 {
    font-size: clamp(1.2rem, 3vw, 1.75rem);
    font-weight: 800;
  }
  
  .modal-notice {
    display: flex;
    align-items: flex-start;
    gap: clamp(8px, 2vw, 12px);
    padding: clamp(10px, 2vw, 14px);
    background: var(--warning-light);
    border-radius: var(--radius-md);
    color: var(--warning);
    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    margin-bottom: clamp(12px, 2vw, 20px);
    line-height: 1.4;
  }
  
  .modal-textarea-modern {
    width: 100%;
    padding: clamp(8px, 1.5vw, 14px);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-family: inherit;
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    resize: vertical;
    margin-bottom: clamp(12px, 2vw, 20px);
    outline: none;
    transition: all 0.2s;
  }
  
  .modal-textarea-modern:focus {
    border-color: var(--accent);
  }
  
  .modal-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(6px, 1.5vw, 10px);
    width: 100%;
    padding: clamp(10px, 2vw, 14px);
    border-radius: var(--radius-md);
    border: none;
    background: var(--accent);
    color: white;
    font-weight: 700;
    font-size: clamp(0.85rem, 1.5vw, 1rem);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .modal-submit-btn:hover {
    background: var(--accent-hover);
  }
  
  .presentation-overlay {
    position: fixed;
    inset: 0;
    z-index: 5000;
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(16px, 4vw, 28px);
    padding: clamp(12px, 3vw, 32px);
  }
  
  .presentation-exit-btn {
    position: absolute;
    top: clamp(16px, 3vw, 24px);
    right: clamp(16px, 3vw, 24px);
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 8px);
    padding: clamp(8px, 1.5vw, 10px) clamp(14px, 2vw, 18px);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-weight: 700;
    font-size: clamp(0.75rem, 1.5vw, 0.85rem);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .presentation-exit-btn:hover {
    background: var(--error-light);
    color: var(--error);
    border-color: var(--error);
  }
  
  .presentation-counter {
    position: absolute;
    top: clamp(20px, 4vw, 28px);
    left: clamp(20px, 4vw, 28px);
    font-weight: 700;
    color: var(--text-tertiary);
    font-size: clamp(0.85rem, 1.5vw, 1.1rem);
  }
  
  .presentation-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(12px, 3vw, 20px);
    text-align: center;
    max-width: 90vw;
  }
  
  .presentation-hanzi {
    font-family: var(--font-chinese);
    font-size: clamp(4rem, 18vw, 13rem);
    font-weight: 900;
    line-height: 1;
    color: var(--text-primary);
  }
  
  .presentation-pinyin {
    font-size: clamp(1.2rem, 4vw, 3rem);
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .presentation-voice-btn {
    width: clamp(44px, 8vw, 52px);
    height: clamp(44px, 8vw, 52px);
    border-radius: var(--radius-full);
    border: 2px solid var(--voice);
    background: var(--voice-light);
    color: var(--voice);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .presentation-voice-btn:hover {
    background: var(--voice);
    color: white;
    transform: scale(1.08);
  }
  
  .presentation-translations {
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 1.5vw, 10px);
    font-size: clamp(1rem, 3vw, 1.75rem);
    color: var(--text-primary);
    background: var(--bg-tertiary);
    padding: clamp(14px, 3vw, 20px) clamp(20px, 4vw, 32px);
    border-radius: var(--radius-lg);
  }
  
  .presentation-translations strong {
    color: var(--voice);
    margin-right: clamp(6px, 1.5vw, 10px);
  }
  
  .presentation-controls {
    display: flex;
    align-items: center;
    gap: clamp(12px, 3vw, 20px);
    flex-wrap: wrap;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    .presentation-controls {
      gap: 10px;
    }
  }
  
  .presentation-nav-btn {
    width: clamp(48px, 10vw, 60px);
    height: clamp(48px, 10vw, 60px);
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: var(--shadow-md);
  }
  
  .presentation-nav-btn:hover:not(:disabled) {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  
  .presentation-nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .presentation-reveal-btn {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 10px);
    padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 28px);
    border-radius: var(--radius-lg);
    border: none;
    background: var(--voice);
    color: white;
    font-weight: 700;
    font-size: clamp(0.8rem, 1.8vw, 1.05rem);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-md);
  }
  
  @media (max-width: 480px) {
    .presentation-reveal-btn {
      padding: 10px 16px;
      font-size: 0.85rem;
    }
  }
  
  .presentation-reveal-btn:hover {
    background: var(--voice-hover);
    transform: translateY(-2px);
  }
  
  .presentation-hint {
    color: var(--text-tertiary);
    font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  }
  
  .presentation-empty {
    font-size: clamp(1rem, 2vw, 1.5rem);
    color: var(--text-secondary);
  }
  
  /* ========== UTILITIES ========== */
  .spinner-sm {
    animation: spin 1s linear infinite;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 2px;
  }
`;
import { useEffect, useState } from "react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Android
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    // iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const standalone = (window.navigator as any).standalone === true;

    setIsIos(isIosDevice);
    setIsInStandaloneMode(standalone);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowInstall(false);
      });
    }
  };

  const handleClose = () => {
    setDismissed(true);
  };

  if (dismissed) return null;

  // ✅ iOS Prompt
  if (isIos && !isInStandaloneMode) {
    return (
      <div className="fixed bottom-5 left-5 right-5 mx-auto max-w-sm p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Add to Home Screen</h2>
          <button onClick={handleClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">&times;</button>
        </div>
        <p className="text-sm">
          To install this app on your iPhone, tap the 
          <span className="mx-1 text-lg">📤</span> 
          <strong>Share</strong> button, then tap <strong>Add to Home Screen</strong>.
        </p>
      </div>
    );
  }

  // ✅ Android Install Button
  return showInstall ? (
    <div className="fixed bottom-5 left-5 right-5 mx-auto max-w-sm p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Install Omelette's App</h2>
        <button onClick={handleClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">&times;</button>
      </div>
      <button
        onClick={handleInstallClick}
        className="w-full mt-2 py-2 px-4 bg-emerald-600 text-white dark:text-gray-500 rounded-lg hover:bg-emerald-700 transition"
      >
        Add to Home Screen
      </button>
    </div>
  ) : null;
}

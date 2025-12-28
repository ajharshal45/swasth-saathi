import { useState, useEffect } from "react";
import { useRouter } from "next/router";


// Text content for both languages
const content = {
  en: {
    title: "Swasth Saathi",
    subtitle: "Healthcare guidance, even without internet",
    button: "Start Health Check",
    offlineNote: "Works even without internet",
    footer: "Prototype for demonstration only",
    online: "Online",
    offline: "Offline",
  },
  hi: {
    title: "स्वास्थ्य साथी",
    subtitle: "इंटरनेट के बिना भी, स्वास्थ्य संबंधी मार्गदर्शन",
    button: "स्वास्थ्य जांच शुरू करें",
    offlineNote: "इंटरनेट के बिना भी काम करता है",
    footer: "यह केवल प्रदर्शन के लिए है",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
  },
};

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [isOnline, setIsOnline] = useState(true);

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("swasth-language");
    if (saved) setLanguage(saved);
  }, []);

  // Network status detection
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("swasth-language", lang);
  };

  const text = content[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 font-bold text-lg">
          Swasth Saathi
        </div>

        <div className="flex items-center gap-3 text-sm">
          {/* Language Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLanguage("en")}
              className={`px-2 py-1 rounded ${
                language === "en"
                  ? "bg-green-600 text-white"
                  : "text-gray-600"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => toggleLanguage("hi")}
              className={`px-2 py-1 rounded ${
                language === "hi"
                  ? "bg-green-600 text-white"
                  : "text-gray-600"
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Network Status */}
          <div
            className={`px-3 py-1 rounded-full font-medium ${
              isOnline
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {isOnline ? "🟢 " + text.online : "🔴 " + text.offline}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">{text.title}</h1>
        <p className="text-lg text-gray-600 mb-10">{text.subtitle}</p>

        <button
          onClick={() => router.push("/symptoms")}
          className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-4 rounded-xl shadow-lg"
        >
          🩺 {text.button}
        </button>

        {/* Offline Mode Indicator */}
        {!isOnline && (
          <div className="mt-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <span>📴</span>
            <span>
              {language === 'en' 
                ? 'Offline mode - Basic features available' 
                : 'ऑफ़लाइन मोड - बुनियादी सुविधाएं उपलब्ध'}
            </span>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500">
          {text.offlineNote}
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4">
        {text.footer}
      </footer>
    </div>
  );
}

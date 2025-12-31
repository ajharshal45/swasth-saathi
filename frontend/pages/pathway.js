
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// 🔹 NEW: Import group-based guidance
import groupGuidance from "../data/groupGuidance.json";

/* =======================
   CONTENT (UI TEXT)
   ======================= */
const content = {
  en: {
    title: "Care Guidance",
    homeCare: "Home Care",
    warning: "Warning Signs - Go to Hospital If:",
    done: "Done"
  },
  hi: {
    title: "देखभाल मार्गदर्शन",
    homeCare: "घर पर देखभाल",
    warning: "चेतावनी - अस्पताल जाएं अगर:",
    done: "समाप्त"
  }
};

export default function Pathway() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [result, setResult] = useState(null);

  /* =======================
     LOAD SAVED DATA
     ======================= */
  useEffect(() => {
    const savedLanguage = localStorage.getItem("swasth-language");
    if (savedLanguage) setLanguage(savedLanguage);

    const savedResult = localStorage.getItem("swasth-result");
    if (savedResult) setResult(JSON.parse(savedResult));
  }, []);

  const t = content[language];

  /* =======================
     MULTI-GROUP GUIDANCE
     ======================= */
  const guidanceBlocks = result?.groups
    ?.map(group => groupGuidance[group]?.[language])
    .filter(Boolean);

  if (!guidanceBlocks || guidanceBlocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No guidance available
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="px-4 py-3 font-bold text-lg">
        {t.title}
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {guidanceBlocks.map((block, index) => (
          <div key={index} className="space-y-4">
            {/* Title */}
            <div className="p-4 rounded-2xl text-center bg-green-100 shadow-sm">
              <h2 className="font-bold text-green-800">
                {block.title}
              </h2>
            </div>

            {/* Home Care */}
            <div className="bg-blue-50 p-4 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-2">
                💊 {t.homeCare}
              </h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                {block.care.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            <div className="bg-red-50 p-4 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-red-800 mb-2">
                ⚠️ {t.warning}
              </h3>
              <ul className="space-y-1 text-red-700 text-sm">
                {block.warning.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4">
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
        >
          {t.done}
        </button>
      </div>
    </div>
  );
}

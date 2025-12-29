import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Symptoms data with bilingual support
const symptoms = [
  { id: 'fever', en: 'Fever', hi: 'बुखार' },
  { id: 'headache', en: 'Headache', hi: 'सिरदर्द' },
  { id: 'cough', en: 'Cough', hi: 'खांसी' },
  { id: 'cold', en: 'Cold', hi: 'जुकाम' },
  { id: 'stomach', en: 'Stomach Pain', hi: 'पेट दर्द' },
  { id: 'vomiting', en: 'Vomiting', hi: 'उल्टी' },
  { id: 'diarrhea', en: 'Diarrhea', hi: 'दस्त' },
  { id: 'weakness', en: 'Weakness', hi: 'कमज़ोरी' },
  { id: 'bodyPain', en: 'Body Pain', hi: 'बदन दर्द' },
  { id: 'breathing', en: 'Breathing Issue', hi: 'सांस की तकलीफ' },
];

// Content translations
const content = {
  en: {
    title: 'Select Symptoms',
    voice: 'Speak Your Symptoms',
    voiceHint: 'Tell us how you feel',
    instruction: 'Tap to select your symptoms:',
    selected: 'symptom(s) selected',
    continue: 'Continue',
    online: 'Online',
    offline: 'Offline'
  },
  hi: {
    title: 'लक्षण चुनें',
    voice: 'अपने लक्षण बोलें',
    voiceHint: 'बताएं आपको कैसा लग रहा है',
    instruction: 'अपने लक्षण चुनने के लिए टैप करें:',
    selected: 'लक्षण चुने गए',
    continue: 'आगे बढ़ें',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन'
  }
};

export default function Symptoms() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [selected, setSelected] = useState([]);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasth-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Track network status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toggle language and save preference
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('swasth-language', lang);
  };

  // Toggle symptom selection
  const toggleSymptom = (symptomId) => {
    setSelected((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Handle voice input (demo)
  const handleVoice = () => {
    alert(
      '🎤 Voice Input Demo\n\nThis feature would listen to you describe symptoms in Hindi or English.\n\n(Prototype - not functional)'
    );
  };

  // Handle continue button
  const handleContinue = () => {
    if (selected.length === 0) return;
    localStorage.setItem('swasth-symptoms', JSON.stringify(selected));
    router.push('/questions');
  };

  const t = content[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50"
          >
            ←
          </button>
          <h1 className="font-bold text-lg">{t.title}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {/* Language Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLanguage('en')}
              className={`px-2 py-1 rounded ${
                language === 'en' ? 'bg-green-600 text-white' : 'text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => toggleLanguage('hi')}
              className={`px-2 py-1 rounded ${
                language === 'hi' ? 'bg-green-600 text-white' : 'text-gray-600'
              }`}
            >
              हिंदी
            </button>
          </div>
          {/* Network Badge */}
          <div
            className={`px-3 py-1 rounded-full font-medium ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isOnline ? `🟢 ${t.online}` : `🔴 ${t.offline}`}
          </div>
        </div>
      </header>

      {/* Voice Button Section - Only when online */}
      {isOnline && (
        <div className="px-4 pt-2 pb-4">
          <button
            onClick={handleVoice}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl flex flex-col items-center gap-1 shadow-lg"
          >
            <span className="text-lg font-semibold">🎤 {t.voice}</span>
            <span className="text-sm opacity-90">{t.voiceHint}</span>
          </button>
        </div>
      )}

      {/* Instruction Text */}
      <p className="px-4 py-2 text-gray-600 text-sm font-medium">{t.instruction}</p>

      {/* Symptoms Grid */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {symptoms.map((symptom) => {
            const isSelected = selected.includes(symptom.id);
            return (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all shadow-sm ${
                  isSelected
                    ? 'bg-green-100 border-green-500 shadow-md'
                    : 'bg-white border-gray-100 hover:border-green-300 hover:shadow-md'
                }`}
              >
                <span className={`text-sm font-medium text-center ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>
                  {symptom[language]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Count Bar */}
      {selected.length > 0 && (
        <div className="mx-4 mb-2 py-2 bg-green-100 text-green-700 text-center text-sm font-medium rounded-lg">
          ✓ {selected.length} {t.selected}
        </div>
      )}

      {/* Continue Button Footer */}
      <div className="p-4 pt-2">
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            selected.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
          }`}
        >
          {t.continue} →
        </button>
      </div>
    </div>
  );
}

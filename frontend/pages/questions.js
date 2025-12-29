import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Age group options
const ageGroups = [
  { id: 'below18', en: 'Below 18', hi: '18 से कम' },
  { id: '18-40', en: '18 - 40', hi: '18 - 40' },
  { id: '41-60', en: '41 - 60', hi: '41 - 60' },
  { id: 'above60', en: 'Above 60', hi: '60 से ऊपर' },
];

// Duration options
const durationOptions = [
  { id: 'today', en: 'Just started (today)', hi: 'आज ही शुरू हुआ' },
  { id: '1-2', en: '1-2 days', hi: '1-2 दिन' },
  { id: '3-5', en: '3-5 days', hi: '3-5 दिन' },
  { id: 'more5', en: 'More than 5 days', hi: '5 दिन से ज्यादा' },
];

// Condition options
const conditionOptions = [
  { id: 'yes', en: 'Yes', hi: 'हाँ' },
  { id: 'no', en: 'No', hi: 'नहीं' },
];

// Severity options (NEW)
const severityOptions = [
  { id: 'mild', en: 'Mild - I can do daily activities', hi: 'हल्का - रोज़ का काम कर सकता/सकती हूं' },
  { id: 'moderate', en: 'Moderate - I need to rest', hi: 'मध्यम - आराम करना पड़ रहा है' },
  { id: 'severe', en: 'Severe - I cannot get up', hi: 'गंभीर - उठ नहीं पा रहा/रही' },
];

// Medicine options (NEW)
const medicineOptions = [
  { id: 'none', en: 'No, I have not taken any medicine', hi: 'नहीं, कोई दवा नहीं ली' },
  { id: 'paracetamol', en: 'Yes, fever/pain medicine (Paracetamol, Crocin)', hi: 'हाँ, बुखार/दर्द की दवा ली' },
  { id: 'other', en: 'Yes, some other medicine', hi: 'हाँ, कोई और दवा ली' },
  { id: 'unsure', en: 'Not sure / Don\'t remember', hi: 'पता नहीं / याद नहीं' },
];

// Content translations
const content = {
  en: {
    title: 'A Few Questions',
    ageQuestion: 'What is your age group?',
    durationQuestion: 'How long have you had these symptoms?',
    conditionQuestion: 'Do you have any existing health conditions?',
    conditionHint: '(Diabetes, BP, Heart disease, etc.)',
    severityQ: 'How bad do you feel right now?',
    medicineQ: 'Have you taken any medicine already?',
    submit: 'Get Result',
    required: 'Please answer all questions',
    online: 'Online',
    offline: 'Offline'
  },
  hi: {
    title: 'कुछ सवाल',
    ageQuestion: 'आपकी उम्र क्या है?',
    durationQuestion: 'ये लक्षण कितने दिनों से हैं?',
    conditionQuestion: 'क्या कोई पुरानी बीमारी है?',
    conditionHint: '(मधुमेह, BP, हृदय रोग आदि)',
    severityQ: 'आप अभी कितना बुरा महसूस कर रहे हैं?',
    medicineQ: 'क्या आपने पहले से कोई दवा ली है?',
    submit: 'परिणाम देखें',
    required: 'कृपया सभी सवालों के जवाब दें',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन'
  }
};

export default function Questions() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [ageGroup, setAgeGroup] = useState(null);
  const [duration, setDuration] = useState(null);
  const [hasCondition, setHasCondition] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [medicineTaken, setMedicineTaken] = useState(null);

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

  // Handle form submission
  const handleSubmit = () => {
    if (!ageGroup || !duration || !hasCondition || !severity || !medicineTaken) {
      alert(content[language].required);
      return;
    }

    localStorage.setItem('swasth-ageGroup', ageGroup);
    localStorage.setItem('swasth-duration', duration);
    localStorage.setItem('swasth-conditions', hasCondition);
    localStorage.setItem('swasth-severity', severity);
    localStorage.setItem('swasth-medicine', medicineTaken);
    router.push('/result');
  };

  const t = content[language];
  const isComplete = ageGroup && duration && hasCondition && severity && medicineTaken;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/symptoms')}
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

      {/* Form Content */}
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Age Group Question */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-800 font-semibold mb-1">{t.ageQuestion}</p>
          {language === 'en' && <p className="text-gray-500 text-sm mb-3">(आपकी उम्र क्या है?)</p>}
          {language === 'hi' && <p className="text-gray-500 text-sm mb-3">(What is your age group?)</p>}
          <div className="space-y-2">
            {ageGroups.map((option) => (
              <button
                key={option.id}
                onClick={() => setAgeGroup(option.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  ageGroup === option.id
                    ? 'border-green-500 bg-green-100 shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:border-green-300'
                }`}
              >
                <span className={ageGroup === option.id ? 'text-green-800 font-medium' : 'text-gray-700'}>{option[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Question */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-800 font-semibold mb-1">{t.durationQuestion}</p>
          {language === 'en' && <p className="text-gray-500 text-sm mb-3">(ये लक्षण कितने दिनों से हैं?)</p>}
          {language === 'hi' && <p className="text-gray-500 text-sm mb-3">(How long have you had these symptoms?)</p>}
          <div className="space-y-2">
            {durationOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setDuration(option.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  duration === option.id
                    ? 'border-green-500 bg-green-100 shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:border-green-300'
                }`}
              >
                <span className={duration === option.id ? 'text-green-800 font-medium' : 'text-gray-700'}>{option[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Existing Conditions Question */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-800 font-semibold mb-1">{t.conditionQuestion}</p>
          <p className="text-gray-500 text-sm mb-3">{t.conditionHint}</p>
          <div className="space-y-2">
            {conditionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setHasCondition(option.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  hasCondition === option.id
                    ? 'border-green-500 bg-green-100 shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:border-green-300'
                }`}
              >
                <span className={hasCondition === option.id ? 'text-green-800 font-medium' : 'text-gray-700'}>{option[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Question (NEW) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-800 font-semibold mb-1">{t.severityQ}</p>
          {language === 'en' && <p className="text-gray-500 text-sm mb-3">(आप अभी कितना बुरा महसूस कर रहे हैं?)</p>}
          {language === 'hi' && <p className="text-gray-500 text-sm mb-3">(How bad do you feel right now?)</p>}
          <div className="space-y-2">
            {severityOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSeverity(option.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  severity === option.id
                    ? 'border-green-500 bg-green-100 shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:border-green-300'
                }`}
              >
                <span className={severity === option.id ? 'text-green-800 font-medium' : 'text-gray-700'}>{option[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Question (NEW) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-800 font-semibold mb-1">{t.medicineQ}</p>
          {language === 'en' && <p className="text-gray-500 text-sm mb-3">(क्या आपने पहले से कोई दवा ली है?)</p>}
          {language === 'hi' && <p className="text-gray-500 text-sm mb-3">(Have you taken any medicine already?)</p>}
          <div className="space-y-2">
            {medicineOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setMedicineTaken(option.id)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  medicineTaken === option.id
                    ? 'border-green-500 bg-green-100 shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:border-green-300'
                }`}
              >
                <span className={medicineTaken === option.id ? 'text-green-800 font-medium' : 'text-gray-700'}>{option[language]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-2">
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            isComplete
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t.submit}
        </button>
      </div>
    </div>
  );
}

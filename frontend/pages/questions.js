import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// Helper function to get age group from age number
const getAgeGroup = (age) => {
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 0) return null;
  if (ageNum < 18) return 'below18';
  if (ageNum <= 40) return '18-40';
  if (ageNum <= 60) return '41-60';
  return 'above60';
};

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
    ageQuestion: 'What is your age?',
    agePlaceholder: 'Enter your age',
    ageHint: 'Years',
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
    agePlaceholder: 'अपनी उम्र दर्ज करें',
    ageHint: 'वर्ष',
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
  const [age, setAge] = useState('');
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
    const ageGroup = getAgeGroup(age);
    if (!age || !ageGroup || !duration || !hasCondition || !severity || !medicineTaken) {
      alert(content[language].required);
      return;
    }

    localStorage.setItem('swasth-age', age);
    localStorage.setItem('swasth-ageGroup', ageGroup);
    localStorage.setItem('swasth-duration', duration);
    localStorage.setItem('swasth-conditions', hasCondition);
    localStorage.setItem('swasth-severity', severity);
    localStorage.setItem('swasth-medicine', medicineTaken);
    router.push('/result');
  };

  const t = content[language];
  const isComplete = age && getAgeGroup(age) && duration && hasCondition && severity && medicineTaken;

  return (
    <>
      <Head>
        <title>{t.title} - Swasth Saathi</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/symptoms"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 transition-all text-sm font-medium"
              >
                ←
              </Link>
              <div className="leading-tight">
                <h1 className="text-sm font-bold text-slate-900">{t.title}</h1>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'These help us understand your health risk better' : 'ये हमें आपके स्वास्थ्य जोखिम को बेहतर समझने में मदद करते हैं'}
                </p>
              </div>
            </div>

            {/* Right: Language Toggle + Status */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <div className="flex rounded-full overflow-hidden border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`px-3 py-1.5 transition-all ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => toggleLanguage('hi')}
                  className={`px-3 py-1.5 transition-all ${
                    language === 'hi'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Network Badge */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                {isOnline ? t.online : t.offline}
              </div>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-32 space-y-3">
        {/* Age Question */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="w-full px-4 py-3 flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800">{t.ageQuestion}</div>
              <div className="text-xs text-slate-500">
                {language === 'en' ? '(आपकी उम्र क्या है?)' : '(What is your age?)'}
              </div>
            </div>
            
          </div>
          <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t.agePlaceholder}
                className="flex-1 p-3 rounded-lg border-2 border-slate-200 bg-white text-slate-800 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <span className="text-xs font-medium text-slate-500">{t.ageHint}</span>
            </div>
            {age && getAgeGroup(age) && (
              <div className="mt-2 text-xs text-emerald-600 font-medium">
                ✓ {language === 'en' ? 'Age recorded' : 'उम्र दर्ज की गई'}
              </div>
            )}
          </div>
        </div>

        {/* Duration Question */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800">{t.durationQuestion}</div>
              <div className="text-xs text-slate-500">
                {language === 'en' ? '(ये लक्षण कितने दिनों से हैं?)' : '(How long have you had these symptoms?)'}
              </div>
            </div>
            
          </button>
          <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              {durationOptions.map((option) => {
                const sel = duration === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setDuration(option.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      sel
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-xs font-medium">{option[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Existing Conditions Question */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800">{t.conditionQuestion}</div>
              <div className="text-xs text-slate-500">{t.conditionHint}</div>
            </div>
            
          </button>
          <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              {conditionOptions.map((option) => {
                const sel = hasCondition === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setHasCondition(option.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      sel
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-xs font-medium">{option[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity Question */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800">{t.severityQ}</div>
              <div className="text-xs text-slate-500">
                {language === 'en' ? '(आप अभी कितना बुरा महसूस कर रहे हैं?)' : '(How bad do you feel right now?)'}
              </div>
            </div>
            
          </button>
          <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100">
            <div className="grid grid-cols-1 gap-2">
              {severityOptions.map((option) => {
                const sel = severity === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSeverity(option.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      sel
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-xs font-medium">{option[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Medicine Question */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800">{t.medicineQ}</div>
              <div className="text-xs text-slate-500">
                {language === 'en' ? '(क्या आपने पहले से कोई दवा ली है?)' : '(Have you taken any medicine already?)'}
              </div>
            </div>
            
          </button>
          <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100">
            <div className="grid grid-cols-1 gap-2">
              {medicineOptions.map((option) => {
                const sel = medicineTaken === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setMedicineTaken(option.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      sel
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-xs font-medium">{option[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Selected Count */}
          {isComplete && (
            <div className="mb-3 py-2 bg-emerald-100 text-emerald-700 text-center text-sm font-medium rounded-lg">
              ✓ {language === 'en' ? 'All questions answered' : 'सभी सवालों के जवाब दिए गए'}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
              isComplete
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {t.submit} →
          </button>
        </div>
      </div>
      </div>
    </>
  );
}

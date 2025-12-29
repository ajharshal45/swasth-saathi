import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Triage logic function
function getTriage(symptoms, ageGroup, duration, hasCondition, severity, medicineTaken) {
  // ════════════════════════════════════════════════════════
  // HIGH RISK (Needs urgent attention)
  // ════════════════════════════════════════════════════════

  // Rule 1: Breathing issue - ALWAYS HIGH
  if (symptoms.includes('breathing')) {
    return { level: 'HIGH', en: 'Breathing difficulty needs immediate attention.', hi: 'सांस की तकलीफ पर तुरंत ध्यान दें।' };
  }

  // Rule 2: Severe symptoms
  if (severity === 'severe') {
    return { level: 'HIGH', en: 'Severe symptoms need urgent care.', hi: 'गंभीर लक्षणों पर तुरंत ध्यान दें।' };
  }

  // Rule 3: Took medicine but still not better
  if (medicineTaken !== 'none' && medicineTaken !== null && severity !== 'mild') {
    return { level: 'HIGH', en: 'Not improving despite medicine. See a doctor.', hi: 'दवा लेने के बाद भी आराम नहीं। डॉक्टर से मिलें।' };
  }

  // Rule 4: Elderly (60+) with fever
  if (ageGroup === 'above60' && symptoms.includes('fever')) {
    return { level: 'HIGH', en: 'Fever in elderly needs urgent attention.', hi: 'बुज़ुर्गों में बुखार पर तुरंत ध्यान दें।' };
  }

  // Rule 5: Existing conditions with fever
  if (hasCondition === 'yes' && symptoms.includes('fever')) {
    return { level: 'HIGH', en: 'Fever with existing conditions needs doctor visit.', hi: 'पुरानी बीमारी के साथ बुखार - डॉक्टर से मिलें।' };
  }

  // Rule 6: Children with fever
  if (ageGroup === 'below18' && symptoms.includes('fever')) {
    return { level: 'HIGH', en: 'Fever in children needs quick attention.', hi: 'बच्चों में बुखार पर जल्दी ध्यान दें।' };
  }

  // ════════════════════════════════════════════════════════
  // MEDIUM RISK (Monitor closely)
  // ════════════════════════════════════════════════════════

  // Rule 7: Moderate severity
  if (severity === 'moderate') {
    return { level: 'MEDIUM', en: 'Moderate symptoms. Rest and monitor.', hi: 'मध्यम लक्षण। आराम करें और ध्यान रखें।' };
  }

  // Rule 8: Symptoms lasting 3+ days
  if (duration === '3-5' || duration === 'more5') {
    return { level: 'MEDIUM', en: 'Symptoms lasting several days. Monitor closely.', hi: 'कई दिनों से लक्षण हैं। ध्यान से देखें।' };
  }

  // Rule 9: Vomiting + Diarrhea (dehydration risk)
  if (symptoms.includes('vomiting') && symptoms.includes('diarrhea')) {
    return { level: 'MEDIUM', en: 'Risk of dehydration. Stay hydrated.', hi: 'पानी की कमी का खतरा। पानी पीते रहें।' };
  }

  // Rule 10: Multiple symptoms (3+)
  if (symptoms.length >= 3) {
    return { level: 'MEDIUM', en: 'Multiple symptoms. Consider seeing a doctor.', hi: 'कई लक्षण हैं। डॉक्टर से मिलने पर विचार करें।' };
  }

  // Rule 11: Medicine taken but symptoms persist
  if (medicineTaken !== 'none' && medicineTaken !== null && duration !== 'today') {
    return { level: 'MEDIUM', en: 'Symptoms persist despite medicine. Keep monitoring.', hi: 'दवा के बाद भी लक्षण हैं। निगरानी जारी रखें।' };
  }

  // ════════════════════════════════════════════════════════
  // LOW RISK (Home care should help)
  // ════════════════════════════════════════════════════════

  return { level: 'LOW', en: 'Mild symptoms. Rest and home care should help.', hi: 'हल्के लक्षण। आराम और घरेलू देखभाल से ठीक होना चाहिए।' };
}

// Content translations
const content = {
  en: {
    why: 'Why this result?',
    saved: 'Your report is saved',
    viewGuidance: 'View Care Guidance',
    newCheck: 'Start New Check',
    high: 'HIGH RISK',
    medium: 'MEDIUM RISK',
    low: 'LOW RISK',
    online: 'Online',
    offline: 'Offline'
  },
  hi: {
    why: 'यह परिणाम क्यों?',
    saved: 'आपकी रिपोर्ट सेव हो गई',
    viewGuidance: 'देखभाल मार्गदर्शन देखें',
    newCheck: 'नई जाँच शुरू करें',
    high: 'उच्च जोखिम',
    medium: 'मध्यम जोखिम',
    low: 'कम जोखिम',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन'
  }
};

// Level styles
const levelStyles = {
  HIGH: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
  MEDIUM: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
  LOW: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
};

export default function Result() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [result, setResult] = useState(null);

  // Load data and calculate result
  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasth-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load all data from localStorage
    const symptomsData = localStorage.getItem('swasth-symptoms');
    const ageGroup = localStorage.getItem('swasth-ageGroup');
    const duration = localStorage.getItem('swasth-duration');
    const hasCondition = localStorage.getItem('swasth-conditions');
    const severity = localStorage.getItem('swasth-severity');
    const medicineTaken = localStorage.getItem('swasth-medicine');

    if (symptomsData && ageGroup && duration && hasCondition) {
      const symptoms = JSON.parse(symptomsData);
      const triageResult = getTriage(symptoms, ageGroup, duration, hasCondition, severity, medicineTaken);
      setResult(triageResult);
      localStorage.setItem('swasth-result', JSON.stringify(triageResult));
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

  const t = content[language];
  const styles = result ? levelStyles[result.level] : levelStyles.LOW;

  // Get level text based on result
  const getLevelText = () => {
    if (!result) return '';
    if (result.level === 'HIGH') return t.high;
    if (result.level === 'MEDIUM') return t.medium;
    return t.low;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-xl hover:bg-gray-50"
        >
          🏠
        </button>
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

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Risk Level Box */}
        {result && (
          <div className={`p-8 rounded-2xl text-center shadow-lg ${styles.bg} border-2 ${styles.border}`}>
            <h2 className={`text-3xl font-bold ${styles.text}`}>
              {getLevelText()}
            </h2>
            {language === 'en' && result.level === 'HIGH' && (
              <p className="text-red-600 mt-2 text-lg">उच्च जोखिम</p>
            )}
            {language === 'en' && result.level === 'MEDIUM' && (
              <p className="text-yellow-600 mt-2 text-lg">मध्यम जोखिम</p>
            )}
            {language === 'en' && result.level === 'LOW' && (
              <p className="text-green-600 mt-2 text-lg">कम जोखिम</p>
            )}
            {language === 'hi' && result.level === 'HIGH' && (
              <p className="text-red-600 mt-2 text-lg">HIGH RISK</p>
            )}
            {language === 'hi' && result.level === 'MEDIUM' && (
              <p className="text-yellow-600 mt-2 text-lg">MEDIUM RISK</p>
            )}
            {language === 'hi' && result.level === 'LOW' && (
              <p className="text-green-600 mt-2 text-lg">LOW RISK</p>
            )}
          </div>
        )}

        {/* Explanation Box */}
        {result && (
          <div className="bg-white p-5 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">{t.why}</h3>
            <p className="text-gray-600">{result[language]}</p>
          </div>
        )}

        {/* Saved Confirmation */}
        <div className="bg-green-100 p-3 rounded-xl text-center text-green-700 text-sm font-medium">
          ✓ {t.saved}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => router.push('/pathway')}
          className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-lg text-lg"
        >
          {t.viewGuidance}
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full text-center text-gray-500 hover:text-gray-700 py-2"
        >
          {t.newCheck}
        </button>
      </div>
    </div>
  );
}

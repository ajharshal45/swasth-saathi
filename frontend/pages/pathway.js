import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import groupGuidance from '@/data/groupGuidance.json';

// Pathway data for each risk level
const pathways = {
  HIGH: {
    en: {
      title: 'HIGH RISK - Visit Hospital Today',
      days: [
        { title: 'Immediate Action', items: ['Go to nearest hospital or call emergency', 'Take someone with you for support', 'Carry any existing medical reports', 'Do not delay - urgent care needed'] }
      ],
      homeCare: ['Rest as much as possible', 'Drink plenty of water', 'Eat light, easily digestible food', 'Avoid any strenuous activity'],
      warning: ['Difficulty breathing increases', 'Cannot drink water or keep fluids down', 'Very high fever (above 103°F/39.4°C)', 'Feeling confused or very weak', 'Severe chest pain', 'Loss of consciousness']
    },
    hi: {
      title: 'उच्च जोखिम - आज ही अस्पताल जाएं',
      days: [
        { title: 'तत्काल कार्रवाई', items: ['नजदीकी अस्पताल जाएं या आपातकालीन कॉल करें', 'किसी को साथ ले जाएं', 'पुरानी मेडिकल रिपोर्ट साथ रखें', 'देरी न करें - तत्काल देखभाल जरूरी'] }
      ],
      homeCare: ['जितना हो सके आराम करें', 'खूब पानी पिएं', 'हल्का, आसानी से पचने वाला खाना खाएं', 'कोई भारी काम न करें'],
      warning: ['सांस लेने में और तकलीफ हो', 'पानी न पी पाएं या उल्टी हो', 'बहुत तेज बुखार (103°F/39.4°C से ऊपर)', 'भ्रम या बहुत कमजोरी लगे', 'गंभीर सीने में दर्द', 'बेहोशी']
    }
  },
  MEDIUM: {
    en: {
      title: 'MEDIUM RISK - Monitor and Rest',
      days: [
        { title: 'Day 1', items: ['Rest at home in a comfortable position', 'Drink fluids regularly (water, ORS, soup)', 'Take fever/pain medicine if needed', 'Monitor body temperature twice daily'] },
        { title: 'Day 2', items: ['Check if symptoms are improving', 'Continue rest and hydration', 'Note any new symptoms', 'Maintain a health log'] },
        { title: 'Day 3', items: ['If not better, contact a doctor', 'Do not delay if symptoms worsen', 'Keep emergency contacts ready'] }
      ],
      homeCare: ['Get 7-8 hours of quality sleep', 'Eat nutritious, balanced meals', 'Avoid cold drinks and heavy food', 'Stay in a well-ventilated room'],
      warning: ['Fever does not reduce after 3 days', 'New or worsening symptoms appear', 'Cannot eat or drink properly', 'Feeling significantly worse', 'Persistent vomiting or diarrhea']
    },
    hi: {
      title: 'मध्यम जोखिम - निगरानी रखें और आराम करें',
      days: [
        { title: 'दिन 1', items: ['घर पर आराम से रहें', 'नियमित पानी पिएं (पानी, ORS, सूप)', 'जरूरत हो तो बुखार/दर्द की दवा लें', 'दिन में दो बार तापमान जांचें'] },
        { title: 'दिन 2', items: ['देखें लक्षण बेहतर हो रहे हैं या नहीं', 'आराम और पानी जारी रखें', 'नए लक्षणों पर ध्यान दें', 'स्वास्थ्य लॉग बनाएं'] },
        { title: 'दिन 3', items: ['अगर ठीक नहीं तो डॉक्टर से संपर्क करें', 'बिगड़ रहा हो तो देर न करें', 'आपातकालीन संपर्क तैयार रखें'] }
      ],
      homeCare: ['7-8 घंटे अच्छी नींद लें', 'पौष्टिक, संतुलित भोजन करें', 'ठंडा पानी और भारी खाना न खाएं', 'हवादार कमरे में रहें'],
      warning: ['3 दिन बाद भी बुखार कम न हो', 'नए या बिगड़ते लक्षण दिखें', 'खाना-पीना ठीक से न हो पाए', 'बहुत खराब महसूस हो', 'लगातार उल्टी या दस्त']
    }
  },
  LOW: {
    en: {
      title: 'LOW RISK - Home Care Should Help',
      days: [
        { title: 'Day 1', items: ['Rest well and stay comfortable', 'Drink warm water or herbal tea', 'Eat light, home-cooked food', 'Avoid exposure to cold or heat'] },
        { title: 'Day 2', items: ['Continue rest and hydration', 'You should feel improvement', 'Light walking or stretching is okay', 'Monitor your overall wellness'] },
        { title: 'Day 3', items: ['Most symptoms should improve significantly', 'Resume normal activities gradually', 'Maintain healthy lifestyle habits'] }
      ],
      homeCare: ['Get adequate sleep (8+ hours)', 'Drink plenty of fluids (water, juice)', 'Eat fresh fruits and vegetables', 'Avoid heavy physical work', 'Practice good hygiene', 'Manage stress with rest'],
      warning: ['Symptoms not improving after 3-4 days', 'Fever suddenly starts', 'Symptoms suddenly get much worse', 'New concerning symptoms appear']
    },
    hi: {
      title: 'कम जोखिम - घरेलू देखभाल से ठीक होना चाहिए',
      days: [
        { title: 'दिन 1', items: ['अच्छी तरह आराम करें', 'गर्म पानी या हर्बल चाय पिएं', 'हल्का, घर का बना खाना खाएं', 'ठंड या गर्मी से बचें'] },
        { title: 'दिन 2', items: ['आराम और पानी जारी रखें', 'बेहतर महसूस होना चाहिए', 'हल्की सैर या स्ट्रेचिंग ठीक है', 'अपनी सेहत पर नज़र रखें'] },
        { title: 'दिन 3', items: ['ज्यादातर लक्षण काफी ठीक होने चाहिए', 'धीरे-धीरे सामान्य काम शुरू करें', 'स्वस्थ जीवनशैली बनाए रखें'] }
      ],
      homeCare: ['पर्याप्त नींद लें (8+ घंटे)', 'खूब तरल पिएं (पानी, जूस)', 'ताजे फल और सब्जियां खाएं', 'भारी शारीरिक काम से बचें', 'अच्छी स्वच्छता बनाए रखें', 'आराम से तनाव प्रबंधित करें'],
      warning: ['3-4 दिन बाद भी लक्षण ठीक न हों', 'अचानक बुखार आ जाए', 'लक्षण अचानक बहुत बिगड़ जाएं', 'नए चिंताजनक लक्षण दिखें']
    }
  }
};

// Content translations
const content = {
  en: {
    title: 'Care Guidance',
    subtitle: 'Follow these steps for your health',
    homeCare: 'Home Care Tips',
    warning: 'Warning Signs',
    warningSubtitle: 'Go to hospital immediately if:',
    done: 'Done',
    online: 'Online',
    offline: 'Offline'
  },
  hi: {
    title: 'देखभाल मार्गदर्शन',
    subtitle: 'अपने स्वास्थ्य के लिए इन चरणों का पालन करें',
    homeCare: 'घरेलू देखभाल सुझाव',
    warning: 'चेतावनी संकेत',
    warningSubtitle: 'तुरंत अस्पताल जाएं अगर:',
    done: 'समाप्त',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन'
  }
};

export default function Pathway() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const t = content[language];

  // Mount animation
  useEffect(() => {
    setMounted(true);
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

  // Load saved data
  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasth-language');
    if (savedLanguage) setLanguage(savedLanguage);

    const savedResult = localStorage.getItem('swasth-result');
    console.log('📋 Loading result:', savedResult);
    
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        console.log('✅ Parsed result:', parsed);
        setResult(parsed);
      } catch (e) {
        console.error('❌ Failed to parse result:', e);
      }
    } else {
      console.warn('⚠️ No result found');
      // Redirect if no result
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router]);

  // Toggle language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('swasth-language', lang);
  };

  const pathway = result?.level ? pathways[result.level]?.[language] : null;

  // Loading state
  if (!result || !pathway) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading care guidance...</p>
        </div>
      </div>
    );
  }

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
                href="/result"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 transition-all text-sm font-medium"
              >
                ←
              </Link>
              <div className="leading-tight">
                <h1 className="text-sm font-bold text-slate-900">{t.title}</h1>
                <p className="text-xs text-slate-500">{t.subtitle}</p>
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

        {/* Content */}
        <main
          className={`flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-32 space-y-4 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Level Badge */}
          <div className={`p-4 rounded-2xl text-center shadow-sm border-2 ${
            result.level === 'HIGH' ? 'bg-red-50 border-red-200 text-red-700' :
            result.level === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
            'bg-green-50 border-green-200 text-green-700'
          }`}>
            <h2 className="text-lg font-bold">{pathway.title}</h2>
          </div>

          {/* Day Cards */}
          {pathway.days.map((day, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm">
                  {index + 1}
                </div>
                <h3 className="font-bold text-white">{day.title}</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2.5">
                  {day.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="text-emerald-500 mt-0.5 text-lg flex-shrink-0">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Home Care Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-blue-100/50 border-b border-blue-200">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <span className="text-xl">💊</span>
                {t.homeCare}
              </h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2.5">
                {pathway.homeCare.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-blue-900">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Warning Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-red-100/50 border-b border-red-200">
              <h3 className="font-bold text-red-900 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {t.warning}
              </h3>
              <p className="text-xs text-red-700 mt-1">{t.warningSubtitle}</p>
            </div>
            <div className="p-4">
              <ul className="space-y-2.5">
                {pathway.warning.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-red-900">
                    <span className="text-red-500 mt-0.5 font-bold">!</span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Group-Based Guidance Section */}
          {result.groups && result.groups.length > 0 && (
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-2 mt-6">
                <span className="text-xl">🎯</span>
                <h2 className="text-lg font-bold text-slate-900">
                  {language === 'en' ? 'Based on Your Symptoms' : 'आपके लक्षणों के आधार पर'}
                </h2>
              </div>

              {/* Group Cards */}
              {result.groups.map((group) => {
                const guidance = groupGuidance[group]?.[language];
                if (!guidance) return null;

                return (
                  <div key={group} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Group Title */}
                    <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                      <h3 className="font-bold text-slate-800">{guidance.title}</h3>
                    </div>

                    {/* Care Tips */}
                    <div className="p-4">
                      <div className="bg-blue-50 rounded-xl p-3 mb-3">
                        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1.5">
                          <span>💙</span>
                          {language === 'en' ? 'Care Tips' : 'देखभाल सुझाव'}
                        </h4>
                        <ul className="space-y-1.5">
                          {guidance.care.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Warning Signs for this group */}
                      <div className="bg-red-50 rounded-xl p-3">
                        <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1.5">
                          <span>⚠️</span>
                          {language === 'en' ? 'Watch For' : 'ध्यान दें'}
                        </h4>
                        <ul className="space-y-1.5">
                          {guidance.warning.map((sign, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                              <span className="text-red-400 mt-0.5">!</span>
                              <span>{sign}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Bottom Bar - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <button
              onClick={() => router.push('/')}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg active:scale-[0.98] transition-all"
            >
              {t.done} ✓
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
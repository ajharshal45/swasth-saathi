import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Pathway data for each risk level
const pathways = {
  HIGH: {
    en: {
      title: 'HIGH RISK - Visit Hospital Today',
      days: [
        { title: 'Day 1', items: ['Go to nearest hospital', 'Take someone with you', 'Carry any old reports'] }
      ],
      homeCare: ['Rest as much as possible', 'Drink plenty of water', 'Eat light food'],
      warning: ['Difficulty breathing increases', 'Cannot drink water', 'Very high fever', 'Feeling confused or very weak']
    },
    hi: {
      title: 'उच्च जोखिम - आज ही अस्पताल जाएं',
      days: [
        { title: 'दिन 1', items: ['नजदीकी अस्पताल जाएं', 'किसी को साथ ले जाएं', 'पुरानी रिपोर्ट साथ रखें'] }
      ],
      homeCare: ['जितना हो सके आराम करें', 'खूब पानी पिएं', 'हल्का खाना खाएं'],
      warning: ['सांस लेने में और तकलीफ हो', 'पानी न पी पाएं', 'बहुत तेज बुखार हो', 'भ्रम या बहुत कमजोरी लगे']
    }
  },
  MEDIUM: {
    en: {
      title: 'MEDIUM RISK - Monitor and Rest',
      days: [
        { title: 'Day 1', items: ['Rest at home', 'Drink fluids regularly', 'Take medicine for fever if needed'] },
        { title: 'Day 2', items: ['Check if symptoms are better', 'Continue rest', 'Monitor temperature'] },
        { title: 'Day 3', items: ['If not better, see a doctor', 'Do not delay if getting worse'] }
      ],
      homeCare: ['Sleep well', 'Eat healthy food', 'Avoid cold drinks', 'Stay hydrated'],
      warning: ['Fever does not reduce', 'New symptoms appear', 'Cannot eat or drink', 'Feeling much worse']
    },
    hi: {
      title: 'मध्यम जोखिम - निगरानी रखें और आराम करें',
      days: [
        { title: 'दिन 1', items: ['घर पर आराम करें', 'नियमित पानी पिएं', 'जरूरत हो तो बुखार की दवा लें'] },
        { title: 'दिन 2', items: ['देखें लक्षण बेहतर हैं या नहीं', 'आराम जारी रखें', 'तापमान जांचें'] },
        { title: 'दिन 3', items: ['अगर ठीक नहीं तो डॉक्टर के पास जाएं', 'बिगड़ रहा हो तो देर न करें'] }
      ],
      homeCare: ['अच्छी नींद लें', 'स्वस्थ भोजन करें', 'ठंडा पानी न पिएं', 'पानी पीते रहें'],
      warning: ['बुखार कम न हो', 'नए लक्षण दिखें', 'खाना-पीना न हो पाए', 'बहुत खराब लगे']
    }
  },
  LOW: {
    en: {
      title: 'LOW RISK - Home Care Should Help',
      days: [
        { title: 'Day 1', items: ['Rest well', 'Drink warm water', 'Eat light food'] },
        { title: 'Day 2', items: ['Continue rest', 'You should feel better', 'Light activity is okay'] },
        { title: 'Day 3', items: ['Most symptoms should improve', 'Resume normal activities slowly'] }
      ],
      homeCare: ['Get 8 hours sleep', 'Drink water and juice', 'Eat fruits', 'Avoid heavy work'],
      warning: ['Symptoms not improving', 'Fever starts', 'Symptoms suddenly get worse']
    },
    hi: {
      title: 'कम जोखिम - घरेलू देखभाल से ठीक होना चाहिए',
      days: [
        { title: 'दिन 1', items: ['अच्छी तरह आराम करें', 'गर्म पानी पिएं', 'हल्का खाना खाएं'] },
        { title: 'दिन 2', items: ['आराम जारी रखें', 'बेहतर महसूस होना चाहिए', 'हल्की गतिविधि ठीक है'] },
        { title: 'दिन 3', items: ['ज्यादातर लक्षण ठीक होने चाहिए', 'धीरे-धीरे सामान्य काम शुरू करें'] }
      ],
      homeCare: ['8 घंटे सोएं', 'पानी और जूस पिएं', 'फल खाएं', 'भारी काम न करें'],
      warning: ['लक्षण ठीक न हों', 'बुखार आ जाए', 'लक्षण अचानक बिगड़ें']
    }
  }
};

// Content translations
const content = {
  en: {
    title: 'Care Guidance',
    homeCare: 'Home Care',
    warning: 'Warning Signs - Go to Hospital If:',
    done: 'Done'
  },
  hi: {
    title: 'देखभाल मार्गदर्शन',
    homeCare: 'घर पर देखभाल',
    warning: 'चेतावनी - अस्पताल जाएं अगर:',
    done: 'समाप्त'
  }
};

export default function Pathway() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState(null);

  // Load saved data
  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasth-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const savedResult = localStorage.getItem('swasth-result');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  // Toggle language and save preference
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('swasth-language', lang);
  };

  const t = content[language];
  const pathway = result ? pathways[result.level]?.[language] : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/result')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:bg-gray-50"
          >
            ←
          </button>
          <h1 className="font-bold text-lg">{t.title}</h1>
        </div>
        {/* Language Toggle */}
        <div className="flex items-center gap-1 text-sm">
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
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {pathway && (
          <>
            {/* Level Title */}
            <div className={`p-4 rounded-2xl text-center shadow-sm ${
              result?.level === 'HIGH' ? 'bg-red-100 text-red-700' :
              result?.level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              <h2 className="text-lg font-bold">{pathway.title}</h2>
            </div>

            {/* Day Cards */}
            {pathway.days.map((day, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  {day.title}
                </h3>
                <ul className="space-y-2 ml-9">
                  {day.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Home Care Card */}
            <div className="bg-blue-50 p-4 rounded-2xl shadow-sm border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-xl">💊</span>
                {t.homeCare}
              </h3>
              <ul className="space-y-2">
                {pathway.homeCare.map((item, idx) => (
                  <li key={idx} className="text-blue-700 text-sm flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning Card */}
            <div className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {t.warning}
              </h3>
              <ul className="space-y-2">
                {pathway.warning.map((item, idx) => (
                  <li key={idx} className="text-red-700 text-sm flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 pt-2">
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-lg text-lg"
        >
          {t.done}
        </button>
      </div>
    </div>
  );
}

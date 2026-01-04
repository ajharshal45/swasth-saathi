import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { runTriage } from '@/data/triage';
import { submitCase } from '@/lib/api';

// Content translations
const content = {
  en: {
    title: 'Your Health Assessment',
    why: 'Why this result?',
    saved: 'Your report is saved locally',
    viewGuidance: 'View Care Guidance',
    newCheck: 'Start New Check',
    high: 'HIGH RISK',
    medium: 'MEDIUM RISK',
    low: 'LOW RISK',
    highDesc: 'Urgent medical attention recommended',
    mediumDesc: 'Monitor closely and rest',
    lowDesc: 'Home care should help',
    online: 'Online',
    offline: 'Offline',
    // Doctor Connect
    connectDoctor: 'Connect with Doctor',
    connectDesc: 'Get immediate guidance from a medical professional.',
    videoCall: 'Video Call',
    audioCall: 'Audio Call',
    chat: 'Chat',
    estimatedWait: 'Estimated wait',
    minutes: 'minutes',
    doctorsAvailable: 'doctors available now',
    orDivider: 'OR',
    connecting: 'Connecting...',
    connected: 'Connected',
    demoNote: 'Demo mode - not a real call',
    nearestHospitals: 'Nearest hospitals',
    emergency: 'Emergency',
    cancelCall: 'Cancel Call',
    yearsExp: 'years experience',
    availableNow: 'Available now',
    reviews: 'reviews',
    caseSummaryShared: 'Your case summary will be shared with the doctor',
    symptoms: 'Symptoms',
    riskLevel: 'Risk Level',
    duration: 'Duration',
    startingCall: 'Starting video call...',
    startingAudio: 'Starting audio call...',
    startingChat: 'Starting chat...',
    // Possible Conditions
    possibleConditions: 'Possible Conditions',
    basedOnSymptoms: 'Based on your symptoms',
    highLikelihood: 'HIGH likelihood',
    mediumLikelihood: 'MEDIUM likelihood',
    lowLikelihood: 'LOW likelihood',
    disclaimer: 'This is NOT a medical diagnosis. These are possible conditions based on reported symptoms. Please consult a qualified doctor for proper diagnosis and treatment.',
    disclaimerHi: 'यह चिकित्सा निदान नहीं है। कृपया डॉक्टर से परामर्श करें।',
  },
  hi: {
    title: 'आपका स्वास्थ्य मूल्यांकन',
    why: 'यह परिणाम क्यों?',
    saved: 'आपकी रिपोर्ट स्थानीय रूप से सहेजी गई',
    viewGuidance: 'देखभाल मार्गदर्शन देखें',
    newCheck: 'नई जाँच शुरू करें',
    high: 'उच्च जोखिम',
    medium: 'मध्यम जोखिम',
    low: 'कम जोखिम',
    highDesc: 'तत्काल चिकित्सा ध्यान की सिफारिश की जाती है',
    mediumDesc: 'ध्यान से निगरानी करें और आराम करें',
    lowDesc: 'घरेलू देखभाल से मदद मिलनी चाहिए',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    // Doctor Connect
    connectDoctor: 'डॉक्टर से जुड़ें',
    connectDesc: 'चिकित्सा पेशेवर से तत्काल मार्गदर्शन प्राप्त करें।',
    videoCall: 'वीडियो कॉल',
    audioCall: 'ऑडियो कॉल',
    chat: 'चैट',
    estimatedWait: 'अनुमानित प्रतीक्षा',
    minutes: 'मिनट',
    doctorsAvailable: 'डॉक्टर अभी उपलब्ध',
    orDivider: 'या',
    connecting: 'कनेक्ट हो रहा है...',
    connected: 'जुड़ गए',
    demoNote: 'डेमो मोड - वास्तविक कॉल नहीं',
    nearestHospitals: 'निकटतम अस्पताल',
    emergency: 'आपातकालीन',
    cancelCall: 'कॉल रद्द करें',
    yearsExp: 'साल का अनुभव',
    availableNow: 'अभी उपलब्ध',
    reviews: 'समीक्षाएं',
    caseSummaryShared: 'आपका केस सारांश डॉक्टर के साथ साझा किया जाएगा',
    symptoms: 'लक्षण',
    riskLevel: 'जोखिम स्तर',
    duration: 'अवधि',
    startingCall: 'वीडियो कॉल शुरू हो रही है...',
    startingAudio: 'ऑडियो कॉल शुरू हो रही है...',
    startingChat: 'चैट शुरू हो रही है...',
    // Possible Conditions
    possibleConditions: 'संभावित स्थितियां',
    basedOnSymptoms: 'आपके लक्षणों के आधार पर',
    highLikelihood: 'उच्च संभावना',
    mediumLikelihood: 'मध्यम संभावना',
    lowLikelihood: 'कम संभावना',
    disclaimer: 'यह चिकित्सा निदान नहीं है। ये रिपोर्ट किए गए लक्षणों के आधार पर संभावित स्थितियां हैं। उचित निदान और उपचार के लिए कृपया योग्य डॉक्टर से परामर्श करें।',
    disclaimerHi: 'This is NOT a medical diagnosis. Please consult a doctor.',
  }
};

// Function to get possible conditions based on symptoms
const getPossibleConditions = (symptoms) => {
  const conditions = [];
  
  // Fever patterns
  if (symptoms.includes('fever')) {
    if (symptoms.includes('cough') && symptoms.includes('cold')) {
      conditions.push({
        name: { en: 'Viral Fever / Common Flu', hi: 'वायरल बुखार / सामान्य फ्लू' },
        likelihood: 'high',
        description: { 
          en: 'Common viral infection causing fever with respiratory symptoms', 
          hi: 'बुखार के साथ सांस संबंधी लक्षण वाला सामान्य वायरल संक्रमण' 
        }
      });
    }
    if (symptoms.includes('headache') && symptoms.includes('bodyPain')) {
      conditions.push({
        name: { en: 'Dengue / Viral Infection', hi: 'डेंगू / वायरल संक्रमण' },
        likelihood: 'medium',
        description: { 
          en: 'Fever with body pain - consider dengue test if in monsoon season', 
          hi: 'बुखार के साथ बदन दर्द - मानसून में डेंगू टेस्ट करवाएं' 
        }
      });
    }
    if (symptoms.includes('chills')) {
      conditions.push({
        name: { en: 'Malaria', hi: 'मलेरिया' },
        likelihood: 'medium',
        description: { 
          en: 'Fever with chills - malaria test recommended if in endemic area', 
          hi: 'कंपकंपी के साथ बुखार - मलेरिया टेस्ट करवाएं' 
        }
      });
    }
    // Fever alone or with other symptoms
    if (conditions.length === 0) {
      conditions.push({
        name: { en: 'Fever - Viral/Bacterial Infection', hi: 'बुखार - वायरल/बैक्टीरियल संक्रमण' },
        likelihood: 'high',
        description: { 
          en: 'Fever indicates infection - monitor temperature and stay hydrated', 
          hi: 'बुखार संक्रमण का संकेत है - तापमान पर नज़र रखें और पानी पीते रहें' 
        }
      });
    }
  }
  
  // Respiratory patterns
  if (symptoms.includes('cough') && symptoms.includes('soreThroat')) {
    conditions.push({
      name: { en: 'Upper Respiratory Infection', hi: 'ऊपरी श्वसन संक्रमण' },
      likelihood: 'high',
      description: { 
        en: 'Throat and airway infection - usually viral, self-limiting', 
        hi: 'गले और वायुमार्ग का संक्रमण - आमतौर पर वायरल' 
      }
    });
  }
  
  if (symptoms.includes('breathing') || symptoms.includes('chestTightness')) {
    conditions.push({
      name: { en: 'Respiratory Distress', hi: 'सांस की गंभीर समस्या' },
      likelihood: 'high',
      description: { 
        en: 'Breathing difficulty requires immediate medical evaluation', 
        hi: 'सांस की तकलीफ पर तुरंत डॉक्टर से मिलें' 
      }
    });
  }
  
  // Digestive patterns
  if (symptoms.includes('vomiting') && symptoms.includes('diarrhea')) {
    conditions.push({
      name: { en: 'Gastroenteritis / Food Poisoning', hi: 'गैस्ट्रोएंटेराइटिस / फूड पॉइज़निंग' },
      likelihood: 'high',
      description: { 
        en: 'Stomach infection - stay hydrated with ORS', 
        hi: 'पेट का संक्रमण - ORS से पानी की कमी न होने दें' 
      }
    });
  }
  
  if (symptoms.includes('stomach') && symptoms.includes('nausea')) {
    conditions.push({
      name: { en: 'Gastritis / Acidity', hi: 'गैस्ट्राइटिस / एसिडिटी' },
      likelihood: 'medium',
      description: { 
        en: 'Stomach inflammation - avoid spicy food, take antacids', 
        hi: 'पेट की सूजन - तीखा खाना बंद करें' 
      }
    });
  }

  // Stomach pain alone
  if (symptoms.includes('stomach') && !symptoms.includes('vomiting') && !symptoms.includes('diarrhea')) {
    conditions.push({
      name: { en: 'Abdominal Discomfort', hi: 'पेट की तकलीफ' },
      likelihood: 'medium',
      description: { 
        en: 'Could be indigestion, gas, or acidity - observe for worsening', 
        hi: 'अपच, गैस या एसिडिटी हो सकती है - देखें कि बढ़ तो नहीं रही' 
      }
    });
  }
  
  // Headache patterns
  if (symptoms.includes('headache') && !symptoms.includes('fever')) {
    conditions.push({
      name: { en: 'Tension Headache / Migraine', hi: 'तनाव सिरदर्द / माइग्रेन' },
      likelihood: 'medium',
      description: { 
        en: 'Stress or migraine related - rest in dark room, stay hydrated', 
        hi: 'तनाव या माइग्रेन - अंधेरे कमरे में आराम करें' 
      }
    });
  }
  
  // Weakness patterns
  if (symptoms.includes('weakness') || symptoms.includes('fatigue')) {
    conditions.push({
      name: { en: 'General Weakness / Fatigue', hi: 'सामान्य कमजोरी / थकान' },
      likelihood: 'medium',
      description: { 
        en: 'Could indicate anemia or vitamin deficiency - blood test recommended', 
        hi: 'खून की कमी हो सकती है - ब्लड टेस्ट करवाएं' 
      }
    });
  }

  // Body pain pattern
  if (symptoms.includes('bodyPain') && !symptoms.includes('fever')) {
    conditions.push({
      name: { en: 'Muscle Pain / Body Ache', hi: 'मांसपेशियों में दर्द / बदन दर्द' },
      likelihood: 'medium',
      description: { 
        en: 'May be due to strain, stress, or viral prodrome - rest and observe', 
        hi: 'खिंचाव, तनाव या वायरल हो सकता है - आराम करें और देखें' 
      }
    });
  }

  // Cold/runny nose
  if (symptoms.includes('cold') && !symptoms.includes('fever')) {
    conditions.push({
      name: { en: 'Common Cold / Rhinitis', hi: 'सामान्य सर्दी / नाक बहना' },
      likelihood: 'high',
      description: { 
        en: 'Viral cold - rest, fluids, and steam inhalation help', 
        hi: 'वायरल सर्दी - आराम, तरल पदार्थ और भाप लें' 
      }
    });
  }

  // Cough alone
  if (symptoms.includes('cough') && !symptoms.includes('fever') && !symptoms.includes('breathing')) {
    conditions.push({
      name: { en: 'Cough - Allergic/Viral', hi: 'खांसी - एलर्जी/वायरल' },
      likelihood: 'medium',
      description: { 
        en: 'Could be allergic or post-nasal drip - honey and warm fluids help', 
        hi: 'एलर्जी या नाक से गले में हो सकती है - शहद और गर्म पानी लें' 
      }
    });
  }
  
  // If no specific pattern matched, add generic
  if (conditions.length === 0) {
    conditions.push({
      name: { en: 'Unspecified Symptoms', hi: 'अनिर्दिष्ट लक्षण' },
      likelihood: 'low',
      description: { 
        en: 'Symptoms need further evaluation by a doctor', 
        hi: 'लक्षणों की डॉक्टर द्वारा जांच आवश्यक है' 
      }
    });
  }
  
  // Remove duplicates and return top 3 conditions
  const uniqueConditions = conditions.filter((condition, index, self) =>
    index === self.findIndex((c) => c.name.en === condition.name.en)
  );
  return uniqueConditions.slice(0, 3);
};

// Level styles
const levelConfig = {
  HIGH: {
    bg: 'from-red-500 to-red-600',
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon: '🚨',
    descKey: 'highDesc'
  },
  MEDIUM: {
    bg: 'from-yellow-500 to-amber-500',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: '⚠️',
    descKey: 'mediumDesc'
  },
  LOW: {
    bg: 'from-green-500 to-emerald-600',
    badge: 'bg-green-100 text-green-700 border-green-200',
    icon: '✓',
    descKey: 'lowDesc'
  },
};

// Mock doctor data
const mockDoctor = {
  name: 'Dr. Sharma',
  nameHi: 'डॉ. शर्मा',
  specialty: { en: 'General Physician', hi: 'सामान्य चिकित्सक' },
  experience: 15,
  rating: 4.8,
  reviews: 120,
  available: true
};

// Mock nearest hospitals
const nearestHospitals = [
  { name: 'PHC Barabanki', distance: '2.5 km' },
  { name: 'District Hospital', distance: '8 km' },
];

export default function Result() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [result, setResult] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Doctor connect state
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [callType, setCallType] = useState(null); // 'video' | 'audio' | 'chat'
  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected'
  const [patientSymptoms, setPatientSymptoms] = useState([]);
  const [patientDuration, setPatientDuration] = useState('');
  const [possibleConditions, setPossibleConditions] = useState([]);

  const t = content[language];

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load data and calculate result
  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasth-language');
    if (savedLanguage) setLanguage(savedLanguage);

    // Load all data from localStorage
    const symptomsData = localStorage.getItem('swasth-symptoms');
    const ageGroup = localStorage.getItem('swasth-ageGroup');
    const duration = localStorage.getItem('swasth-duration');
    const hasCondition = localStorage.getItem('swasth-conditions');
    const severity = localStorage.getItem('swasth-severity');
    const medicineTaken = localStorage.getItem('swasth-medicine');

    console.log('📊 Debug - Loading data:', {
      symptomsData,
      ageGroup,
      duration,
      hasCondition,
      severity,
      medicineTaken
    });

    if (symptomsData && ageGroup && duration && hasCondition) {
      const symptoms = JSON.parse(symptomsData);
      setPatientSymptoms(symptoms);
      setPatientDuration(duration);
      
      // Use the new triage engine
      const triageResult = runTriage({
        symptoms,
        ageGroup,
        duration,
        severity,
        medicineTaken
      });
      
      console.log('✅ Triage Result:', triageResult);
      console.log('📊 Detected Groups:', triageResult.groups);
      
      // Calculate possible conditions
      const conditions = getPossibleConditions(symptoms);
      setPossibleConditions(conditions);
      console.log('🔍 Possible Conditions:', conditions);
      localStorage.setItem('swasth-conditions-list', JSON.stringify(conditions));
      
      setResult(triageResult);
      localStorage.setItem('swasth-result', JSON.stringify(triageResult));

      // Submit to backend
      const caseData = {
        symptoms,
        followUp: JSON.parse(localStorage.getItem('swasth-followup') || '{}'),
        ageGroup,
        duration,
        severity: severity || 'mild',
        conditions: hasCondition,
        medicine: medicineTaken || 'none',
        riskLevel: triageResult.level,
        reasoningEn: triageResult.reason?.en || '',
        reasoningHi: triageResult.reason?.hi || '',
        mode: navigator.onLine ? 'online' : 'offline'
      };

      submitCase(caseData).then(response => {
        console.log('📤 Case submitted:', response);
        localStorage.setItem('swasth-caseId', response.id);
      }).catch(err => {
        console.error('❌ Failed to submit case:', err);
      });
    } else {
      console.error('❌ Missing data - redirecting to home');
      // Redirect if data missing
      setTimeout(() => router.push('/'), 2000);
    }
  }, [router]);

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

  // Toggle language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('swasth-language', lang);
  };

  // Start doctor call
  const startCall = (type) => {
    setCallType(type);
    setCallStatus('connecting');
    
    // Simulate connection after 2 seconds
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
    
    // Auto-end after 7 seconds (demo)
    setTimeout(() => {
      setCallStatus('idle');
      setCallType(null);
      alert(language === 'en' 
        ? 'Demo: In production, this would be a real video/audio call with a doctor. The doctor would review your symptoms and provide guidance.'
        : 'डेमो: वास्तविक उत्पाद में यह डॉक्टर के साथ असली वीडियो/ऑडियो कॉल होगी। डॉक्टर आपके लक्षणों की समीक्षा करेंगे और मार्गदर्शन देंगे।');
    }, 7000);
  };

  // Cancel call
  const cancelCall = () => {
    setCallStatus('idle');
    setCallType(null);
  };

  // Get symptom labels for display
  const getSymptomLabels = () => {
    const symptomNames = {
      fever: { en: 'Fever', hi: 'बुखार' },
      cough: { en: 'Cough', hi: 'खांसी' },
      cold: { en: 'Cold', hi: 'जुकाम' },
      headache: { en: 'Headache', hi: 'सिरदर्द' },
      breathing: { en: 'Breathing Issue', hi: 'सांस की तकलीफ' },
      stomach: { en: 'Stomach Pain', hi: 'पेट दर्द' },
      vomiting: { en: 'Vomiting', hi: 'उल्टी' },
      diarrhea: { en: 'Diarrhea', hi: 'दस्त' },
      weakness: { en: 'Weakness', hi: 'कमज़ोरी' },
      bodyPain: { en: 'Body Pain', hi: 'बदन दर्द' },
      chestTightness: { en: 'Chest Tightness', hi: 'सीने में जकड़न' },
    };
    return patientSymptoms.map(s => symptomNames[s]?.[language] || s).join(', ');
  };

  // Get duration label
  const getDurationLabel = () => {
    const durationLabels = {
      'today': { en: 'Just started', hi: 'आज ही शुरू' },
      '1-2': { en: '1-2 days', hi: '1-2 दिन' },
      '3-5': { en: '3-5 days', hi: '3-5 दिन' },
      'more5': { en: '5+ days', hi: '5+ दिन' },
    };
    return durationLabels[patientDuration]?.[language] || patientDuration;
  };

  // Loading state
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Analyzing your health data...</p>
        </div>
      </div>
    );
  }

  const config = levelConfig[result.level];
  const getLevelText = () => {
    if (result.level === 'HIGH') return t.high;
    if (result.level === 'MEDIUM') return t.medium;
    return t.low;
  };

  return (
    <>
      <Head>
        <title>{t.title} - Swasth Saathi</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
            {/* Left: Home Button */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span className="text-2xl">🏠</span>
            </Link>

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
          className={`flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-32 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Title */}
          <h1 className="text-2xl font-black text-slate-900 mb-6 text-center">{t.title}</h1>

          {/* Risk Level Card */}
          <div className={`bg-gradient-to-r ${config.bg} rounded-3xl p-8 text-white text-center shadow-2xl mb-6`}>
            <div className="text-6xl mb-4">{config.icon}</div>
            <h2 className="text-3xl font-black mb-2">{getLevelText()}</h2>
            <p className="text-sm opacity-90 font-medium">{t[config.descKey]}</p>
          </div>

          {/* Explanation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-4">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              {t.why}
            </h3>
            <p className="text-slate-600 leading-relaxed">{result.reason?.[language] || result[language]}</p>
          </div>

          {/* Detected Symptom Groups */}
          {result.groups && result.groups.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-4">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                {language === 'en' ? 'Symptom Categories' : 'लक्षण श्रेणियां'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.groups.map((group, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-medium capitalize"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Possible Conditions Section - Preliminary Diagnosis */}
          {possibleConditions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-4">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔍</span>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{t.possibleConditions}</h3>
                  <p className="text-sm text-slate-500">{t.basedOnSymptoms}</p>
                </div>
              </div>

              {/* Condition Cards */}
              <div className="space-y-3">
                {possibleConditions.map((condition, idx) => {
                  const likelihoodStyles = {
                    high: {
                      card: 'border-green-200 bg-green-50',
                      badge: 'bg-green-100 text-green-700',
                      icon: '🟢'
                    },
                    medium: {
                      card: 'border-yellow-200 bg-yellow-50',
                      badge: 'bg-yellow-100 text-yellow-700',
                      icon: '🟡'
                    },
                    low: {
                      card: 'border-slate-200 bg-slate-50',
                      badge: 'bg-slate-100 text-slate-600',
                      icon: '⚪'
                    }
                  };
                  const style = likelihoodStyles[condition.likelihood] || likelihoodStyles.low;

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border ${style.card}`}
                    >
                      {/* Likelihood Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span>{style.icon}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${style.badge}`}>
                          {condition.likelihood === 'high' ? t.highLikelihood : 
                           condition.likelihood === 'medium' ? t.mediumLikelihood : t.lowLikelihood}
                        </span>
                      </div>
                      
                      {/* Condition Name */}
                      <h4 className="font-bold text-slate-800">{condition.name.en}</h4>
                      <p className="text-sm text-slate-600 mb-2">{condition.name.hi}</p>
                      
                      {/* Description */}
                      <p className="text-sm text-slate-600">
                        {condition.description[language]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm text-amber-800 font-medium mb-1">
                      {language === 'en' ? 'DISCLAIMER' : 'अस्वीकरण'}
                    </p>
                    <p className="text-sm text-amber-700">{t.disclaimer}</p>
                    {language === 'en' && (
                      <p className="text-xs text-amber-600 mt-1">{t.disclaimerHi}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connect with Doctor - Only for HIGH risk */}
          {result.level === 'HIGH' && isOnline && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-2xl">
                  📞
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{t.connectDoctor}</h3>
                  <p className="text-sm text-slate-600">{t.connectDesc}</p>
                </div>
              </div>

              {/* Call Options */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => { setShowDoctorModal(true); startCall('video'); }}
                  className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <span className="text-2xl">📹</span>
                  <span className="text-xs font-semibold text-slate-700">{t.videoCall}</span>
                </button>
                <button
                  onClick={() => { setShowDoctorModal(true); startCall('audio'); }}
                  className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <span className="text-2xl">📞</span>
                  <span className="text-xs font-semibold text-slate-700">{t.audioCall}</span>
                </button>
                <button
                  onClick={() => { setShowDoctorModal(true); startCall('chat'); }}
                  className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <span className="text-2xl">💬</span>
                  <span className="text-xs font-semibold text-slate-700">{t.chat}</span>
                </button>
              </div>

              {/* Availability Info */}
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span>⏰</span> {t.estimatedWait}: 2-5 {t.minutes}
                </span>
                <span className="flex items-center gap-1">
                  <span>👨‍⚕️</span> 3 {t.doctorsAvailable}
                </span>
              </div>
            </div>
          )}

          {/* OR Divider - Only for HIGH risk */}
          {result.level === 'HIGH' && isOnline && (
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm font-medium text-slate-400">{t.orDivider}</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          )}

          {/* Saved Confirmation */}
          <div className={`border-2 ${config.badge} border rounded-xl p-4 text-center font-medium mb-6`}>
            <span className="text-lg mr-2">✓</span>
            {t.saved}
          </div>
        </main>

        {/* Bottom Bar - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
            {/* View Pathway Button */}
            <button
              onClick={() => router.push('/pathway')}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg active:scale-[0.98] transition-all"
            >
              {t.viewGuidance} →
            </button>

            {/* New Check Link */}
            <button
              onClick={() => router.push('/')}
              className="w-full text-center text-slate-500 hover:text-slate-700 py-2 text-sm font-medium"
            >
              {t.newCheck}
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Connect Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-bold text-lg text-slate-900">{t.connectDoctor}</h2>
              <button
                onClick={() => { setShowDoctorModal(false); cancelCall(); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Doctor Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl">
                  👨‍⚕️
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {language === 'en' ? mockDoctor.name : mockDoctor.nameHi}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {mockDoctor.specialty[language]} | {mockDoctor.experience} {t.yearsExp}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-slate-700">
                      {mockDoctor.rating} ({mockDoctor.reviews} {t.reviews})
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {t.availableNow}
                  </span>
                </div>
              </div>

              {/* Case Summary */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-medium text-amber-800 mb-2">{t.caseSummaryShared}:</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• {t.symptoms}: {getSymptomLabels()}</li>
                  <li>• {t.riskLevel}: {t.high}</li>
                  <li>• {t.duration}: {getDurationLabel()}</li>
                </ul>
              </div>

              {/* Call Status Area */}
              <div className="bg-slate-900 rounded-2xl p-8 text-center">
                {callStatus === 'connecting' && (
                  <>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500/40 flex items-center justify-center animate-pulse">
                        <span className="text-4xl">
                          {callType === 'video' ? '🎥' : callType === 'audio' ? '📞' : '💬'}
                        </span>
                      </div>
                    </div>
                    <p className="text-white font-medium mb-1">{t.connecting}</p>
                    <p className="text-slate-400 text-sm">{t.demoNote}</p>
                  </>
                )}
                {callStatus === 'connected' && (
                  <>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/40 flex items-center justify-center">
                        <span className="text-4xl">
                          {callType === 'video' ? '🎥' : callType === 'audio' ? '📞' : '💬'}
                        </span>
                      </div>
                    </div>
                    <p className="text-emerald-400 font-medium mb-1">✓ {t.connected}</p>
                    <p className="text-white text-sm mb-1">
                      {callType === 'video' ? t.startingCall : callType === 'audio' ? t.startingAudio : t.startingChat}
                    </p>
                    <p className="text-slate-400 text-xs">({t.demoNote})</p>
                  </>
                )}
                {callStatus === 'idle' && (
                  <>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-4xl">📞</span>
                    </div>
                    <p className="text-slate-400 text-sm">{language === 'en' ? 'Select a call type above' : 'ऊपर कॉल प्रकार चुनें'}</p>
                  </>
                )}
              </div>

              {/* Cancel Button */}
              {callStatus !== 'idle' && (
                <button
                  onClick={cancelCall}
                  className="w-full py-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors"
                >
                  {t.cancelCall}
                </button>
              )}

              {/* Hospitals & Emergency */}
              <div className="border-t border-slate-200 pt-5">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span>🏥</span> {t.nearestHospitals}:
                </h4>
                <ul className="space-y-2 mb-4">
                  {nearestHospitals.map((hospital, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">• {hospital.name}</span>
                      <span className="text-slate-500">{hospital.distance}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                >
                  <span>📞</span> {t.emergency}: 108
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
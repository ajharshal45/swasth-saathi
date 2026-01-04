import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCases, validateCase as validateCaseAPI, getEpidemicData } from '@/lib/api';

// ============================================================
// SYMPTOM LABELS (for display)
// ============================================================
const symptomLabels = {
  fever: { en: 'Fever', hi: 'बुखार' },
  headache: { en: 'Headache', hi: 'सिरदर्द' },
  cough: { en: 'Cough', hi: 'खांसी' },
  cold: { en: 'Cold', hi: 'जुकाम' },
  stomach: { en: 'Stomach Pain', hi: 'पेट दर्द' },
  vomiting: { en: 'Vomiting', hi: 'उल्टी' },
  diarrhea: { en: 'Diarrhea', hi: 'दस्त' },
  weakness: { en: 'Weakness', hi: 'कमज़ोरी' },
  bodyPain: { en: 'Body Pain', hi: 'बदन दर्द' },
  breathing: { en: 'Breathing Issue', hi: 'सांस की तकलीफ' },
  chills: { en: 'Chills', hi: 'कंपकंपी' },
  fatigue: { en: 'Extreme Tiredness', hi: 'अत्यधिक थकान' },
  nausea: { en: 'Nausea', hi: 'मतली' },
  dizziness: { en: 'Dizziness', hi: 'चक्कर आना' },
  jointPain: { en: 'Joint Pain', hi: 'जोड़ों में दर्द' },
  rash: { en: 'Skin Rash', hi: 'त्वचा पर चकत्ते' },
  soreThroat: { en: 'Sore Throat', hi: 'गले में खराश' },
};

// ============================================================
// EPIDEMIC RADAR DATA (Mock for demo)
// ============================================================
const mockEpidemicData = [
  { 
    id: 'fever',
    icon: '🌡️',
    labelEn: 'Fever',
    labelHi: 'बुखार',
    count: 45,
    previousCount: 37,
    trend: 'up',
    changePercent: 23,
    status: 'alert'
  },
  { 
    id: 'cough',
    icon: '🤧',
    labelEn: 'Cough',
    labelHi: 'खांसी',
    count: 32,
    previousCount: 31,
    trend: 'stable',
    changePercent: 2,
    status: 'normal'
  },
  { 
    id: 'headache',
    icon: '🤕',
    labelEn: 'Headache',
    labelHi: 'सिरदर्द',
    count: 28,
    previousCount: 30,
    trend: 'down',
    changePercent: -5,
    status: 'normal'
  },
  { 
    id: 'vomiting',
    icon: '🤢',
    labelEn: 'Vomiting',
    labelHi: 'उल्टी',
    count: 18,
    previousCount: 16,
    trend: 'up',
    changePercent: 12,
    status: 'watch'
  },
  { 
    id: 'weakness',
    icon: '😫',
    labelEn: 'Weakness',
    labelHi: 'कमज़ोरी',
    count: 15,
    previousCount: 15,
    trend: 'stable',
    changePercent: 0,
    status: 'normal'
  },
];

// ============================================================
// CONTENT TRANSLATIONS
// ============================================================
const content = {
  en: {
    title: 'Doctor Dashboard',
    subtitle: 'Review and validate patient cases',
    pendingCases: 'Pending Cases',
    validatedCases: 'Validated Cases',
    reviewCase: 'Review Case →',
    noCases: 'No cases to review. Cases will appear here when patients complete their health check.',
    
    // Modal
    patientSummary: 'Patient Summary',
    ageGroup: 'Age Group',
    symptoms: 'Symptoms',
    duration: 'Duration',
    severity: 'Severity',
    conditions: 'Existing Conditions',
    medicine: 'Medicine Taken',
    mode: 'Mode',
    submitted: 'Submitted',
    
    systemReasoning: 'System Triage Reasoning',
    riskLevel: 'Risk Level',
    factorsConsidered: 'Factors considered',
    recommendation: 'Recommendation',
    
    doctorAction: 'Doctor Action',
    commentPlaceholder: 'Enter notes for patient/ASHA worker (optional)',
    approveBtn: '✅ Approve Recommendation',
    suggestVisitBtn: '📞 Suggest Immediate Doctor Visit',
    validatedBy: 'Validated by Doctor',
    
    // Epidemic Radar
    epidemicTitle: 'Epidemic Radar',
    epidemicSubtitle: 'Anonymous symptom trends (public health view)',
    alertPrefix: 'ALERT:',
    casesIncreased: 'cases increased',
    thisWeek: 'this week',
    symptomCol: 'Symptom',
    thisWeekCol: 'This Week',
    trendCol: 'Trend',
    statusCol: 'Status',
    cases: 'cases',
    last7Days: 'Last 7 days',
    demoRegion: 'Demo Region',
    simulatedData: 'Simulated data for demonstration',
    
    // Risk levels
    high: 'HIGH',
    medium: 'MEDIUM', 
    low: 'LOW',
    
    // Status
    alert: 'Alert',
    watch: 'Watch',
    normal: 'Normal',
    
    // Network
    online: 'Online',
    offline: 'Offline',
    
    // Time
    minsAgo: 'mins ago',
    hoursAgo: 'hours ago',
    justNow: 'Just now',
    
    // Value labels
    'below18': 'Below 18 years',
    '18-40': '18-40 years',
    '41-60': '41-60 years',
    'above60': 'Above 60 years',
    'today': 'Just started',
    '1-2': '1-2 days',
    '3-5': '3-5 days',
    'more5': '5+ days',
    'mild': 'Mild',
    'moderate': 'Moderate',
    'severe': 'Severe',
    'yes': 'Yes',
    'no': 'No',
    'none': 'No medicine',
    'paracetamol': 'Paracetamol',
    'other': 'Other medicine',
    'unsure': 'Not sure',
    
    // Success
    caseValidated: 'Case validated successfully ✓',
    
    // Back
    backHome: '← Back to Home',
    
    // Data source
    liveData: 'LIVE DATA',
    demoData: 'DEMO DATA',
    loadingData: 'Loading epidemic data...',
    refresh: 'Refresh',
    noEpidemicData: 'No epidemic data available yet. Submit cases to see trends.',
  },
  hi: {
    title: 'डॉक्टर डैशबोर्ड',
    subtitle: 'मरीजों के मामलों की समीक्षा और सत्यापन करें',
    pendingCases: 'लंबित मामले',
    validatedCases: 'सत्यापित मामले',
    reviewCase: 'मामला देखें →',
    noCases: 'कोई मामला नहीं। मरीज़ के स्वास्थ्य जांच पूरी करने पर मामले यहां दिखेंगे।',
    
    patientSummary: 'मरीज का सारांश',
    ageGroup: 'आयु वर्ग',
    symptoms: 'लक्षण',
    duration: 'अवधि',
    severity: 'गंभीरता',
    conditions: 'मौजूदा बीमारी',
    medicine: 'ली गई दवा',
    mode: 'मोड',
    submitted: 'जमा किया',
    
    systemReasoning: 'सिस्टम ट्राइएज तर्क',
    riskLevel: 'जोखिम स्तर',
    factorsConsidered: 'विचार किए गए कारक',
    recommendation: 'सिफारिश',
    
    doctorAction: 'डॉक्टर की कार्रवाई',
    commentPlaceholder: 'मरीज/आशा कार्यकर्ता के लिए नोट्स (वैकल्पिक)',
    approveBtn: '✅ सिफारिश स्वीकृत करें',
    suggestVisitBtn: '📞 तत्काल डॉक्टर से मिलने का सुझाव',
    validatedBy: 'डॉक्टर द्वारा सत्यापित',
    
    epidemicTitle: 'एपिडेमिक रडार',
    epidemicSubtitle: 'गुमनाम लक्षण रुझान (सार्वजनिक स्वास्थ्य दृश्य)',
    alertPrefix: 'अलर्ट:',
    casesIncreased: 'मामले बढ़े',
    thisWeek: 'इस सप्ताह',
    symptomCol: 'लक्षण',
    thisWeekCol: 'इस सप्ताह',
    trendCol: 'रुझान',
    statusCol: 'स्थिति',
    cases: 'मामले',
    last7Days: 'पिछले 7 दिन',
    demoRegion: 'डेमो क्षेत्र',
    simulatedData: 'प्रदर्शन के लिए सिम्युलेटेड डेटा',
    
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',
    
    alert: 'अलर्ट',
    watch: 'निगरानी',
    normal: 'सामान्य',
    
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    
    minsAgo: 'मिनट पहले',
    hoursAgo: 'घंटे पहले',
    justNow: 'अभी',
    
    'below18': '18 वर्ष से कम',
    '18-40': '18-40 वर्ष',
    '41-60': '41-60 वर्ष',
    'above60': '60 वर्ष से ऊपर',
    'today': 'आज ही शुरू',
    '1-2': '1-2 दिन',
    '3-5': '3-5 दिन',
    'more5': '5+ दिन',
    'mild': 'हल्का',
    'moderate': 'मध्यम',
    'severe': 'गंभीर',
    'yes': 'हाँ',
    'no': 'नहीं',
    'none': 'कोई दवा नहीं',
    'paracetamol': 'पैरासिटामोल',
    'other': 'अन्य दवा',
    'unsure': 'पता नहीं',
    
    caseValidated: 'मामला सफलतापूर्वक सत्यापित ✓',
    
    backHome: '← होम पर वापस',
    
    // Data source
    liveData: 'लाइव डेटा',
    demoData: 'डेमो डेटा',
    loadingData: 'एपिडेमिक डेटा लोड हो रहा है...',
    refresh: 'रीफ्रेश',
    noEpidemicData: 'अभी कोई एपिडेमिक डेटा उपलब्ध नहीं है। रुझान देखने के लिए केस सबमिट करें।',
  }
};

// ============================================================
// MOCK CASES (for demo)
// ============================================================
const createMockCases = () => [
  {
    id: 'CASE-1023',
    symptoms: ['fever', 'cough', 'breathing'],
    ageGroup: '41-60',
    duration: '3-5',
    severity: 'severe',
    conditions: 'yes',
    medicine: 'paracetamol',
    riskLevel: 'HIGH',
    reasoning: {
      en: 'Breathing difficulty with fever in patient with existing conditions requires urgent attention.',
      hi: 'मौजूदा बीमारी वाले मरीज में सांस की तकलीफ और बुखार पर तुरंत ध्यान देना जरूरी है।'
    },
    factors: [
      { en: 'Breathing difficulty detected', hi: 'सांस की तकलीफ पाई गई' },
      { en: 'Severe symptoms reported', hi: 'गंभीर लक्षण रिपोर्ट किए गए' },
      { en: 'Existing health condition present', hi: 'पहले से स्वास्थ्य समस्या है' },
      { en: 'Symptoms lasting 3+ days', hi: 'लक्षण 3+ दिनों से हैं' },
    ],
    mode: 'offline',
    submittedAt: new Date(Date.now() - 5 * 60 * 1000),
    validated: false,
    validatedAt: null,
    doctorComment: null,
  },
  {
    id: 'CASE-1022',
    symptoms: ['headache', 'weakness', 'bodyPain'],
    ageGroup: '18-40',
    duration: '1-2',
    severity: 'moderate',
    conditions: 'no',
    medicine: 'none',
    riskLevel: 'MEDIUM',
    reasoning: {
      en: 'Multiple symptoms with moderate severity. Monitor closely and rest.',
      hi: 'मध्यम गंभीरता के साथ कई लक्षण। ध्यान से निगरानी करें और आराम करें।'
    },
    factors: [
      { en: 'Multiple symptoms detected (3)', hi: 'कई लक्षण पाए गए (3)' },
      { en: 'Moderate severity level', hi: 'मध्यम गंभीरता स्तर' },
    ],
    mode: 'online',
    submittedAt: new Date(Date.now() - 15 * 60 * 1000),
    validated: false,
    validatedAt: null,
    doctorComment: null,
  },
  {
    id: 'CASE-1021',
    symptoms: ['cold', 'cough'],
    ageGroup: '18-40',
    duration: 'today',
    severity: 'mild',
    conditions: 'no',
    medicine: 'none',
    riskLevel: 'LOW',
    reasoning: {
      en: 'Mild symptoms that started today. Home care should help.',
      hi: 'हल्के लक्षण जो आज शुरू हुए। घरेलू देखभाल से मदद मिलनी चाहिए।'
    },
    factors: [
      { en: 'Mild symptoms only', hi: 'केवल हल्के लक्षण' },
      { en: 'Just started today', hi: 'आज ही शुरू हुए' },
      { en: 'No existing conditions', hi: 'कोई पुरानी बीमारी नहीं' },
    ],
    mode: 'online',
    submittedAt: new Date(Date.now() - 60 * 60 * 1000),
    validated: true,
    validatedAt: new Date(Date.now() - 30 * 60 * 1000),
    doctorComment: 'Rest and drink warm fluids. Return if symptoms worsen.',
  },
];

// ============================================================
// TIME AGO HELPER
// ============================================================
function timeAgo(date, lang) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const t = content[lang];
  
  if (seconds < 60) return t.justNow;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t.minsAgo}`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${t.hoursAgo}`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DoctorDashboard() {
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [doctorComment, setDoctorComment] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [epidemicSymptoms, setEpidemicSymptoms] = useState(mockEpidemicData);
  const [loading, setLoading] = useState(true);
  const [epidemicLoading, setEpidemicLoading] = useState(true);
  const [dataSource, setDataSource] = useState('loading'); // 'live' | 'mock' | 'loading'

  const t = content[language];

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('swasth-language');
    if (saved) setLanguage(saved);
  }, []);

  // Load cases from API
  useEffect(() => {
    loadData();
  }, []);

  // Function to load all data
  async function loadData() {
    setLoading(true);
    setEpidemicLoading(true);
    setDataSource('loading');
    
    try {
      const [casesData, epidemicResponse] = await Promise.all([
        getCases('all'),
        getEpidemicData(7)
      ]);
      
      // Transform API response to match expected format
      const transformedCases = casesData.map(c => ({
        id: c.id,
        symptoms: c.symptoms || [],
        ageGroup: c.ageGroup,
        duration: c.duration,
        severity: c.severity,
        conditions: c.conditions,
        medicine: c.medicine,
        riskLevel: c.riskLevel || 'MEDIUM',
        reasoning: {
          en: c.reasoningEn || 'Based on reported symptoms and health factors.',
          hi: c.reasoningHi || 'रिपोर्ट किए गए लक्षणों और स्वास्थ्य कारकों के आधार पर।'
        },
        factors: (c.symptoms || []).slice(0, 3).map(s => ({
          en: `${s} detected`,
          hi: `${s} पाया गया`
        })),
        mode: c.mode || 'online',
        submittedAt: new Date(c.submittedAt),
        validated: c.validated || false,
        validatedAt: c.validatedAt ? new Date(c.validatedAt) : null,
        doctorComment: c.doctorComment,
        isRealCase: true,
      }));
      
      // If no cases from API, use mock cases for demo
      if (transformedCases.length === 0) {
        setCases(createMockCases());
      } else {
        setCases(transformedCases);
      }
      
      // Update epidemic data from API
      if (epidemicResponse.symptoms && epidemicResponse.symptoms.length > 0) {
        const apiEpidemicData = epidemicResponse.symptoms.map(s => ({
          id: s.id,
          icon: getSymptomIcon(s.id),
          labelEn: symptomLabels[s.id]?.en || s.id,
          labelHi: symptomLabels[s.id]?.hi || s.id,
          count: s.count,
          previousCount: s.previousCount,
          trend: s.trend,
          changePercent: s.changePercent,
          status: s.changePercent > 20 ? 'alert' : (s.changePercent > 10 ? 'watch' : 'normal')
        }));
        setEpidemicSymptoms(apiEpidemicData);
        setDataSource('live');
      } else {
        // Use mock data if no real epidemic data
        setEpidemicSymptoms(mockEpidemicData);
        setDataSource('mock');
      }
    } catch (error) {
      console.error('Failed to load data from API:', error);
      // Fallback to mock data
      setCases(createMockCases());
      setEpidemicSymptoms(mockEpidemicData);
      setDataSource('mock');
    } finally {
      setLoading(false);
      setEpidemicLoading(false);
    }
  }

  // Refresh epidemic data only
  async function refreshEpidemicData() {
    setEpidemicLoading(true);
    setDataSource('loading');
    
    try {
      const epidemicResponse = await getEpidemicData(7);
      
      if (epidemicResponse.symptoms && epidemicResponse.symptoms.length > 0) {
        const apiEpidemicData = epidemicResponse.symptoms.map(s => ({
          id: s.id,
          icon: getSymptomIcon(s.id),
          labelEn: symptomLabels[s.id]?.en || s.id,
          labelHi: symptomLabels[s.id]?.hi || s.id,
          count: s.count,
          previousCount: s.previousCount,
          trend: s.trend,
          changePercent: s.changePercent,
          status: s.changePercent > 20 ? 'alert' : (s.changePercent > 10 ? 'watch' : 'normal')
        }));
        setEpidemicSymptoms(apiEpidemicData);
        setDataSource('live');
      } else {
        setEpidemicSymptoms(mockEpidemicData);
        setDataSource('mock');
      }
    } catch (error) {
      console.error('Failed to refresh epidemic data:', error);
      setEpidemicSymptoms(mockEpidemicData);
      setDataSource('mock');
    } finally {
      setEpidemicLoading(false);
    }
  }

  // Helper to get symptom icon
  const getSymptomIcon = (symptomId) => {
    const icons = {
      fever: '🌡️', cough: '🤧', headache: '🤕', vomiting: '🤢',
      weakness: '😫', cold: '🤧', stomach: '🤢', diarrhea: '💧',
      bodyPain: '😣', breathing: '😮‍💨', chills: '🥶', fatigue: '😴',
      nausea: '🤢', dizziness: '😵', jointPain: '🦴', rash: '🔴', soreThroat: '😷'
    };
    return icons[symptomId] || '🩺';
  };

  // Network status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Toggle language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('swasth-language', lang);
  };

  // Open review modal
  const openReview = (caseItem) => {
    setSelectedCase(caseItem);
    setDoctorComment('');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCase(null);
    setDoctorComment('');
  };

  // Validate case
  const handleValidate = async (action) => {
    if (!selectedCase) return;
    
    const comment = doctorComment || (action === 'suggest' ? 'Please visit a doctor immediately.' : '');
    
    try {
      // Call API to validate
      await validateCaseAPI(selectedCase.id, comment);
      
      // Update local state
      setCases(prev => prev.map(c => 
        c.id === selectedCase.id 
          ? { 
              ...c, 
              validated: true, 
              validatedAt: new Date(),
              doctorComment: comment,
            } 
          : c
      ));
      
      closeModal();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to validate case:', error);
      // Still update locally even if API fails
      setCases(prev => prev.map(c => 
        c.id === selectedCase.id 
          ? { 
              ...c, 
              validated: true, 
              validatedAt: new Date(),
              doctorComment: comment,
            } 
          : c
      ));
      closeModal();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Separate pending and validated cases
  const pendingCases = cases.filter(c => !c.validated);
  const validatedCases = cases.filter(c => c.validated);

  // Risk level styles
  const riskStyles = {
    HIGH: { 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      badge: 'bg-red-100 text-red-700 border border-red-300', 
      dot: '🔴',
      text: t.high 
    },
    MEDIUM: { 
      bg: 'bg-amber-50', 
      border: 'border-amber-200', 
      badge: 'bg-amber-100 text-amber-700 border border-amber-300', 
      dot: '🟡',
      text: t.medium 
    },
    LOW: { 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200', 
      badge: 'bg-emerald-100 text-emerald-700 border border-emerald-300', 
      dot: '🟢',
      text: t.low 
    },
  };

  // Get alert symptom (highest increase)
  const alertSymptom = epidemicSymptoms.find(e => e.status === 'alert');

  return (
    <>
      <Head>
        <title>{t.title} - Swasth Saathi</title>
        <meta name="description" content="Doctor dashboard for reviewing patient cases" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-800">
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-black text-lg text-emerald-600 hover:text-emerald-700 transition-colors">
              <span className="text-2xl">❤️</span>
              <span>Swasth Saathi</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Toggle */}
              <div className="flex rounded-full overflow-hidden border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`px-3 py-1.5 transition-all ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => toggleLanguage('hi')}
                  className={`px-3 py-1.5 transition-all ${
                    language === 'hi'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* Network Status */}
              <span
                className={`flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {isOnline ? t.online : t.offline}
              </span>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* MAIN CONTENT */}
        {/* ============================================================ */}
        <main className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
                👨‍⚕️
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t.title}</h1>
                <p className="text-slate-500 font-medium">{t.subtitle}</p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CASE LIST */}
          {/* ============================================================ */}
          <section className="mb-10">
            {/* Pending Cases */}
            <div className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                <span className="text-xl">📋</span>
                {t.pendingCases} ({pendingCases.length})
              </h2>

              {pendingCases.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-slate-500 font-medium">{t.noCases}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCases.map((caseItem) => {
                    const style = riskStyles[caseItem.riskLevel] || riskStyles.MEDIUM;
                    
                    return (
                      <div
                        key={caseItem.id}
                        className={`bg-white rounded-2xl border-2 ${style.border} p-5 hover:shadow-lg transition-all ${
                          caseItem.isRealCase ? 'ring-2 ring-emerald-400 ring-offset-2' : ''
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {caseItem.isRealCase && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                                🆕 NEW
                              </span>
                            )}
                            <span className="font-bold text-slate-800">{caseItem.id}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${style.badge}`}>
                            {style.dot} {style.text}
                          </span>
                        </div>

                        {/* Mode + Time */}
                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                          <span className={`flex items-center gap-1 ${caseItem.mode === 'offline' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {caseItem.mode === 'offline' ? '📴' : '🟢'} {caseItem.mode === 'offline' ? t.offline : t.online}
                          </span>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            ⏱ {timeAgo(caseItem.submittedAt, language)}
                          </span>
                        </div>

                        {/* Symptoms */}
                        <div className="mb-4">
                          <span className="text-sm font-semibold text-slate-700">{t.symptoms}: </span>
                          <span className="text-sm text-slate-600">
                            {caseItem.symptoms.map(s => symptomLabels[s]?.[language] || s).join(', ')}
                          </span>
                        </div>

                        {/* Review Button */}
                        <button
                          onClick={() => openReview(caseItem)}
                          className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 hover:scale-105 transition-all shadow-md"
                        >
                          {t.reviewCase}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Validated Cases */}
            {validatedCases.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                  <span className="text-xl">✅</span>
                  {t.validatedCases} ({validatedCases.length})
                </h2>

                <div className="space-y-3">
                  {validatedCases.map((caseItem) => {
                    const style = riskStyles[caseItem.riskLevel] || riskStyles.LOW;
                    
                    return (
                      <div
                        key={caseItem.id}
                        className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800">{caseItem.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                              {style.dot} {style.text}
                            </span>
                          </div>
                          <span className="text-sm text-emerald-700 font-medium flex items-center gap-1">
                            ✓ {t.validatedBy} • {caseItem.validatedAt ? timeAgo(caseItem.validatedAt, language) : ''}
                          </span>
                        </div>
                        {caseItem.doctorComment && (
                          <p className="mt-2 text-sm text-slate-600 italic bg-white/50 rounded-lg p-2">
                            "{caseItem.doctorComment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ============================================================ */}
          {/* EPIDEMIC RADAR */}
          {/* ============================================================ */}
          <section className="mb-10">
            <div className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-50 flex items-center justify-center text-xl">
                    📊
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-slate-900">{t.epidemicTitle}</h2>
                    <p className="text-sm text-slate-500">{t.epidemicSubtitle}</p>
                  </div>
                </div>
                
                {/* Data Source Badge + Refresh */}
                <div className="flex items-center gap-2">
                  {dataSource === 'live' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {t.liveData}
                    </span>
                  ) : dataSource === 'mock' ? (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                      📋 {t.demoData}
                    </span>
                  ) : null}
                  
                  <button
                    onClick={refreshEpidemicData}
                    disabled={epidemicLoading}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-full text-sm font-medium text-slate-600 transition-colors flex items-center gap-1"
                  >
                    <span className={epidemicLoading ? 'animate-spin' : ''}>🔄</span>
                    {t.refresh}
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {epidemicLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600 font-medium">{t.loadingData}</span>
                </div>
              )}

              {/* Content when not loading */}
              {!epidemicLoading && (
                <>
                  {/* Alert Box */}
                  {alertSymptom && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 animate-pulse">
                      <div className="flex items-center gap-2 text-red-700 font-bold">
                        <span className="text-lg">⚠️</span>
                        <span>{t.alertPrefix}</span>
                        <span>{language === 'en' ? alertSymptom.labelEn : alertSymptom.labelHi}</span>
                        <span>{t.casesIncreased} {alertSymptom.changePercent}% {t.thisWeek}</span>
                      </div>
                    </div>
                  )}

                  {/* No Data State */}
                  {epidemicSymptoms.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📊</div>
                      <p className="text-slate-500 font-medium">{t.noEpidemicData}</p>
                    </div>
                  ) : (
                    /* Data Table */
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-slate-100">
                            <th className="text-left py-3 px-2 font-bold text-slate-600">{t.symptomCol}</th>
                            <th className="text-center py-3 px-2 font-bold text-slate-600">{t.thisWeekCol}</th>
                            <th className="text-center py-3 px-2 font-bold text-slate-600">{t.trendCol}</th>
                            <th className="text-center py-3 px-2 font-bold text-slate-600">{t.statusCol}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {epidemicSymptoms.map((item) => (
                            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                              <td className="py-3 px-2">
                                <span className="flex items-center gap-2">
                                  <span>{item.icon}</span>
                                  <span className="font-medium">{language === 'en' ? item.labelEn : item.labelHi}</span>
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center font-semibold">
                                {item.count} {t.cases}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className={`font-bold ${
                                  item.trend === 'up' ? 'text-red-600' : 
                                  item.trend === 'down' ? 'text-emerald-600' : 'text-slate-500'
                                }`}>
                                  {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} 
                                  {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  item.status === 'alert' ? 'bg-red-100 text-red-700' :
                                  item.status === 'watch' ? 'bg-amber-100 text-amber-700' :
                                  'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {item.status === 'alert' ? `🔴 ${t.alert}` :
                                   item.status === 'watch' ? `🟡 ${t.watch}` :
                                   `🟢 ${t.normal}`}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>📅 {t.last7Days} | 📍 {t.demoRegion}</span>
                <span>
                  {dataSource === 'live' 
                    ? `✅ ${language === 'en' ? 'Real-time data from backend' : 'बैकएंड से रियल-टाइम डेटा'}`
                    : `ℹ️ ${t.simulatedData}`
                  }
                </span>
              </div>
            </div>
          </section>

          {/* Back to Home */}
          <div className="text-center pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 hover:gap-3 transition-all"
            >
              {t.backHome}
            </Link>
          </div>
        </main>

        {/* ============================================================ */}
        {/* REVIEW MODAL */}
        {/* ============================================================ */}
        {showModal && selectedCase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-black text-xl text-slate-900">{selectedCase.id}</h3>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                
                {/* Patient Summary */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    {t.patientSummary}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">{t.ageGroup}:</span>
                      <span className="ml-2 font-semibold">{t[selectedCase.ageGroup] || selectedCase.ageGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t.duration}:</span>
                      <span className="ml-2 font-semibold">{t[selectedCase.duration] || selectedCase.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t.severity}:</span>
                      <span className="ml-2 font-semibold">{t[selectedCase.severity] || selectedCase.severity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t.conditions}:</span>
                      <span className="ml-2 font-semibold">{t[selectedCase.conditions] || selectedCase.conditions}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t.medicine}:</span>
                      <span className="ml-2 font-semibold">{t[selectedCase.medicine] || selectedCase.medicine}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{t.mode}:</span>
                      <span className={`ml-2 font-semibold ${selectedCase.mode === 'offline' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {selectedCase.mode === 'offline' ? `📴 ${t.offline}` : `🟢 ${t.online}`}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">{t.symptoms}:</span>
                      <span className="ml-2 font-semibold">
                        {selectedCase.symptoms.map(s => symptomLabels[s]?.[language] || s).join(', ')}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">{t.submitted}:</span>
                      <span className="ml-2 font-semibold">{timeAgo(selectedCase.submittedAt, language)}</span>
                    </div>
                  </div>
                </div>

                {/* System Reasoning */}
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">🧠</span>
                    {t.systemReasoning}
                  </h4>
                  
                  {/* Risk Level */}
                  <div className="mb-4">
                    <span className="text-blue-800 font-medium">{t.riskLevel}: </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                      riskStyles[selectedCase.riskLevel]?.badge || ''
                    }`}>
                      {riskStyles[selectedCase.riskLevel]?.dot} {riskStyles[selectedCase.riskLevel]?.text}
                    </span>
                  </div>

                  {/* Factors */}
                  <div className="mb-4">
                    <span className="text-blue-800 font-medium block mb-2">{t.factorsConsidered}:</span>
                    <ul className="space-y-1">
                      {selectedCase.factors?.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{factor[language] || factor.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white/50 rounded-xl p-3">
                    <span className="text-blue-800 font-medium block mb-1">{t.recommendation}:</span>
                    <p className="text-blue-900 font-semibold">
                      "{selectedCase.reasoning?.[language] || selectedCase.reasoning?.en}"
                    </p>
                  </div>
                </div>

                {/* Doctor Action */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">👨‍⚕️</span>
                    {t.doctorAction}
                  </h4>
                  
                  {/* Comment Box */}
                  <textarea
                    value={doctorComment}
                    onChange={(e) => setDoctorComment(e.target.value)}
                    placeholder={t.commentPlaceholder}
                    className="w-full p-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-400 focus:outline-none resize-none h-24 text-sm mb-4"
                  />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleValidate('approve')}
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg"
                    >
                      {t.approveBtn}
                    </button>
                    <button
                      onClick={() => handleValidate('suggest')}
                      className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-lg"
                    >
                      {t.suggestVisitBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SUCCESS TOAST */}
        {/* ============================================================ */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-bounce">
              {t.caseValidated}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

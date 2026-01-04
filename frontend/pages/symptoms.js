import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// ============================================================
// SYMPTOM GROUPS (existing)
// ============================================================
const symptomGroups = [
  {
    id: 'general',
    en: 'General & Fever',
    hi: 'सामान्य और बुखार',
    symptoms: [
      { id: 'fever', en: 'Fever', hi: 'बुखार' },
      { id: 'chills', en: 'Chills', hi: 'कंपकंपी' },
      { id: 'weakness', en: 'Weakness', hi: 'कमज़ोरी' },
      { id: 'fatigue', en: 'Extreme Tiredness', hi: 'अत्यधिक थकान' },
      { id: 'bodyPain', en: 'Body Pain', hi: 'बदन दर्द' },
      { id: 'lossAppetite', en: 'Loss of Appetite', hi: 'भूख न लगना' },
    ],
  },
  {
    id: 'head',
    en: 'Head & Senses',
    hi: 'सिर और इंद्रियां',
    symptoms: [
      { id: 'headache', en: 'Headache', hi: 'सिरदर्द' },
      { id: 'dizziness', en: 'Dizziness', hi: 'चक्कर आना' },
      { id: 'eyePain', en: 'Eye Pain', hi: 'आँखों में दर्द' },
      { id: 'eyeRedness', en: 'Red Eyes', hi: 'आँखों की लालिमा' },
      { id: 'blurredVision', en: 'Blurred Vision', hi: 'धुंधला दिखना' },
      { id: 'earPain', en: 'Ear Pain', hi: 'कान दर्द' },
      { id: 'hearingIssue', en: 'Hearing Problem', hi: 'सुनने में समस्या' },
      { id: 'toothPain', en: 'Tooth Pain', hi: 'दांत दर्द' },
      { id: 'mouthUlcer', en: 'Mouth Ulcers', hi: 'मुंह में छाले' },
    ],
  },
  {
    id: 'respiratory',
    en: 'Cold & Breathing',
    hi: 'सर्दी और सांस',
    symptoms: [
      { id: 'cough', en: 'Cough', hi: 'खांसी' },
      { id: 'cold', en: 'Cold', hi: 'जुकाम' },
      { id: 'soreThroat', en: 'Sore Throat', hi: 'गले में खराश' },
      { id: 'runnyNose', en: 'Runny Nose', hi: 'नाक बहना' },
      { id: 'breathing', en: 'Breathing Issue', hi: 'सांस की तकलीफ' },
      { id: 'chestTightness', en: 'Chest Tightness', hi: 'सीने में जकड़न' },
      { id: 'lossSmell', en: 'Loss of Smell', hi: 'सूंघने की शक्ति कम होना' },
      { id: 'lossTaste', en: 'Loss of Taste', hi: 'स्वाद न आना' },
    ],
  },
  {
    id: 'digestive',
    en: 'Stomach & Digestion',
    hi: 'पेट और पाचन',
    symptoms: [
      { id: 'stomach', en: 'Stomach Pain', hi: 'पेट दर्द' },
      { id: 'vomiting', en: 'Vomiting', hi: 'उल्टी' },
      { id: 'nausea', en: 'Nausea', hi: 'मतली' },
      { id: 'diarrhea', en: 'Diarrhea', hi: 'दस्त' },
      { id: 'constipation', en: 'Constipation', hi: 'कब्ज' },
      { id: 'bloating', en: 'Bloating', hi: 'पेट फूलना' },
      { id: 'acidReflux', en: 'Acid Reflux', hi: 'एसिडिटी' },
      { id: 'heartburn', en: 'Heartburn', hi: 'सीने में जलन' },
    ],
  },
  {
    id: 'pain',
    en: 'Muscle & Joint Pain',
    hi: 'मांसपेशी और जोड़ों का दर्द',
    symptoms: [
      { id: 'jointPain', en: 'Joint Pain', hi: 'जोड़ों में दर्द' },
      { id: 'musclePain', en: 'Muscle Pain', hi: 'मांसपेशियों में दर्द' },
      { id: 'backPain', en: 'Back Pain', hi: 'पीठ दर्द' },
      { id: 'neckPain', en: 'Neck Pain', hi: 'गर्दन दर्द' },
      { id: 'legPain', en: 'Leg Pain', hi: 'पैरों में दर्द' },
    ],
  },
  {
    id: 'skin',
    en: 'Skin & Swelling',
    hi: 'त्वचा और सूजन',
    symptoms: [
      { id: 'rash', en: 'Skin Rash', hi: 'त्वचा पर चकत्ते' },
      { id: 'itching', en: 'Itching', hi: 'खुजली' },
      { id: 'drySkin', en: 'Dry Skin', hi: 'सूखी त्वचा' },
      { id: 'excessSweating', en: 'Excess Sweating', hi: 'अधिक पसीना' },
      { id: 'coldHands', en: 'Cold Hands/Feet', hi: 'हाथ-पैर ठंडे' },
      { id: 'legSwelling', en: 'Leg Swelling', hi: 'पैरों में सूजन' },
      { id: 'handSwelling', en: 'Hand Swelling', hi: 'हाथों में सूजन' },
    ],
  },
  {
    id: 'urinary',
    en: 'Urinary & Weight',
    hi: 'मूत्र और वजन',
    symptoms: [
      { id: 'burningUrine', en: 'Burning Urination', hi: 'पेशाब में जलन' },
      { id: 'frequentUrine', en: 'Frequent Urination', hi: 'बार-बार पेशाब' },
      { id: 'darkUrine', en: 'Dark Urine', hi: 'गहरा पेशाब' },
      { id: 'weightLoss', en: 'Unexplained Weight Loss', hi: 'वजन कम होना' },
      { id: 'weightGain', en: 'Sudden Weight Gain', hi: 'अचानक वजन बढ़ना' },
    ],
  },
  {
    id: 'mental',
    en: 'Mind & Sleep',
    hi: 'मन और नींद',
    symptoms: [
      { id: 'anxiety', en: 'Anxiety', hi: 'घबराहट' },
      { id: 'lowMood', en: 'Low Mood', hi: 'मन उदास रहना' },
      { id: 'confusion', en: 'Confusion', hi: 'भ्रम' },
      { id: 'sleepIssues', en: 'Sleep Problems', hi: 'नींद की समस्या' },
      { id: 'tremors', en: 'Shaking/Tremors', hi: 'कंपन' },
      { id: 'palpitations', en: 'Fast Heartbeat', hi: 'दिल तेज धड़कना' },
    ],
  },
];

// ============================================================
// FOLLOW-UP QUESTIONS DATA (SMART CHECKER)
// ============================================================
const followUpQuestions = {
  fever: {
    id: 'fever',
    icon: '🌡️',
    title: { en: 'About your Fever', hi: 'आपके बुखार के बारे में' },
    questions: [
      {
        id: 'fever_temp',
        question: { 
          en: 'How high is your temperature?', 
          hi: 'आपका तापमान कितना है?' 
        },
        options: [
          { id: 'mild', en: 'Below 100°F (37.8°C) - Mild', hi: '100°F से कम - हल्का', riskWeight: 1 },
          { id: 'moderate', en: '100-102°F (37.8-39°C) - Moderate', hi: '100-102°F - मध्यम', riskWeight: 2 },
          { id: 'high', en: 'Above 102°F (39°C) - High', hi: '102°F से ऊपर - तेज', riskWeight: 3 },
          { id: 'unknown', en: "I don't know", hi: 'पता नहीं', riskWeight: 2 },
        ]
      },
      {
        id: 'fever_pattern',
        question: { 
          en: 'Is the fever continuous or does it come and go?', 
          hi: 'बुखार लगातार है या आता-जाता है?' 
        },
        options: [
          { id: 'continuous', en: 'Continuous', hi: 'लगातार', riskWeight: 2 },
          { id: 'intermittent', en: 'Comes and goes', hi: 'आता-जाता है', riskWeight: 1 },
          { id: 'night', en: 'Only at night', hi: 'सिर्फ रात में', riskWeight: 2 },
        ]
      }
    ]
  },
  
  cough: {
    id: 'cough',
    icon: '🤧',
    title: { en: 'About your Cough', hi: 'आपकी खांसी के बारे में' },
    questions: [
      {
        id: 'cough_type',
        question: { 
          en: 'What type of cough do you have?', 
          hi: 'आपको किस तरह की खांसी है?' 
        },
        options: [
          { id: 'dry', en: 'Dry cough (no mucus)', hi: 'सूखी खांसी (बिना बलगम)', riskWeight: 1 },
          { id: 'wet', en: 'Wet cough (with mucus/phlegm)', hi: 'बलगम वाली खांसी', riskWeight: 2 },
          { id: 'blood', en: 'Cough with blood (URGENT)', hi: 'खून वाली खांसी (तुरंत)', riskWeight: 5, urgent: true },
        ]
      },
      {
        id: 'cough_frequency',
        question: { 
          en: 'How often do you cough?', 
          hi: 'कितनी बार खांसी होती है?' 
        },
        options: [
          { id: 'occasional', en: 'Occasionally', hi: 'कभी-कभी', riskWeight: 1 },
          { id: 'frequent', en: 'Frequently throughout the day', hi: 'दिन में बार-बार', riskWeight: 2 },
          { id: 'constant', en: "Constant, can't stop", hi: 'लगातार, रुकती नहीं', riskWeight: 3 },
        ]
      }
    ]
  },
  
  breathing: {
    id: 'breathing',
    icon: '😮‍💨',
    title: { en: 'About your Breathing', hi: 'आपकी सांस के बारे में' },
    questions: [
      {
        id: 'breathing_when',
        question: { 
          en: 'When do you have difficulty breathing?', 
          hi: 'सांस लेने में कब तकलीफ होती है?' 
        },
        options: [
          { id: 'activity', en: 'Only during physical activity', hi: 'सिर्फ काम करते समय', riskWeight: 1 },
          { id: 'rest', en: 'Even while resting', hi: 'आराम करते समय भी', riskWeight: 3 },
          { id: 'lying', en: 'While lying down', hi: 'लेटने पर', riskWeight: 3 },
        ]
      },
      {
        id: 'breathing_speech',
        question: { 
          en: 'Can you speak a full sentence without stopping?', 
          hi: 'क्या आप बिना रुके पूरा वाक्य बोल सकते हैं?' 
        },
        options: [
          { id: 'normal', en: 'Yes, I can speak normally', hi: 'हाँ, सामान्य रूप से', riskWeight: 1 },
          { id: 'pause', en: 'I need to pause after a few words', hi: 'कुछ शब्दों के बाद रुकना पड़ता है', riskWeight: 3 },
          { id: 'barely', en: 'I can barely speak (URGENT)', hi: 'मुश्किल से बोल पाता हूं (तुरंत)', riskWeight: 5, urgent: true },
        ]
      }
    ]
  },
  
  stomach: {
    id: 'stomach',
    icon: '🤢',
    title: { en: 'About your Stomach Pain', hi: 'आपके पेट दर्द के बारे में' },
    questions: [
      {
        id: 'stomach_location',
        question: { 
          en: 'Where is the pain located?', 
          hi: 'दर्द कहाँ है?' 
        },
        options: [
          { id: 'upper', en: 'Upper stomach', hi: 'ऊपरी पेट', riskWeight: 1 },
          { id: 'lower', en: 'Lower stomach', hi: 'निचला पेट', riskWeight: 1 },
          { id: 'right', en: 'Right side (could be appendix)', hi: 'दाईं तरफ (अपेंडिक्स हो सकता है)', riskWeight: 3 },
          { id: 'all', en: 'All over', hi: 'पूरे पेट में', riskWeight: 2 },
        ]
      },
      {
        id: 'stomach_severity',
        question: { 
          en: 'How severe is the pain?', 
          hi: 'दर्द कितना तेज है?' 
        },
        options: [
          { id: 'mild', en: 'Mild - uncomfortable but bearable', hi: 'हल्का - सहनीय', riskWeight: 1 },
          { id: 'moderate', en: 'Moderate - hard to ignore', hi: 'मध्यम - नज़रअंदाज़ करना मुश्किल', riskWeight: 2 },
          { id: 'severe', en: 'Severe - very painful', hi: 'गंभीर - बहुत दर्द', riskWeight: 3 },
        ]
      }
    ]
  },
  
  vomiting: {
    id: 'vomiting',
    icon: '🤮',
    title: { en: 'About your Vomiting', hi: 'आपकी उल्टी के बारे में' },
    questions: [
      {
        id: 'vomiting_frequency',
        question: { 
          en: 'How many times have you vomited?', 
          hi: 'कितनी बार उल्टी हुई?' 
        },
        options: [
          { id: 'once', en: 'Once or twice', hi: 'एक-दो बार', riskWeight: 1 },
          { id: 'several', en: '3-5 times', hi: '3-5 बार', riskWeight: 2 },
          { id: 'many', en: 'More than 5 times', hi: '5 से ज्यादा बार', riskWeight: 3 },
        ]
      },
      {
        id: 'vomiting_content',
        question: { 
          en: 'What does the vomit contain?', 
          hi: 'उल्टी में क्या आता है?' 
        },
        options: [
          { id: 'food', en: 'Food/water', hi: 'खाना/पानी', riskWeight: 1 },
          { id: 'yellow', en: 'Yellow/green bile', hi: 'पीला/हरा पित्त', riskWeight: 2 },
          { id: 'blood', en: 'Blood (URGENT)', hi: 'खून (तुरंत)', riskWeight: 5, urgent: true },
        ]
      }
    ]
  },
  
  diarrhea: {
    id: 'diarrhea',
    icon: '🚽',
    title: { en: 'About your Diarrhea', hi: 'आपके दस्त के बारे में' },
    questions: [
      {
        id: 'diarrhea_frequency',
        question: { 
          en: 'How many times today?', 
          hi: 'आज कितनी बार?' 
        },
        options: [
          { id: 'few', en: '2-3 times', hi: '2-3 बार', riskWeight: 1 },
          { id: 'several', en: '4-6 times', hi: '4-6 बार', riskWeight: 2 },
          { id: 'many', en: 'More than 6 times', hi: '6 से ज्यादा बार', riskWeight: 3 },
        ]
      },
      {
        id: 'diarrhea_blood',
        question: { 
          en: 'Is there blood in the stool?', 
          hi: 'क्या मल में खून है?' 
        },
        options: [
          { id: 'no', en: 'No', hi: 'नहीं', riskWeight: 0 },
          { id: 'little', en: 'A little', hi: 'थोड़ा', riskWeight: 3 },
          { id: 'lot', en: 'Yes, significant amount', hi: 'हाँ, काफी', riskWeight: 5, urgent: true },
        ]
      }
    ]
  },
  
  headache: {
    id: 'headache',
    icon: '🤕',
    title: { en: 'About your Headache', hi: 'आपके सिरदर्द के बारे में' },
    questions: [
      {
        id: 'headache_severity',
        question: { 
          en: 'How severe is the headache?', 
          hi: 'सिरदर्द कितना तेज है?' 
        },
        options: [
          { id: 'mild', en: 'Mild', hi: 'हल्का', riskWeight: 1 },
          { id: 'moderate', en: 'Moderate', hi: 'मध्यम', riskWeight: 2 },
          { id: 'severe', en: 'Worst headache of my life', hi: 'जीवन का सबसे तेज सिरदर्द', riskWeight: 5, urgent: true },
        ]
      },
      {
        id: 'headache_sudden',
        question: { 
          en: 'Did it start suddenly?', 
          hi: 'क्या अचानक शुरू हुआ?' 
        },
        options: [
          { id: 'gradual', en: 'No, it built up gradually', hi: 'नहीं, धीरे-धीरे बढ़ा', riskWeight: 1 },
          { id: 'sudden', en: 'Yes, very suddenly (thunderclap)', hi: 'हाँ, बहुत अचानक', riskWeight: 4, urgent: true },
        ]
      }
    ]
  },

  chestTightness: {
    id: 'chestTightness',
    icon: '💔',
    title: { en: 'About your Chest Tightness', hi: 'आपके सीने में जकड़न के बारे में' },
    questions: [
      {
        id: 'chest_pain_type',
        question: { 
          en: 'What does it feel like?', 
          hi: 'यह कैसा महसूस होता है?' 
        },
        options: [
          { id: 'pressure', en: 'Pressure or squeezing', hi: 'दबाव या निचोड़ना', riskWeight: 3, urgent: true },
          { id: 'sharp', en: 'Sharp, stabbing pain', hi: 'तेज, चुभने वाला दर्द', riskWeight: 2 },
          { id: 'dull', en: 'Dull ache', hi: 'हल्का दर्द', riskWeight: 1 },
        ]
      },
      {
        id: 'chest_radiating',
        question: { 
          en: 'Does the pain spread to arm, jaw, or back?', 
          hi: 'क्या दर्द बांह, जबड़े या पीठ में फैलता है?' 
        },
        options: [
          { id: 'no', en: 'No, just in chest', hi: 'नहीं, सिर्फ सीने में', riskWeight: 1 },
          { id: 'yes', en: 'Yes, it spreads (URGENT)', hi: 'हाँ, फैलता है (तुरंत)', riskWeight: 5, urgent: true },
        ]
      }
    ]
  },
};

// ============================================================
// CONTENT TRANSLATIONS
// ============================================================
const content = {
  en: {
    title: 'Select Symptoms',
    subtitle: 'Tap all that apply',
    followUpTitle: 'Follow-up Questions',
    followUpSubtitle: 'Help us understand better',
    voice: 'Speak Your Symptoms',
    voiceHint: 'Tell us how you feel',
    instruction: 'Tap to select your symptoms:',
    selected: 'symptom(s) selected',
    continue: 'Continue',
    next: 'Next Question',
    previous: 'Previous',
    finish: 'Finish & Continue',
    skip: 'Skip Details',
    online: 'Online',
    offline: 'Offline',
    symptoms: 'symptoms',
    step: 'Step',
    of: 'of',
    progress: 'Progress',
    
    // Urgent Alert
    urgentTitle: '🚨 URGENT SYMPTOM DETECTED',
    urgentMessage: 'This needs immediate medical attention.',
    urgentAction: 'Please visit a hospital or call emergency services.',
    urgentEmergency: 'Emergency: 108',
    urgentContinue: 'Continue Assessment',
    urgentCall: 'Call Emergency',
    youReported: 'You reported:',
  },
  hi: {
    title: 'लक्षण चुनें',
    subtitle: 'जो लागू हो उन पर टैप करें',
    followUpTitle: 'फॉलो-अप प्रश्न',
    followUpSubtitle: 'हमें बेहतर समझने में मदद करें',
    voice: 'अपने लक्षण बोलें',
    voiceHint: 'बताएं आपको कैसा लग रहा है',
    instruction: 'अपने लक्षण चुनने के लिए टैप करें:',
    selected: 'लक्षण चुने गए',
    continue: 'आगे बढ़ें',
    next: 'अगला प्रश्न',
    previous: 'पिछला',
    finish: 'समाप्त करें और आगे बढ़ें',
    skip: 'विवरण छोड़ें',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    symptoms: 'लक्षण',
    step: 'चरण',
    of: 'में से',
    progress: 'प्रगति',
    
    // Urgent Alert
    urgentTitle: '🚨 तुरंत ध्यान दें',
    urgentMessage: 'इसे तुरंत चिकित्सा ध्यान की आवश्यकता है।',
    urgentAction: 'कृपया अस्पताल जाएं या आपातकालीन सेवाओं को कॉल करें।',
    urgentEmergency: 'इमरजेंसी: 108',
    urgentContinue: 'जांच जारी रखें',
    urgentCall: 'इमरजेंसी कॉल करें',
    youReported: 'आपने बताया:',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Symptoms() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Step management: 'symptoms' | 'followup'
  const [step, setStep] = useState('symptoms');
  
  // Symptom selection
  const [selected, setSelected] = useState([]);
  const [openGroups, setOpenGroups] = useState(['general']);
  
  // Follow-up state
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Urgent alert
  const [showUrgentAlert, setShowUrgentAlert] = useState(false);
  const [urgentSymptom, setUrgentSymptom] = useState(null);

  const t = content[language];

  // Get symptoms that have follow-up questions
  const symptomsWithFollowUp = selected.filter(s => followUpQuestions[s]);
  
  // Current follow-up data
  const currentFollowUp = symptomsWithFollowUp[currentSymptomIndex] 
    ? followUpQuestions[symptomsWithFollowUp[currentSymptomIndex]] 
    : null;
  const currentQuestion = currentFollowUp?.questions[currentQuestionIndex];
  
  // Calculate total questions and progress
  const totalQuestions = symptomsWithFollowUp.reduce((sum, s) => 
    sum + (followUpQuestions[s]?.questions.length || 0), 0
  );
  const answeredQuestions = Object.values(followUpAnswers).reduce((sum, answers) => 
    sum + Object.keys(answers).length, 0
  );
  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('swasth-language');
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Load saved symptoms
  useEffect(() => {
    try {
      const saved = localStorage.getItem('swasth-symptoms');
      if (saved) setSelected(JSON.parse(saved));
      const savedFollowUp = localStorage.getItem('swasth-followup');
      if (savedFollowUp) setFollowUpAnswers(JSON.parse(savedFollowUp));
    } catch (e) {
      console.warn('Could not load symptoms');
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

  // Toggle language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('swasth-language', lang);
  };

  // Toggle group - accordion style
  const toggleGroup = (groupId) => {
    setOpenGroups((prev) =>
      prev.includes(groupId) ? [] : [groupId]
    );
  };

  // Toggle symptom selection
  const toggleSymptom = (symptomId) => {
    setSelected((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Save symptoms on change
  useEffect(() => {
    localStorage.setItem('swasth-symptoms', JSON.stringify(selected));
  }, [selected]);

  // Handle voice input (demo)
  const handleVoice = () => {
    const msg = language === 'en'
      ? '🎤 Voice Input Demo\n\nThis feature would listen to you describe symptoms in Hindi or English.\n\n(Prototype - not functional)'
      : '🎤 वॉइस इनपुट डेमो\n\nयह सुविधा आपके लक्षण सुनेगी।\n\n(प्रोटोटाइप - काम नहीं करता)';
    alert(msg);
  };

  // Handle continue from symptoms to follow-up
  const handleContinueToFollowUp = () => {
    if (selected.length === 0) return;
    
    // If there are symptoms with follow-up questions, go to follow-up step
    if (symptomsWithFollowUp.length > 0) {
      setStep('followup');
      setCurrentSymptomIndex(0);
      setCurrentQuestionIndex(0);
    } else {
      // No follow-up needed, go directly to questions page
      finishAndNavigate();
    }
  };

  // Handle selecting a follow-up answer
  const handleSelectAnswer = (option) => {
    const symptomId = symptomsWithFollowUp[currentSymptomIndex];
    const questionId = currentQuestion.id;
    
    setFollowUpAnswers(prev => ({
      ...prev,
      [symptomId]: {
        ...(prev[symptomId] || {}),
        [questionId]: {
          id: option.id,
          riskWeight: option.riskWeight,
          urgent: option.urgent || false,
        }
      }
    }));
    
    // Check for urgent symptom
    if (option.urgent) {
      setUrgentSymptom({ symptom: symptomId, option });
      setShowUrgentAlert(true);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    // Check if current question is answered
    const symptomId = symptomsWithFollowUp[currentSymptomIndex];
    const currentAnswer = followUpAnswers[symptomId]?.[currentQuestion?.id];
    
    if (!currentAnswer) return; // Must answer current question
    
    // Move to next question or next symptom
    if (currentQuestionIndex < currentFollowUp.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSymptomIndex < symptomsWithFollowUp.length - 1) {
      setCurrentSymptomIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All done
      finishAndNavigate();
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSymptomIndex > 0) {
      setCurrentSymptomIndex(prev => prev - 1);
      const prevSymptom = followUpQuestions[symptomsWithFollowUp[currentSymptomIndex - 1]];
      setCurrentQuestionIndex(prevSymptom.questions.length - 1);
    } else {
      // Go back to symptom selection
      setStep('symptoms');
    }
  };

  // Skip follow-up and go to questions
  const handleSkip = () => {
    finishAndNavigate();
  };

  // Save and navigate to questions page
  const finishAndNavigate = () => {
    localStorage.setItem('swasth-symptoms', JSON.stringify(selected));
    localStorage.setItem('swasth-followup', JSON.stringify(followUpAnswers));
    router.push('/questions');
  };

  // Close urgent alert and continue
  const handleContinueFromUrgent = () => {
    setShowUrgentAlert(false);
    handleNextQuestion();
  };

  // Call emergency
  const handleCallEmergency = () => {
    window.location.href = 'tel:108';
  };

  // Check if current question is answered
  const isCurrentAnswered = () => {
    if (!currentFollowUp || !currentQuestion) return false;
    const symptomId = symptomsWithFollowUp[currentSymptomIndex];
    return !!followUpAnswers[symptomId]?.[currentQuestion.id];
  };

  // Get current answer
  const getCurrentAnswer = () => {
    if (!currentFollowUp || !currentQuestion) return null;
    const symptomId = symptomsWithFollowUp[currentSymptomIndex];
    return followUpAnswers[symptomId]?.[currentQuestion.id]?.id;
  };

  return (
    <>
      <Head>
        <title>{step === 'symptoms' ? t.title : t.followUpTitle} - Swasth Saathi</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => step === 'followup' ? handlePreviousQuestion() : router.push('/')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 transition-all text-sm font-medium"
              >
                ←
              </button>
              <div className="leading-tight">
                <h1 className="text-sm font-bold text-slate-900">
                  {step === 'symptoms' ? t.title : t.followUpTitle}
                </h1>
                <p className="text-xs text-slate-500">
                  {step === 'symptoms' ? t.subtitle : t.followUpSubtitle}
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
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {isOnline ? t.online : t.offline}
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* STEP 1: SYMPTOM SELECTION */}
        {/* ============================================================ */}
        {step === 'symptoms' && (
          <main className={`flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-32 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Voice Button - Only when online */}
            {isOnline && (
              <button
                onClick={handleVoice}
                className="w-full mb-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl">🎤</span>
                  <div className="text-left">
                    <div className="text-sm font-bold leading-tight">{t.voice}</div>
                    <div className="text-xs opacity-90">{t.voiceHint}</div>
                  </div>
                </div>
              </button>
            )}

            {/* Instruction */}
            <p className="text-xs text-slate-500 font-medium mb-3">{t.instruction}</p>

            {/* Symptom Groups */}
            <div className="space-y-3">
              {symptomGroups.map((group) => {
                const isOpen = openGroups.includes(group.id);
                const selectedInGroup = group.symptoms.filter((s) =>
                  selected.includes(s.id)
                ).length;

                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                  >
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-800">{group[language]}</div>
                        <div className="text-xs text-slate-500">
                          {group.symptoms.length} {t.symptoms}
                          {selectedInGroup > 0 && (
                            <span className="ml-2 text-emerald-600 font-semibold">• {selectedInGroup} ✓</span>
                          )}
                        </div>
                      </div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                        isOpen ? 'bg-emerald-100 text-emerald-600 rotate-180' : 'bg-slate-100 text-slate-400'
                      }`}>
                        ▼
                      </div>
                    </button>

                    {/* Symptoms Grid */}
                    {isOpen && (
                      <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2">
                          {group.symptoms.map((symptom) => {
                            const isSelected = selected.includes(symptom.id);
                            const hasFollowUp = !!followUpQuestions[symptom.id];
                            return (
                              <button
                                key={symptom.id}
                                onClick={() => toggleSymptom(symptom.id)}
                                className={`p-3 rounded-lg border-2 text-center transition-all relative ${
                                  isSelected
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                                }`}
                              >
                                <span className="text-xs font-medium">{symptom[language]}</span>
                                {hasFollowUp && isSelected && (
                                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" title="Has follow-up questions" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* ============================================================ */}
        {/* STEP 2: FOLLOW-UP QUESTIONS */}
        {/* ============================================================ */}
        {step === 'followup' && currentFollowUp && currentQuestion && (
          <main className={`flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-36 transition-all duration-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">
                  {t.step} {currentSymptomIndex + 1} {t.of} {symptomsWithFollowUp.length}
                </span>
                <span className="text-sm text-emerald-600 font-bold">
                  {progressPercent}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Symptom Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm">
              {/* Symptom Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                  {currentFollowUp.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">
                    {currentFollowUp.title[language]}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Question {currentQuestionIndex + 1} of {currentFollowUp.questions.length}
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  {currentQuestion.question.en}
                </h3>
                {language === 'hi' && (
                  <p className="text-sm text-slate-500">
                    {currentQuestion.question.hi}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = getCurrentAnswer() === option.id;
                  const isUrgent = option.urgent;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? isUrgent
                            ? 'bg-red-50 border-red-400 text-red-800'
                            : 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : isUrgent
                            ? 'bg-white border-red-200 text-red-700 hover:border-red-300'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? isUrgent ? 'border-red-500 bg-red-500' : 'border-emerald-500 bg-emerald-500'
                            : isUrgent ? 'border-red-300' : 'border-slate-300'
                        }`}>
                          {isSelected && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{option.en}</div>
                          {language === 'hi' && (
                            <div className="text-xs opacity-75 mt-0.5">{option.hi}</div>
                          )}
                        </div>
                        {isUrgent && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                            ⚠️
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* ============================================================ */}
        {/* BOTTOM BAR */}
        {/* ============================================================ */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {step === 'symptoms' ? (
              <>
                {/* Selected Count */}
                {selected.length > 0 && (
                  <div className="mb-3 py-2 bg-emerald-100 text-emerald-700 text-center text-sm font-medium rounded-lg">
                    ✓ {selected.length} {t.selected}
                    {symptomsWithFollowUp.length > 0 && (
                      <span className="ml-2 text-emerald-600">
                        ({symptomsWithFollowUp.length} with details)
                      </span>
                    )}
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleContinueToFollowUp}
                  disabled={selected.length === 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                    selected.length === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-[0.98]'
                  }`}
                >
                  {t.continue} →
                </button>
              </>
            ) : (
              <div className="space-y-2">
                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousQuestion}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    ← {t.previous}
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!isCurrentAnswered()}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      isCurrentAnswered()
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {currentSymptomIndex === symptomsWithFollowUp.length - 1 && 
                     currentQuestionIndex === currentFollowUp?.questions.length - 1
                      ? t.finish
                      : t.next
                    } →
                  </button>
                </div>
                
                {/* Skip Button */}
                <button
                  onClick={handleSkip}
                  className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  {t.skip}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* URGENT ALERT MODAL */}
        {/* ============================================================ */}
        {showUrgentAlert && urgentSymptom && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-bounce-once">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-4xl animate-pulse">
                  🚨
                </div>
                <h2 className="text-xl font-black text-red-700">
                  {t.urgentTitle}
                </h2>
              </div>

              {/* Content */}
              <div className="bg-red-50 rounded-xl p-4 mb-5 border border-red-200">
                <p className="text-sm text-red-700 font-medium mb-2">
                  {t.youReported}
                </p>
                <p className="text-lg font-bold text-red-800">
                  "{urgentSymptom.option[language]}"
                </p>
              </div>

              <p className="text-slate-700 font-medium text-center mb-2">
                {t.urgentMessage}
              </p>
              <p className="text-slate-500 text-sm text-center mb-5">
                {t.urgentAction}
              </p>

              {/* Emergency Number */}
              <div className="bg-red-600 text-white rounded-xl p-4 text-center mb-5">
                <p className="text-sm opacity-90 mb-1">📞 {t.urgentEmergency}</p>
                <p className="text-3xl font-black">108</p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCallEmergency}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg transition-all"
                >
                  📞 {t.urgentCall}
                </button>
                <button
                  onClick={handleContinueFromUrgent}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-all"
                >
                  {t.urgentContinue} →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.5s ease-out;
        }
      `}</style>
    </>
  );
}

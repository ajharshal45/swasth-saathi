import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced'

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem("swasth-language");
    if (saved) setLang(saved);
  }, []);

  // Check for unsynced data
  useEffect(() => {
    const hasData = localStorage.getItem('swasth-result');
    const wasSynced = localStorage.getItem('swasth-synced');
    setPendingSync(hasData && !wasSynced);
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingSync && syncStatus === 'idle') {
      // Start sync animation
      setSyncStatus('syncing');
      
      // Simulate sync after 2 seconds
      const timer = setTimeout(() => {
        localStorage.setItem('swasth-synced', 'true');
        setSyncStatus('synced');
        setPendingSync(false);
        
        // Hide synced message after 3 seconds
        setTimeout(() => setSyncStatus('idle'), 3000);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingSync, syncStatus]);

  // Network status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("swasth-language", newLang);
  };

  const content = {
    en: {
      heroTitle1: "Healthcare guidance that works",
      heroTitle2: "even without internet",
      heroDesc: "Simple, fast, and reliable health triage for rural communities. Get professional care pathways anytime, anywhere.",
      startBtn: "Start Health Check →",
      features: ["Offline-first", "Doctor-assisted", "Safe triage"],
      servicesTitle: "Health Services",
      servicesDesc: "Select an option below to begin your healthcare journey",
      checkSymptoms: "Check Symptoms",
      checkSymptomsDesc: "Describe how you feel to get immediate guidance.",
      openService: "Open Service →",
      healthTrends: "Health Trends",
      healthTrendsDesc: "See community health alerts and local disease trends.",
      comingSoon: "Coming Soon",
      howItWorks: "How It Works",
      howItWorksDesc: "Simple steps to get the right care, even without internet",
      step1Title: "Select symptoms",
      step1Desc: "Identify your symptoms using our visual, local-language interface.",
      step2Title: "Get guidance",
      step2Desc: "Receive immediate risk-based instructions stored locally on your device.",
      step3Title: "Follow pathway",
      step3Desc: "Complete the care path or await verified doctor review when online.",
      whoHelps: "Who This Helps",
      whoHelpsDesc: "Swasth Saathi is designed for the entire rural healthcare ecosystem.",
      patients: "Patients",
      patientsDesc: "Timely guidance anywhere",
      asha: "ASHA Workers",
      ashaDesc: "Assisted triage support",
      doctors: "Doctors",
      doctorsDesc: "Reduced clinic overload",
      healthSystem: "Health System",
      healthSystemDesc: "Early trend visibility",
      footerPrivacy: "Your health data is stored locally on this device.",
      online: "Online",
      offline: "Offline",
      dataSavedLocally: "Data saved locally",
      syncing: "Syncing...",
      synced: "Synced",
      // ABDM Section
      abdmTitle: "India Stack Ready",
      abdmSubtitle: "Built for Ayushman Bharat Digital Mission",
      abdmFeatures: [
        { icon: "🆔", title: "ABDM Ready", desc: "Designed for national health infrastructure" },
        { icon: "💳", title: "Health ID", desc: "Support for ABHA (Health ID) creation" },
        { icon: "📁", title: "DigiLocker", desc: "Medical records integration" },
      ],
      abdmPoints: [
        "Health ID creation support (coming soon)",
        "DigiLocker integration for medical records",
        "Consent-based health data sharing",
        "Works with existing PHC infrastructure",
      ],
    },
    hi: {
      heroTitle1: "स्वास्थ्य मार्गदर्शन जो काम करता है",
      heroTitle2: "बिना इंटरनेट के भी",
      heroDesc: "ग्रामीण समुदायों के लिए सरल, तेज और विश्वसनीय स्वास्थ्य मार्गदर्शन। कभी भी, कहीं भी देखभाल मार्ग प्राप्त करें।",
      startBtn: "स्वास्थ्य जांच शुरू करें →",
      features: ["ऑफ़लाइन-फर्स्ट", "डॉक्टर-सहायता", "सुरक्षित ट्राइएज"],
      servicesTitle: "स्वास्थ्य सेवाएं",
      servicesDesc: "अपनी स्वास्थ्य यात्रा शुरू करने के लिए नीचे विकल्प चुनें",
      checkSymptoms: "लक्षण जांचें",
      checkSymptomsDesc: "तुरंत मार्गदर्शन पाने के लिए बताएं कि आप कैसा महसूस कर रहे हैं।",
      openService: "सेवा खोलें →",
      healthTrends: "स्वास्थ्य रुझान",
      healthTrendsDesc: "सामुदायिक स्वास्थ्य अलर्ट और स्थानीय रोग रुझान देखें।",
      comingSoon: "जल्द आ रहा है",
      howItWorks: "यह कैसे काम करता है",
      howItWorksDesc: "सही देखभाल पाने के सरल कदम, बिना इंटरनेट के भी",
      step1Title: "लक्षण चुनें",
      step1Desc: "हमारे विज़ुअल, स्थानीय-भाषा इंटरफेस का उपयोग करके अपने लक्षणों की पहचान करें।",
      step2Title: "मार्गदर्शन प्राप्त करें",
      step2Desc: "अपने डिवाइस पर स्थानीय रूप से संग्रहीत तत्काल जोखिम-आधारित निर्देश प्राप्त करें।",
      step3Title: "मार्ग का पालन करें",
      step3Desc: "देखभाल पथ पूरा करें या ऑनलाइन होने पर डॉक्टर की सत्यापित समीक्षा की प्रतीक्षा करें।",
      whoHelps: "यह किसकी मदद करता है",
      whoHelpsDesc: "स्वास्थ्य साथी पूरे ग्रामीण स्वास्थ्य सेवा पारिस्थितिकी तंत्र के लिए डिज़ाइन किया गया है।",
      patients: "मरीज़",
      patientsDesc: "कहीं भी समय पर मार्गदर्शन",
      asha: "आशा कार्यकर्ता",
      ashaDesc: "सहायक ट्राइएज समर्थन",
      doctors: "डॉक्टर",
      doctorsDesc: "क्लिनिक का बोझ कम",
      healthSystem: "स्वास्थ्य प्रणाली",
      healthSystemDesc: "प्रारंभिक रुझान दृश्यता",
      footerPrivacy: "आपका स्वास्थ्य डेटा इस डिवाइस पर स्थानीय रूप से संग्रहीत है।",
      online: "ऑनलाइन",
      offline: "ऑफ़लाइन",
      dataSavedLocally: "डेटा स्थानीय रूप से सहेजा गया",
      syncing: "सिंक हो रहा है...",
      synced: "सिंक हो गया",
      // ABDM Section
      abdmTitle: "इंडिया स्टैक रेडी",
      abdmSubtitle: "आयुष्मान भारत डिजिटल मिशन के लिए बनाया गया",
      abdmFeatures: [
        { icon: "🆔", title: "ABDM रेडी", desc: "राष्ट्रीय स्वास्थ्य इंफ्रास्ट्रक्चर के लिए डिज़ाइन" },
        { icon: "💳", title: "हेल्थ ID", desc: "ABHA (हेल्थ ID) निर्माण का समर्थन" },
        { icon: "📁", title: "डिजीलॉकर", desc: "मेडिकल रिकॉर्ड इंटीग्रेशन" },
      ],
      abdmPoints: [
        "हेल्थ ID निर्माण समर्थन (जल्द आ रहा है)",
        "मेडिकल रिकॉर्ड के लिए डिजीलॉकर इंटीग्रेशन",
        "सहमति-आधारित स्वास्थ्य डेटा साझाकरण",
        "मौजूदा PHC इंफ्रास्ट्रक्चर के साथ काम करता है",
      ],
    },
  };

  const t = content[lang];

  return (
    <>
      <Head>
        <title>Swasth Saathi - स्वास्थ्य साथी</title>
        <meta name="description" content="Healthcare guidance that works even without internet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-800">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-black text-lg md:text-xl text-emerald-600 hover:text-emerald-700 transition-colors">
              <span className="text-2xl">❤️</span>
              <span>Swasth Saathi</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* LANGUAGE SWITCH */}
              <div className="flex rounded-full overflow-hidden border border-slate-200 text-xs font-bold shadow-sm">
                <button
                  onClick={() => toggleLang("en")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 ${
                    lang === "en"
                      ? "bg-emerald-600 text-white shadow-inner"
                      : "bg-white text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => toggleLang("hi")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 ${
                    lang === "hi"
                      ? "bg-emerald-600 text-white shadow-inner"
                      : "bg-white text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  हिंदी
                </button>
              </div>

              {/* ONLINE STATUS */}
              <span
                className={`hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 transition-all ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                {isOnline ? t.online : t.offline}
              </span>

              {/* SYNC STATUS INDICATOR */}
              {pendingSync && !isOnline && (
                <span className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200">
                  📤 {t.dataSavedLocally}
                </span>
              )}
              {syncStatus === 'syncing' && (
                <span className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse">
                  🔄 {t.syncing}
                </span>
              )}
              {syncStatus === 'synced' && (
                <span className="hidden sm:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200">
                  ✓ {t.synced}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 tracking-tight">
              {t.heroTitle1}{" "}
              <span className="text-emerald-600">{t.heroTitle2}</span>
            </h1>

            <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
              {t.heroDesc}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/symptoms"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-600 text-white font-bold text-lg shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all duration-300"
              >
                {t.startBtn}
              </Link>

              <div className="flex flex-wrap justify-center gap-3">
                {t.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200">
                    <span className="text-emerald-500">✓</span> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HEALTH SERVICES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t.servicesTitle}</h2>
            <p className="text-slate-500 font-medium mt-3 text-base md:text-lg">{t.servicesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Link href="/symptoms" className="group block">
              <div className="h-full border-2 border-slate-100 rounded-3xl p-6 md:p-8 bg-white shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  🩺
                </div>
                <h3 className="font-black text-xl text-slate-900">{t.checkSymptoms}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{t.checkSymptomsDesc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-3 transition-all">
                  {t.openService}
                </span>
              </div>
            </Link>

            <div className="h-full border-2 border-slate-100 rounded-3xl p-6 md:p-8 bg-slate-50/50 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-5">
                📊
              </div>
              <h3 className="font-black text-xl text-slate-900">{t.healthTrends}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{t.healthTrendsDesc}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full text-sm">
                🚧 {t.comingSoon}
              </span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t.howItWorks}</h2>
              <p className="mt-3 text-slate-600 font-medium text-base md:text-lg">{t.howItWorksDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200"></div>
              
              <div className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-200 z-10">
                  💓
                </div>
                <span className="absolute -top-2 -right-2 md:top-0 md:-right-1 w-8 h-8 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center text-sm font-black text-emerald-600 shadow-sm">1</span>
                <h4 className="mt-6 font-black text-lg text-slate-900">{t.step1Title}</h4>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs">{t.step1Desc}</p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-200 z-10">
                  ⏱️
                </div>
                <span className="absolute -top-2 -right-2 md:top-0 md:-right-1 w-8 h-8 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center text-sm font-black text-emerald-600 shadow-sm">2</span>
                <h4 className="mt-6 font-black text-lg text-slate-900">{t.step2Title}</h4>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs">{t.step2Desc}</p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-200 z-10">
                  👤
                </div>
                <span className="absolute -top-2 -right-2 md:top-0 md:-right-1 w-8 h-8 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center text-sm font-black text-emerald-600 shadow-sm">3</span>
                <h4 className="mt-6 font-black text-lg text-slate-900">{t.step3Title}</h4>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs">{t.step3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO THIS HELPS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t.whoHelps}</h2>
            <p className="mt-3 text-slate-600 text-base md:text-lg">{t.whoHelpsDesc}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "💚", title: t.patients, desc: t.patientsDesc, color: "from-emerald-100 to-green-50" },
              { icon: "👥", title: t.asha, desc: t.ashaDesc, color: "from-blue-100 to-cyan-50" },
              { icon: "🩺", title: t.doctors, desc: t.doctorsDesc, color: "from-purple-100 to-violet-50" },
              { icon: "📈", title: t.healthSystem, desc: t.healthSystemDesc, color: "from-amber-100 to-yellow-50" },
            ].map((item, i) => (
              <div key={i} className="group bg-white border border-slate-100 rounded-3xl p-5 md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="mt-5 font-black text-slate-900 text-base md:text-lg">{item.title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABDM / INDIA STACK SECTION */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-4">
                <span className="text-xl">🇮🇳</span>
                <span className="font-bold text-slate-700">Ayushman Bharat</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t.abdmTitle}</h2>
              <p className="mt-3 text-slate-600 text-base md:text-lg">{t.abdmSubtitle}</p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              {t.abdmFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center text-3xl mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="font-black text-lg text-slate-900">{feature.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Feature Points */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.abdmPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
              
              {/* ABDM Logo placeholder */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
                <span className="text-xs text-slate-400 font-medium">Aligned with:</span>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-slate-50 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                    🏛️ NHA
                  </span>
                  <span className="px-3 py-1.5 bg-slate-50 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                    🆔 ABDM
                  </span>
                  <span className="px-3 py-1.5 bg-slate-50 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                    📁 DigiLocker
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-10 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5 text-white font-black text-lg">
                <span className="text-2xl">❤️</span>
                <span>Swasth Saathi</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm bg-slate-800 px-4 py-2 rounded-full">
                <span className="text-lg">🛡️</span>
                <span>{t.footerPrivacy}</span>
              </div>
              
              <div className="text-xs text-slate-500">© 2025 Swasth Saathi. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
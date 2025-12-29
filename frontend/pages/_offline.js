import Link from 'next/link';

export default function Offline() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="text-7xl mb-6">📴</div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        You are offline
      </h1>
      
      <p className="text-xl text-gray-600 mb-4">
        आप ऑफ़लाइन हैं
      </p>
      
      <p className="text-gray-600 mb-2">
        Don't worry! Basic health guidance is still available.
      </p>
      
      <p className="text-gray-500 text-sm mb-6">
        पूर्ण सुविधाओं के लिए इंटरनेट से कनेक्ट करें
      </p>

      {/* Quick links to cached pages */}
      <div className="flex flex-col gap-3 mb-8">
        <Link 
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md"
        >
          🏠 Go to Home
        </Link>
        <Link 
          href="/symptoms"
          className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-8 py-3 rounded-xl shadow-md"
        >
          🩺 Check Symptoms
        </Link>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="text-green-600 hover:text-green-700 font-medium underline"
      >
        🔄 Try Again
      </button>

      <p className="text-gray-400 text-xs mt-8">
        Swasth Saathi - Healthcare guidance, even without internet
      </p>
    </div>
  );
}

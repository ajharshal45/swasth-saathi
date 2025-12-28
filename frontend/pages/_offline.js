export default function Offline() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
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
      
      <p className="text-gray-500 text-sm mb-2">
        Connect to internet for full features.
      </p>
      
      <p className="text-gray-500 text-sm">
        पूर्ण सुविधाओं के लिए इंटरनेट से कनेक्ट करें
      </p>
      
      <button
        onClick={() => window.location.reload()}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md mt-8"
      >
        🔄 Try Again
      </button>
    </div>
  );
}

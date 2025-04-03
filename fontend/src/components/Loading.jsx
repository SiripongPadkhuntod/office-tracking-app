import { Loader } from 'lucide-react';

function Loading({ small = false }) {
  if (small) {
    return (
      <div className="flex justify-center items-center">
        <Loader size={20} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <div className="relative">
        {/* วงกลมหมุน */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-600"></div>
        {/* จุดตรงกลางเพื่อให้ดูสมจริงขึ้น */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600">กำลังโหลด...</p>
    </div>
  );
}

export default Loading;
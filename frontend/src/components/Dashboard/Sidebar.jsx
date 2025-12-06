import { Search, X } from 'lucide-react'
import CalendarWidget from './CalendarWidget'

const Sidebar = ({ 
  notes, 
  onSearch, 
  selectedDate, 
  onDateSelect,
  isOpen,        // Props baru untuk status buka/tutup
  onClose        // Props baru untuk fungsi tutup
}) => {
  return (
    <>
      {/* Overlay Gelap (klik untuk tutup) */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
          <h2 className="font-bold text-gray-700 text-lg">Menu & Filter</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* 1. Fitur Search (Sesuai request: ada di dalam menu) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Pencarian</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari judul atau isi..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl 
                         focus:border-blue-400 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
            
          {/* 2. Widget Kalender */}
          <div className="mb-2">
             <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600 text-sm">Filter Tanggal</span>
                {selectedDate && (
                  <button 
                    onClick={() => onDateSelect(null)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Reset
                  </button>
                )}
             </div>
             
             <CalendarWidget 
                notes={notes} 
                onDateSelect={(date) => {
                  onDateSelect(date);
                  // Opsional: onClose(); // Uncomment jika ingin menu menutup otomatis setelah pilih tanggal
                }} 
             />
             
             {selectedDate && (
               <div className="mt-3 text-center p-3 bg-blue-50 rounded-xl text-blue-600 text-sm border border-blue-100">
                 Menampilkan: <strong>{selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
               </div>
             )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Memoria App v1.0
        </div>
      </div>
    </>
  )
}

export default Sidebar
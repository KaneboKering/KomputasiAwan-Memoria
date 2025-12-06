import { Plus, Search } from 'lucide-react'
import { formatShortDate, getMoodEmoji } from '../../utils/helpers'
import Button from '../Shared/Button'
import NotesList from './NotesList'

const Sidebar = ({ notes, currentNote, onCreateNew, onSelectNote, onSearch, loading }) => {
  return (
    <div className="w-80 bg-white/90 backdrop-blur-md border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Button
          variant="primary"
          className="w-full mb-4"
          onClick={onCreateNew}
          icon={<Plus className="w-5 h-5" />}
        >
          Catatan Baru
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari catatan..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-2 border-transparent rounded-xl 
                     focus:border-blue-400 focus:bg-white transition-all duration-300 outline-none"
          />
        </div>
      </div>
      
      <NotesList 
        notes={notes} 
        currentNote={currentNote} 
        onSelectNote={onSelectNote}
        loading={loading}
      />
    </div>
  )
}

export default Sidebar
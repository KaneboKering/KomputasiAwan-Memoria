import { Calendar } from 'lucide-react'
import { formatShortDate, getMoodEmoji, truncateText } from '../../utils/helpers'

const NotesList = ({ notes, currentNote, onSelectNote, loading }) => {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Memuat catatan...</p>
        </div>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg">Belum ada catatan</p>
          <p className="text-sm">Mulai menulis cerita Anda!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-hover ${
            currentNote?.id === note.id
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md'
              : 'bg-white hover:bg-blue-50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">
              {note.title || 'Tanpa Judul'}
            </h3>
            <span className="text-2xl">{getMoodEmoji(note.mood)}</span>
          </div>
          
          <p className={`text-sm line-clamp-2 mb-2 ${
            currentNote?.id === note.id ? 'text-white/90' : 'text-gray-600'
          }`}>
            {truncateText(note.content, 80)}
          </p>
          
          <div className={`flex items-center gap-2 text-xs ${
            currentNote?.id === note.id ? 'text-white/80' : 'text-gray-500'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{formatShortDate(note.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotesList
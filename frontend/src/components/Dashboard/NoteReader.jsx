import { Edit, Trash2, Calendar, X } from 'lucide-react'
import { formatDate, getMoodEmoji } from '../../utils/helpers'
import Button from '../Shared/Button'

const NoteReader = ({ note, onEdit, onDelete, onClose }) => {
  if (!note) return null;

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm animate-slide-in">
      {/* Header Read Mode */}
      <div className="p-6 border-b border-gray-200 bg-white/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(note.created_at)}</span>
          </div>
          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100">
            {getMoodEmoji(note.mood)} {note.mood}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => onEdit(note)} icon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(note)} className="!p-2">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Read Mode */}
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
          {note.title}
        </h1>

        {note.imageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img 
              src={note.imageUrl} 
              alt={note.title} 
              className="w-full max-h-[400px] object-contain bg-gray-50"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
          {note.content}
        </div>
      </div>
    </div>
  )
}

export default NoteReader
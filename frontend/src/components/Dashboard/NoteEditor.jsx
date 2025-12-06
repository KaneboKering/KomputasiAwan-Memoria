import { useState, useEffect } from 'react'
import { Save, Trash2, Calendar, Image as ImageIcon, X } from 'lucide-react'
import { journalService } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import Button from '../Shared/Button'

const NoteEditor = ({ note, onSave, onDelete, showNotification, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'Netral'
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        mood: note.mood || 'Netral'
      })
      setImagePreview(note.imageUrl || null)
      setImageFile(null)
    } else {
      setFormData({ title: '', content: '', mood: 'Netral' })
      setImagePreview(null)
      setImageFile(null)
    }
  }, [note])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showNotification('Judul dan isi tidak boleh kosong!', 'error')
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('mood', formData.mood)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (note?.id) {
        await journalService.update(note.id, formDataToSend)
      } else {
        await journalService.create(formDataToSend)
      }

      onSave()
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Gagal menyimpan catatan',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!note?.id) return
    
    if (!window.confirm('Yakin ingin menghapus catatan ini?')) return

    setLoading(true)

    try {
      await journalService.delete(note.id)
      onDelete()
    } catch (error) {
      showNotification('Gagal menghapus catatan', 'error')
    } finally {
      setLoading(false)
    }
  }

  const moods = [
    { value: 'Netral', label: '😐 Netral' },
    { value: 'Senang', label: '😊 Senang' },
    { value: 'Sedih', label: '😢 Sedih' },
    { value: 'Marah', label: '😠 Marah' },
    { value: 'Semangat', label: '🔥 Semangat' },
    { value: 'Sakit', label: '🤒 Sakit' },
    { value: 'Bingung', label: '😕 Bingung' }
  ]

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm animate-slide-in">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {note ? formatDate(note.created_at) : formatDate(new Date())}
            </span>
          </div>
          
          <div className="flex gap-2">
            {/* Tombol Batal Baru */}
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>

            <Button
              variant="success"
              onClick={handleSave}
              disabled={loading}
              icon={<Save className="w-5 h-5" />}
            >
              Simpan
            </Button>
            
            {note?.id && (
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
                icon={<Trash2 className="w-5 h-5" />}
              >
                Hapus
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Judul catatan..."
          className="w-full text-3xl font-bold border-0 border-b-2 border-gray-200 
                   focus:border-blue-400 outline-none bg-transparent pb-2"
        />

        {/* Mood and Image Upload */}
        <div className="flex flex-wrap gap-4">
          <select
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl 
                     focus:border-blue-400 outline-none cursor-pointer"
          >
            {moods.map((mood) => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>

          <label className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl cursor-pointer 
                          hover:bg-blue-200 transition-colors flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            <span>Upload Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-80 object-contain bg-gray-50"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full 
                       hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Tulis cerita Anda di sini..."
          className="w-full min-h-[400px] p-4 bg-white border-2 border-gray-200 rounded-xl 
                   focus:border-blue-400 outline-none resize-none"
        />
      </div>
    </div>
  )
}

export default NoteEditor
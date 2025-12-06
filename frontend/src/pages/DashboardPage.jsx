import { useState, useEffect } from 'react'
import { journalService } from '../services/api'
import Header from '../components/Dashboard/Header'
import Sidebar from '../components/Dashboard/Sidebar'
import NoteEditor from '../components/Dashboard/NoteEditor'
import EmptyState from '../components/Dashboard/EmptyState'

const DashboardPage = ({ setIsAuthenticated, showNotification }) => {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async (query = '') => {
    try {
      const response = await journalService.getAll(query)

      // Sort notes terbaru di atas
      const sortedNotes = (response.data || []).sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      )

      setNotes(sortedNotes)
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout()
      } else {
        showNotification('Gagal memuat catatan', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadNotes(query)
  }

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    showNotification('Logout berhasil!', 'success')
  }

  const handleCreateNew = () => {
    setCurrentNote(null)
    setShowEditor(true)
  }

  const handleSelectNote = (note) => {
    setCurrentNote(note)
    setShowEditor(true)
  }

  const handleSaveNote = async () => {
    await loadNotes(searchQuery)
    setShowEditor(false)
    setCurrentNote(null)
    showNotification('Catatan berhasil disimpan!', 'success')
  }

  const handleDeleteNote = async () => {
    setCurrentNote(null)
    setShowEditor(false)
    await loadNotes(searchQuery)
    showNotification('Catatan berhasil dihapus!', 'success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-beige-100 to-blue-300">
      <Header onLogout={handleLogout} />
      
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar
          notes={notes}
          currentNote={currentNote}
          onCreateNew={handleCreateNew}
          onSelectNote={handleSelectNote}
          onSearch={handleSearch}
          loading={loading}
        />
        
        <div className="flex-1 overflow-auto">
          {showEditor ? (
            <NoteEditor
              note={currentNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              showNotification={showNotification}
            />
          ) : (
            <EmptyState onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

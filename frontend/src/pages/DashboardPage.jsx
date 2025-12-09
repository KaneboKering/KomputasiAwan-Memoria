import { useState, useEffect } from 'react'
import { Menu, Plus } from 'lucide-react' // Import Icon Menu & Plus
import { journalService } from '../services/api'
import Header from '../components/Dashboard/Header'
import Sidebar from '../components/Dashboard/Sidebar'
import NotesList from '../components/Dashboard/NotesList'
import NoteEditor from '../components/Dashboard/NoteEditor'
import NoteReader from '../components/Dashboard/NoteReader'
import EmptyState from '../components/Dashboard/EmptyState'
import Button from '../components/Shared/Button' // Pastikan import Button

const DashboardPage = ({ setIsAuthenticated, showNotification }) => {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState(null)
  const [mode, setMode] = useState('empty') 
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  
  // State baru untuk Hamburger Menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async (query = '') => {
    try {
      const response = await journalService.getAll(query)
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

  // Filter Logic
  const filteredNotes = notes.filter(note => {
    if (selectedDate) {
      if (!note.created_at) return false;
      const noteDate = new Date(note.created_at);
      const isSameDate = 
        noteDate.getDate() === selectedDate.getDate() &&
        noteDate.getMonth() === selectedDate.getMonth() &&
        noteDate.getFullYear() === selectedDate.getFullYear();
      if (!isSameDate) return false;
    }
    return true; 
  });

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadNotes(query) 
  }

  const handleCreateNew = () => {
    setCurrentNote(null)
    setMode('create') 
  }

  // --- LOGIKA BARU: Toggle Mode Baca ---
  const handleSelectNote = (note) => {
    // Jika note yang diklik SAMA dengan yang sedang dibuka DAN mode sedang 'read'
    if (currentNote?.id === note.id && mode === 'read') {
        // Maka TUTUP (Deselect)
        setCurrentNote(null);
        setMode('empty');
    } else {
        // Buka note baru
        setCurrentNote(note);
        setMode('read');
    }
  }

  const handleEditNote = () => {
    setMode('edit') 
  }

  const handleSaveSuccess = async () => {
    await loadNotes(searchQuery)
    setMode('read') 
    showNotification('Catatan berhasil disimpan!', 'success')
  }

  const handleDeleteNote = async (noteId) => {
    // 1. Tentukan ID yang mau dihapus
    // Jika diklik dari Reader, noteId dikirim sebagai parameter
    // Jika tidak, ambil dari state currentNote
    const targetId = noteId || currentNote?.id;
    
    if (!targetId) return;

    // 2. Konfirmasi User (Pindah ke sini agar seragam)
    if (!window.confirm('Yakin ingin menghapus catatan ini?')) return;

    setLoading(true);

    try {
      await journalService.delete(targetId);

      setCurrentNote(null);
      setMode('empty');
      await loadNotes(searchQuery);
      showNotification('Catatan berhasil dihapus!', 'success');
    } catch (error) {
      showNotification('Gagal menghapus catatan', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    showNotification('Logout berhasil!', 'success')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header onLogout={handleLogout} />
      
      {/* Component Sidebar sekarang bertindak sebagai Drawer/Menu */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        notes={notes}
        onSearch={handleSearch}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      {/* Layout 2 Kolom: List (Kiri) | Konten (Kanan) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Kolom Kiri: List & Toolbar */}
        <div className="w-full md:w-[400px] bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-lg md:shadow-none">
          
          {/* Toolbar Strategis: Menu & Tambah */}
          <div className="p-4 border-b border-gray-100 flex gap-3 items-center bg-white/80 backdrop-blur sticky top-0 z-20">
            <Button 
                variant="secondary" 
                onClick={() => setIsSidebarOpen(true)}
                className="!p-3 rounded-xl shadow-none border border-gray-200 hover:border-blue-300"
                title="Buka Menu & Filter"
            >
                <Menu className="w-5 h-5 text-gray-600" />
            </Button>

            <Button
                variant="primary"
                className="flex-1 shadow-blue-200/50"
                onClick={handleCreateNew}
                icon={<Plus className="w-5 h-5" />}
            >
                Buat Catatan
            </Button>
          </div>

          {/* Info Filter Aktif (Opsional) */}
          {(selectedDate || searchQuery) && (
             <div className="px-4 py-2 bg-yellow-50 text-xs text-yellow-700 border-b border-yellow-100">
               Filter aktif: {selectedDate ? 'Tanggal' : ''} {selectedDate && searchQuery ? '&' : ''} {searchQuery ? 'Pencarian' : ''}
             </div>
          )}

          <div className="flex-1 overflow-y-auto">
             <NotesList
                notes={filteredNotes}
                currentNote={currentNote}
                onSelectNote={handleSelectNote}
                loading={loading}
             />
          </div>
        </div>

        {/* Kolom Kanan: Konten */}
        <div className="flex-1 bg-gray-50 h-full overflow-hidden relative hidden md:block">
          {mode === 'empty' && <EmptyState onCreateNew={handleCreateNew} />}
          
          {mode === 'read' && currentNote && (
            <NoteReader 
              note={currentNote} 
              onEdit={handleEditNote} 
              onDelete={() => handleDeleteNote(currentNote.id)}
              onClose={() => setMode('empty')}
            />
          )}

          {(mode === 'create' || mode === 'edit') && (
            <NoteEditor
              note={mode === 'edit' ? currentNote : null}
              onSave={handleSaveSuccess}
              onDelete={() => handleDeleteNote(currentNote?.id)}
              showNotification={showNotification}
              onCancel={() => currentNote ? setMode('read') : setMode('empty')}
            />
          )}
        </div>

        {/* Mobile View: Overlay Konten (Jika di HP, konten menutupi list) */}
        {mode !== 'empty' && (
            <div className="absolute inset-0 bg-white z-20 md:hidden">
                 {mode === 'read' && currentNote && (
                    <NoteReader 
                    note={currentNote} 
                    onEdit={handleEditNote} 
                    onDelete={handleDeleteNote}
                    onClose={() => setMode('empty')}
                    />
                )}
                {(mode === 'create' || mode === 'edit') && (
                    <NoteEditor
                    note={mode === 'edit' ? currentNote : null}
                    onSave={handleSaveSuccess}
                    onDelete={handleDeleteNote}
                    showNotification={showNotification}
                    onCancel={() => currentNote ? setMode('read') : setMode('empty')}
                    />
                )}
            </div>
        )}

      </div>
    </div>
  )
}

export default DashboardPage
import { BookOpen, PenTool } from 'lucide-react'
import Button from '../Shared/Button'

const EmptyState = ({ onCreateNew }) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Selamat Datang di Memoria!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Mulai menulis catatan harian Anda atau pilih catatan yang sudah ada dari sidebar.
        </p>
        
        <Button
          variant="primary"
          onClick={onCreateNew}
          icon={<PenTool className="w-5 h-5" />}
          className="mx-auto"
        >
          Mulai Menulis
        </Button>
      </div>
    </div>
  )
}

export default EmptyState
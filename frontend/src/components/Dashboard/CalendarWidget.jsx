import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Style bawaan
import '../../index.css'; // Pastikan CSS custom kita masuk

const CalendarWidget = ({ notes, onDateSelect }) => {
  const [value, setValue] = useState(new Date());

  // Fungsi untuk mengecek apakah ada catatan di tanggal tertentu
  const hasNote = (date) => {
    return notes.some(note => {
      const noteDate = new Date(note.created_at);
      return (
        noteDate.getDate() === date.getDate() &&
        noteDate.getMonth() === date.getMonth() &&
        noteDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Kustomisasi tampilan tanggal (Tile)
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasNote(date)) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  const handleChange = (nextValue) => {
    setValue(nextValue);
    onDateSelect(nextValue); // Kirim tanggal yang dipilih ke parent
  };

  return (
    <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-soft mb-4">
      <h3 className="font-semibold text-gray-700 mb-3">Kalender Jurnal</h3>
      <Calendar
        onChange={handleChange}
        value={value}
        tileContent={tileContent}
        className="w-full border-none rounded-lg text-sm !bg-transparent"
      />
    </div>
  );
};

export default CalendarWidget;
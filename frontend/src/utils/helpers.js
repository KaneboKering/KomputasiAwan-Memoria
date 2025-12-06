export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatShortDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getMoodEmoji = (mood) => {
  const moodMap = {
    'Netral': '😐',
    'Senang': '😊',
    'Sedih': '😢',
    'Marah': '😠',
    'Semangat': '🔥',
    'Sakit': '🤒',
    'Bingung': '😕'
  }
  return moodMap[mood] || '😐'
}
(function() {
    // Konfigurasi API
    const API_BASE_URL = 'https://komputasiawan-memoria-production.up.railway.app/api';
    
    let notes = [];
    let currentNote = null;

    // --- Helper untuk Autentikasi ---
    function getToken() {
        return localStorage.getItem('token');
    }

    function getAuthHeaders() {
        const token = getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Cek status login saat aplikasi dibuka
    function checkAuth() {
        const token = getToken();
        const userEmail = localStorage.getItem('userEmail');
        
        if (token && userEmail) {
            showMainApp(userEmail);
        } else {
            document.getElementById('authPage').classList.remove('hidden');
            document.getElementById('mainApp').classList.add('hidden');
        }
    }

    // --- UI Helpers ---
    window.switchTab = function(tab) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const tabs = document.querySelectorAll('.tab');

        tabs.forEach(t => t.classList.remove('active'));

        if (tab === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            tabs[0].classList.add('active');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            tabs[1].classList.add('active');
        }
    };

    window.previewImage = function(input) {
        const preview = document.getElementById('imagePreview');
        const container = document.getElementById('imagePreviewContainer');
        const fileName = document.getElementById('fileName');

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                container.classList.remove('hidden');
            }
            reader.readAsDataURL(input.files[0]);
            fileName.textContent = input.files[0].name;
        } else {
            // Jika user cancel upload
            fileName.textContent = 'Tidak ada file';
        }
    };

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // --- Authentication Functions ---
    window.handleRegister = async function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirm').value;

        if (password !== confirm) {
            showNotification('Password tidak cocok!', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Registrasi berhasil! Silakan login.', 'success');
                switchTab('login');
                e.target.reset();
            } else {
                showNotification(data.message || 'Registrasi gagal', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('Terjadi kesalahan koneksi', 'error');
        }
    };

    window.handleLogin = async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Simpan token dan info user
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userId', data.user.id);

                showMainApp(data.user.email);
                showNotification('Login berhasil!', 'success');
                // Reset form
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                showNotification(data.message || 'Login gagal', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('Gagal menghubungi server', 'error');
        }
    };

    window.handleLogout = function() {
        localStorage.clear();
        notes = [];
        currentNote = null;
        document.getElementById('authPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        showNotification('Logout berhasil!', 'success');
    };

    function showMainApp(email) {
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('userEmail').textContent = email;
        loadNotes();
    }

    // --- Notes Functions (CRUD) ---
    
    // READ (Get All Notes)
    async function loadNotes(query = '') {
        try {
            let url = `${API_BASE_URL}/journals`;
            if (query) {
                url += `?search=${encodeURIComponent(query)}`;
            }

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (response.status === 401 || response.status === 403) {
                handleLogout(); // Token expired
                return;
            }

            const result = await response.json();
            // Backend mengembalikan { data: [...], meta: {...} }
            notes = result.data || [];
            renderNotesList(notes);

        } catch (error) {
            console.error('Error loading notes:', error);
            showNotification('Gagal memuat catatan', 'error');
        }
    }

    function renderNotesList(notesData) {
        const notesList = document.getElementById('notesList');
        
        if (notesData.length === 0) {
            notesList.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Belum ada catatan</p>';
            return;
        }

        notesList.innerHTML = notesData.map(note => `
            <div class="note-item ${currentNote?.id === note.id ? 'active' : ''}" onclick="selectNote(${note.id})">
                <h3>${note.title || 'Tanpa Judul'}</h3>
                <p>${new Date(note.created_at).toLocaleDateString('id-ID')}</p>
            </div>
        `).join('');
    }

    // CREATE (New Note Setup)
    window.createNewNote = function() {
        currentNote = null;
        showEditor();
        
        // Reset Inputs
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('noteMood').value = 'Netral'; // Default mood
        
        // Reset Image Input & Preview
        document.getElementById('noteImage').value = ''; // Clear file input
        document.getElementById('fileName').textContent = 'Tidak ada file';
        document.getElementById('imagePreviewContainer').classList.add('hidden');
        document.getElementById('imagePreview').src = '';

        document.getElementById('noteDate').textContent = new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        const items = document.querySelectorAll('.note-item');
        items.forEach(i => i.classList.remove('active'));
    };

    // SELECT (Get Detail / Prepare Edit)
    // SELECT (Get Detail)
    window.selectNote = function(id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;

        currentNote = note;
        showEditor();

        // Isi form dengan data dari server
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('noteMood').value = note.mood || 'Netral'; // Set Mood
        
        // Handle Image Preview dari Server
        const previewContainer = document.getElementById('imagePreviewContainer');
        const previewImg = document.getElementById('imagePreview');
        
        if (note.imageUrl) {
            previewImg.src = note.imageUrl;
            previewContainer.classList.remove('hidden');
        } else {
            previewContainer.classList.add('hidden');
            previewImg.src = '';
        }

        // Reset file input (karena kita sedang melihat data server, bukan upload baru)
        document.getElementById('noteImage').value = '';
        document.getElementById('fileName').textContent = 'Gambar dari Server';

        document.getElementById('noteDate').textContent = new Date(note.created_at).toLocaleDateString('id-ID', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        
        renderNotesList(notes);
    };

    function showEditor() {
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('editorContent').classList.remove('hidden');
    }

    // SAVE (Create or Update)
    // SAVE (Create or Update with FormData)
    window.saveNote = async function() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        const mood = document.getElementById('noteMood').value; // Ambil Mood
        const imageInput = document.getElementById('noteImage'); // Ambil File

        if (!title || !content) {
            showNotification('Judul dan isi tidak boleh kosong!', 'error');
            return;
        }

        // --- GUNAKAN FORMDATA (Bukan JSON) ---
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('mood', mood);

        // Jika user memilih file baru, masukkan ke FormData
        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        try {
            let response;
            const token = getToken(); // Ambil token

            // Header khusus untuk FormData: JANGAN set 'Content-Type': 'application/json'
            // Biarkan browser yang mengatur boundary multipart-nya sendiri.
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            if (currentNote && currentNote.id) {
                // UPDATE (PUT)
                response = await fetch(`${API_BASE_URL}/journals/${currentNote.id}`, {
                    method: 'PUT',
                    headers: headers, // Header tanpa Content-Type
                    body: formData    // Body berupa FormData
                });
            } else {
                // CREATE (POST)
                response = await fetch(`${API_BASE_URL}/journals`, {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });
            }

            if (response.ok) {
                showNotification('Catatan berhasil disimpan!', 'success');
                loadNotes(); 
                
                // Jika note baru, masuk ke mode "Buat Baru" lagi agar bersih
                if(!currentNote) {
                     createNewNote(); 
                } else {
                    // Jika update, refresh data yang sedang dilihat (opsional)
                    // selectNote(currentNote.id); 
                }
            } else {
                const err = await response.json();
                showNotification(err.message || 'Gagal menyimpan', 'error');
            }

        } catch (error) {
            console.error(error);
            showNotification('Terjadi kesalahan', 'error');
        }
    };

    // DELETE
    window.deleteNote = async function() {
        if (!currentNote || !currentNote.id) return;
        if (!confirm('Yakin ingin menghapus catatan ini?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/journals/${currentNote.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                showNotification('Catatan berhasil dihapus!', 'success');
                currentNote = null;
                document.getElementById('emptyState').classList.remove('hidden');
                document.getElementById('editorContent').classList.add('hidden');
                loadNotes();
            } else {
                showNotification('Gagal menghapus catatan', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('Terjadi kesalahan', 'error');
        }
    };

    // SEARCH (Dengan Debounce agar tidak spam request)
    let searchTimeout;
    window.searchNotes = function() {
        const query = document.getElementById('searchInput').value;
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            loadNotes(query);
        }, 500); // Tunggu 500ms setelah mengetik baru request ke server
    };

    // Inisialisasi
    checkAuth();

})();
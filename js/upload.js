// js/upload.js
// Menangani pengunggahan dan pemrosesan dataset kustom (Excel, CSV, JSON)

let DATASET_KUSTOM = null;

function initUploadHandler() {
    const sumberSelect = document.getElementById('sumberDataset');
    const uploadContainer = document.getElementById('uploadContainer');
    const fileInput = document.getElementById('fileDataset');
    const statusText = document.getElementById('uploadStatus');

    if (!sumberSelect || !fileInput) return;

    // Toggle tampilan kotak upload
    sumberSelect.addEventListener('change', function() {
        if (this.value === 'kustom') {
            uploadContainer.style.display = 'block';
        } else {
            uploadContainer.style.display = 'none';
        }
    });

        // Visual Drag & Drop Effects
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('dragover');
    });
    uploadContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('dragover');
    });
    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('dragover');
        
        // Pindahkan file yang didrop ke input
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            
            // Panggil event change secara manual
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });

    // Tangani saat file dipilih (via klik atau drop)
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        statusText.innerHTML = '⏳ Membaca file <b>' + file.name + '</b>...';
        statusText.style.color = '#3B82F6';

        const reader = new FileReader();

        // Jika file JSON
        if (file.name.endsWith('.json')) {
            reader.onload = function(event) {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (!Array.isArray(parsed) || parsed.length === 0) {
                        throw new Error('Format JSON harus berupa Array berisi data pasien!');
                    }
                    DATASET_KUSTOM = normalisasiDataset(parsed);
                    suksesUpload(file.name, DATASET_KUSTOM.length);
                } catch (err) {
                    gagalUpload('JSON Error: ' + err.message);
                }
            };
            reader.readAsText(file);
        } 
        // Jika file Excel (.xlsx, .xls) atau CSV
        else {
            reader.onload = function(event) {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonArray = XLSX.utils.sheet_to_json(worksheet);

                    if (!jsonArray || jsonArray.length === 0) {
                        throw new Error('Tabel Excel/CSV kosong!');
                    }
                    DATASET_KUSTOM = normalisasiDataset(jsonArray);
                    suksesUpload(file.name, DATASET_KUSTOM.length);
                } catch (err) {
                    gagalUpload('Gagal membaca Excel/CSV: Pastikan format tabel kolomnya sesuai.');
                    console.error(err);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    });
}

// Mengubah semua key dan value string menjadi lowercase/seragam agar rumus Bayes tidak salah hitung
function normalisasiDataset(rawArray) {
    return rawArray.map(row => {
        let cleanRow = {};
        for (let key in row) {
            let cleanKey = key.toString().trim().toLowerCase();
            let val = row[key];
            if (typeof val === 'string') {
                val = val.trim().toLowerCase();
            }
            cleanRow[cleanKey] = val;
        }
        return cleanRow;
    });
}

function suksesUpload(filename, count) {
    const statusText = document.getElementById('uploadStatus');
    statusText.innerHTML = '✅ Berhasil memuat <b>' + filename + '</b> (' + count + ' baris data siap digunakan!)';
    statusText.style.color = '#10B981';
}

function gagalUpload(pesan) {
    const statusText = document.getElementById('uploadStatus');
    statusText.innerHTML = '❌ ' + pesan;
    statusText.style.color = '#EF4444';
    DATASET_KUSTOM = null;
}

// Jalankan event listener saat web siap
document.addEventListener('DOMContentLoaded', initUploadHandler);

// Fungsi Global untuk Mengunduh Contoh Dataset (CSV / JSON)
window.downloadSampleDataset = function(type) {
    if (!type) return;

    // Gunakan dataset default sistem atau buat array sampel
    const dataToExport = (typeof DATASET_JANTUNG !== 'undefined' && Array.isArray(DATASET_JANTUNG)) 
        ? DATASET_JANTUNG 
        : [
            { umur: 'tinggi', gender: 'L', tekanan_darah: 'tinggi', kolesterol: 'tinggi', gula_darah: 'diabetes', riwayat_keluarga: 'ada', jantung: 'ya' },
            { umur: 'rendah', gender: 'P', tekanan_darah: 'normal', kolesterol: 'rendah', gula_darah: 'normal', riwayat_keluarga: 'tidak', jantung: 'tidak' }
          ];

    if (type === 'json') {
        const jsonStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        triggerDownload(blob, 'contoh_dataset_jantung.json');
    } 
    else if (type === 'csv') {
        // Konversi array JSON ke string CSV
        const headers = ['umur', 'gender', 'tekanan_darah', 'kolesterol', 'gula_darah', 'riwayat_keluarga', 'jantung'];
        let csvStr = headers.join(',') + '\n';

        dataToExport.forEach(row => {
            const values = headers.map(h => row[h] || '');
            csvStr += values.join(',') + '\n';
        });

        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        triggerDownload(blob, 'contoh_dataset_jantung.csv');
    }
};

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


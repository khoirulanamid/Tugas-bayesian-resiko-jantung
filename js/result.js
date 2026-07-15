
window.cetakLaporan = function(tipe = '') {
    const formCard = document.getElementById('formCard');
    const hasilCard = document.getElementById('hasilCard');
    const splitDash = document.querySelector('.split-dashboard');
    const nav = document.querySelector('.global-nav');
    const dashHeader = document.querySelector('.dashboard-header');
    const hero = document.querySelector('.hero-section');
    const sampleBar = document.querySelector('.sample-download-bar');
    const tabs = document.querySelector('.tabs-container');
    const printBtns = document.querySelectorAll('.btn-print');

    // Jika tipe adalah 'ringkasan', kita gunakan mode cetak laporan klinik formal
    if (tipe === 'ringkasan') {
        document.body.classList.add('printing-clinic');
        window.print();
        document.body.classList.remove('printing-clinic');
        return;
    }

    // Simpan style awal
    const oldFormDisplay = formCard ? formCard.style.display : '';
    const oldHasilStyle = hasilCard ? hasilCard.getAttribute('style') : '';
    const oldDashStyle = splitDash ? splitDash.getAttribute('style') : '';

    // Modifikasi DOM untuk cetak bersih 1 kolom penuh
    if (formCard) formCard.style.setProperty('display', 'none', 'important');
    if (nav) nav.style.setProperty('display', 'none', 'important');
    if (hero) hero.style.setProperty('display', 'none', 'important');
    if (dashHeader) dashHeader.style.setProperty('display', 'none', 'important');
    if (sampleBar) sampleBar.style.setProperty('display', 'none', 'important');
    if (tabs) tabs.style.setProperty('display', 'none', 'important');
    printBtns.forEach(btn => btn.style.setProperty('display', 'none', 'important'));

    if (splitDash) {
        splitDash.style.setProperty('display', 'block', 'important');
        splitDash.style.setProperty('width', '100%', 'important');
    }
    if (hasilCard) {
        hasilCard.style.setProperty('display', 'block', 'important');
        hasilCard.style.setProperty('width', '100%', 'important');
        hasilCard.style.setProperty('max-width', '100%', 'important');
        hasilCard.style.setProperty('height', 'auto', 'important');
        hasilCard.style.setProperty('max-height', 'none', 'important');
        hasilCard.style.setProperty('overflow', 'visible', 'important');
        hasilCard.style.setProperty('box-shadow', 'none', 'important');
        hasilCard.style.setProperty('border', 'none', 'important');
        hasilCard.style.setProperty('padding', '0', 'important');
    }

    // Panggil mesin cetak
    window.print();

    // Kembalikan ke tampilan semula setelah dialog cetak ditutup
    if (formCard) formCard.style.display = oldFormDisplay;
    if (hasilCard) hasilCard.setAttribute('style', oldHasilStyle || '');
    if (splitDash) splitDash.setAttribute('style', oldDashStyle || '');
    if (nav) nav.style.display = '';
    if (hero) hero.style.display = '';
    if (dashHeader) dashHeader.style.display = '';
    if (sampleBar) sampleBar.style.display = '';
    if (tabs) tabs.style.display = '';
    printBtns.forEach(btn => btn.style.display = '');
};

// js/result.js (Apple Design UI / UX Pro Max - Tabbed Dashboard)

window.switchTab = function(tabId) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const indicator = document.getElementById('tabIndicator');

    let activeIndex = 0;
    
    tabContents.forEach((content, index) => {
        if(content.id === tabId) {
            content.classList.add('active');
            activeIndex = index;
        } else {
            content.classList.remove('active');
        }
    });

    tabBtns.forEach((btn, index) => {
        if(index === activeIndex) {
            btn.classList.add('active');
            indicator.style.transform = 'translateX(' + (index * 100) + '%)';
        } else {
            btn.classList.remove('active');
        }
    });
};

function tampilkanHasil(probabilitas, dataPasien, infoDataset, datasetReal, rincianHitung) {
    const hasilContainer = document.getElementById('hasil');
    const hasilCard = document.getElementById('hasilCard');
    if (!hasilContainer) return;

    if (hasilCard) {
        hasilCard.style.justifyContent = 'flex-start';
    }

    // === PERSIAPAN UI RINGKASAN ===
    let kategori = ''; let warna = ''; let badgeClass = ''; let saran = '';
    if (probabilitas < 40) { kategori = 'Risiko Rendah'; warna = '#34C759'; badgeClass = 'badge-low'; saran = 'Kesehatan Anda berada di zona optimal. Lanjutkan gaya hidup aktif.'; }
    else if (probabilitas < 70) { kategori = 'Risiko Sedang'; warna = '#FF9500'; badgeClass = 'badge-medium'; saran = 'Kurangi konsumsi natrium dan lemak jenuh. Pantau tekanan darah berkala.'; }
    else { kategori = 'Risiko Tinggi'; warna = '#FF3B30'; badgeClass = 'badge-high'; saran = 'Segera jadwalkan konsultasi dengan spesialis kardiologi.'; }

    // === GENERATE TABEL DATASET ===
    let tableRows = '';
    datasetReal.forEach((row, i) => {
        let badgeJantung = (row.jantung && row.jantung.toLowerCase() === 'ya') ? '<span class="ya">Ya</span>' : '<span class="tidak">Tidak</span>';
        tableRows += '<tr><td>' + (i+1) + '</td><td>' + row.umur + '</td><td>' + row.gender + '</td><td>' + row.tekanan_darah + '</td><td>' + row.kolesterol + '</td><td>' + row.gula_darah + '</td><td>' + row.riwayat_keluarga + '</td><td>' + badgeJantung + '</td></tr>';
    });

    // === GENERATE HTML UTAMA DENGAN STRUKTUR TAB YANG TEPAT ===
    hasilContainer.innerHTML = [
        '<!-- Tabs Control -->',
        '<div class="tabs-container">',
            '<div class="segmented-control">',
                '<div class="tab-indicator" id="tabIndicator" style="width: 33.33%;"></div>',
                '<button class="tab-btn active" onclick="switchTab(\'tabRingkasan\')">Ringkasan Prediksi</button>',
                '<button class="tab-btn" onclick="switchTab(\'tabDetail\')">Detail Perhitungan</button>',
                '<button class="tab-btn" onclick="switchTab(\'tabTabel\')">Tabel Dataset</button>',
            '</div>',
        '</div>',

        '<!-- TAB 1: RINGKASAN PREDIKSI -->',
        '<div id="tabRingkasan" class="tab-content active">',
            '<div class="result-header" style="border-bottom: 1px solid var(--border-light); padding-bottom: 20px; margin-bottom: 24px;">',
                '<h3 style="font-size: 1.5rem;">Laporan Analisis Medis</h3>',
                '<span class="badge ' + badgeClass + '">' + kategori + '</span>',
            '</div>',
            '<div class="progress-section" style="margin-bottom: 28px;">',
                '<div class="progress-number" style="color: ' + warna + '; font-size: 3.8rem;"><span class="counter-num">0.0</span><span>%</span></div>',
                '<div class="progress-bar-bg"><div class="progress-bar-fill" style="background: ' + warna + '; width: 0%;" id="barFill"></div></div>',
                '<p class="prob-label">Estimasi Kemungkinan Mengidap Penyakit Jantung</p>',
            '</div>',
            '<div class="params-recap" style="grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">',
                '<div class="recap-item" style="padding: 12px 14px;"><span class="recap-icon" style="font-size: 1.3rem;">🎂</span><div class="recap-text"><span class="recap-title">Usia</span><span class="recap-val">' + dataPasien.usiaAsli + ' th ('+ dataPasien.usia +')</span></div></div>',
                '<div class="recap-item" style="padding: 12px 14px;"><span class="recap-icon" style="font-size: 1.3rem;">👤</span><div class="recap-text"><span class="recap-title">Gender</span><span class="recap-val">' + (dataPasien.gender === 'L' ? 'Laki-laki' : 'Perempuan') + '</span></div></div>',
                '<div class="recap-item" style="padding: 12px 14px;"><span class="recap-icon" style="font-size: 1.3rem;">🩸</span><div class="recap-text"><span class="recap-title">Tekanan</span><span class="recap-val">' + dataPasien.tekanan + '</span></div></div>',
                '<div class="recap-item" style="padding: 12px 14px;"><span class="recap-icon" style="font-size: 1.3rem;">🧪</span><div class="recap-text"><span class="recap-title">Kolesterol</span><span class="recap-val">' + dataPasien.kolesterol + '</span></div></div>',
                '<div class="recap-item" style="padding: 12px 14px;"><span class="recap-icon" style="font-size: 1.3rem;">🍬</span><div class="recap-text"><span class="recap-title">Gula Darah</span><span class="recap-val">' + dataPasien.gula_darah + '</span></div></div>',
                '<div class="recap-item" style="padding: 12px 14px;"><span class="recap-icon" style="font-size: 1.3rem;">🧬</span><div class="recap-text"><span class="recap-title">Genetik</span><span class="recap-val">' + dataPasien.riwayat + '</span></div></div>',
            '</div>',
            '<div class="saran-box" style="padding: 18px; margin-bottom: 20px;">',
                '<strong style="font-size: 1rem;">Rekomendasi Medis</strong><p style="font-size: 0.9rem;">' + saran + '</p>',
            '</div>',
            '<button class="btn-print" onclick="cetakLaporan(\'ringkasan\')" style="width: 100%; margin: 0 0 20px;">🖨️ Cetak Laporan Medis Resmi (PDF)</button>',
            '<div class="disclaimer" style="padding-top: 16px;">',
                '<b>Sumber Model:</b> ' + infoDataset.nama + ' (' + infoDataset.total + ' pasien historis)<br>',
                '<i>Laplace Smoothing: ' + (rincianHitung.isLaplace ? 'Aktif' : 'Nonaktif') + '</i>',
            '</div>',
        '</div>',

        '<!-- TAB 2: DETAIL PERHITUNGAN -->',
        '<div id="tabDetail" class="tab-content">',
            '<div class="math-box">',
                '<h4>📊 Probabilitas Prior (Kelas)</h4>',
                '<div class="info-callout">💡 <b>Prior:</b> Peluang awal dari populasi dataset Anda. Menjawab pertanyaan: <i>"Secara umum, berapa persen orang yang sakit jantung vs orang sehat di data ini?"</i></div>',
                '<ul>',
                    '<li><span>P(Jantung = Ya)</span><span class="math-highlight">' + rincianHitung.priorYa.toFixed(4) + '</span></li>',
                    '<li><span>P(Jantung = Tidak)</span><span class="math-highlight">' + rincianHitung.priorTidak.toFixed(4) + '</span></li>',
                '</ul>',
                '<h4>📈 Likelihood: JIKA Pasien SAKIT (Ya)</h4>',
                '<div class="info-callout">💡 <b>Likelihood:</b> Peluang munculnya sebuah gejala. Menjawab pertanyaan: <i>"Dari seluruh orang yang SAKIT JANTUNG, seberapa sering gejala ini muncul?"</i></div>',
                '<ul>',
                    '<li><span>P(Usia=' + dataPasien.usia + ' | Ya)</span><span class="math-highlight">' + rincianHitung.likeYa.umur.toFixed(4) + '</span></li>',
                    '<li><span>P(Gender=' + dataPasien.gender + ' | Ya)</span><span class="math-highlight">' + rincianHitung.likeYa.gender.toFixed(4) + '</span></li>',
                    '<li><span>P(Tekanan=' + dataPasien.tekanan + ' | Ya)</span><span class="math-highlight">' + rincianHitung.likeYa.tekanan.toFixed(4) + '</span></li>',
                    '<li><span>P(Kolesterol=' + dataPasien.kolesterol + ' | Ya)</span><span class="math-highlight">' + rincianHitung.likeYa.kolesterol.toFixed(4) + '</span></li>',
                    '<li><span>P(Gula=' + dataPasien.gula_darah + ' | Ya)</span><span class="math-highlight">' + rincianHitung.likeYa.gula.toFixed(4) + '</span></li>',
                    '<li><span>P(Riwayat=' + dataPasien.riwayat + ' | Ya)</span><span class="math-highlight">' + rincianHitung.likeYa.riwayat.toFixed(4) + '</span></li>',
                '</ul>',
                '<h4>📉 Likelihood: JIKA Pasien SEHAT (Tidak)</h4>',
                '<div class="info-callout">💡 Sebaliknya, menjawab: <i>"Dari seluruh orang yang SEHAT (TIDAK SAKIT), seberapa sering gejala pasien ini muncul?"</i></div>',
                '<ul>',
                    '<li><span>P(Usia=' + dataPasien.usia + ' | Tidak)</span><span class="math-highlight">' + rincianHitung.likeTidak.umur.toFixed(4) + '</span></li>',
                    '<li><span>P(Gender=' + dataPasien.gender + ' | Tidak)</span><span class="math-highlight">' + rincianHitung.likeTidak.gender.toFixed(4) + '</span></li>',
                    '<li><span>P(Tekanan=' + dataPasien.tekanan + ' | Tidak)</span><span class="math-highlight">' + rincianHitung.likeTidak.tekanan.toFixed(4) + '</span></li>',
                    '<li><span>P(Kolesterol=' + dataPasien.kolesterol + ' | Tidak)</span><span class="math-highlight">' + rincianHitung.likeTidak.kolesterol.toFixed(4) + '</span></li>',
                    '<li><span>P(Gula=' + dataPasien.gula_darah + ' | Tidak)</span><span class="math-highlight">' + rincianHitung.likeTidak.gula.toFixed(4) + '</span></li>',
                    '<li><span>P(Riwayat=' + dataPasien.riwayat + ' | Tidak)</span><span class="math-highlight">' + rincianHitung.likeTidak.riwayat.toFixed(4) + '</span></li>',
                '</ul>',
                '<h4>🧮 Hasil Teorema Bayes (Posterior Akhir)</h4>',
                '<div class="info-callout">💡 <b>Posterior:</b> Semua angka Likelihood di atas dikalikan, lalu dinormalisasi menjadi persentase 0-100%. Inilah hasil akhir prediksi risiko untuk pasien ini!</div>',
                '<ul>',
                    '<li><span>Probabilitas Terkena Jantung (Belum Normalisasi)</span><span class="math-highlight">' + rincianHitung.unnormYa.toExponential(4) + '</span></li>',
                    '<li><span>Probabilitas Normal (Belum Normalisasi)</span><span class="math-highlight">' + rincianHitung.unnormTidak.toExponential(4) + '</span></li>',
                '</ul>',
                '<div style="text-align:center; padding: 16px 0 10px; font-size: 1rem;">',
                    '<b>Persentase Akhir: </b> <span style="color: ' + warna + '; font-size: 1.2rem; font-weight:bold;">' + probabilitas.toFixed(2) + '%</span>',
                '</div>',
            '</div>',
            '<button class="btn-print" onclick="cetakLaporan(\'detail\')" style="width: 100%; margin: 20px 0 0;">🖨️ Cetak / Simpan Detail Perhitungan (PDF)</button>',
        '</div>',

        '<!-- TAB 3: TABEL DATASET -->',
        '<div id="tabTabel" class="tab-content">',
            '<div class="table-responsive">',
                '<table class="data-table">',
                    '<thead><tr><th>No</th><th>Usia</th><th>Gender</th><th>Tekanan</th><th>Kolesterol</th><th>Gula</th><th>Riwayat</th><th>Jantung</th></tr></thead>',
                    '<tbody>', tableRows, '</tbody>',
                '</table>',
            '</div>',
            '<button class="btn-print" onclick="cetakLaporan(\'tabel\')" style="width: 100%; margin: 20px 0 0;">🖨️ Cetak / Simpan Tabel Dataset (PDF)</button>',
        '</div>'
    ].join('');

    // --- APPEND PRINT CLINIC REPORT TO BODY DIRECTLY ---
    // Remove existing if any
    const existingReport = document.getElementById('print-clinic-report');
    if (existingReport) {
        existingReport.remove();
    }

    const printContainer = document.createElement('div');
    printContainer.id = 'print-clinic-report';
    printContainer.style.display = 'none';
    printContainer.innerHTML = [
        '<!-- Header -->',
        '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">',
            '<div style="display: flex; align-items: center; gap: 15px;">',
                '<div style="font-size: 3rem; line-height: 1;">⚕️</div>',
                '<div>',
                    '<h2 style="margin: 0; font-size: 20px; color: #1e3a8a;">HealthTech</h2>',
                    '<h2 style="margin: 0; font-size: 20px; color: #64748b; font-weight: normal;">Klinik Jantung</h2>',
                '</div>',
            '</div>',
            '<div style="text-align: center; font-size: 13px; line-height: 1.4;">',
                '<b style="font-size: 15px;">KLINIK UTAMA HEALTHTECH PRO</b><br>',
                'Jl. Jantung Sehat No. 123, Jakarta Pusat<br>',
                'Kec. Menteng, DKI Jakarta – 10110<br>',
                '<b>Telp. 021 5550199</b>',
            '</div>',
        '</div>',
        
        '<h3 style="text-align: center; font-size: 14px; margin-bottom: 30px;">LAPORAN ANALISIS RISIKO KARDIOVASKULAR</h3>',
        
        '<!-- Patient Info -->',
        '<table style="width: 100%; border: none; font-size: 13px; margin-bottom: 30px; line-height: 1.6;">',
            '<tr><td style="width: 200px;">Nama Pasien</td><td style="width: 15px;">:</td><td>' + (dataPasien.nama_pasien ? dataPasien.nama_pasien.toUpperCase() : 'PASIEN ANONIM') + '</td></tr>',
            '<tr><td>No. MR</td><td>:</td><td>00' + Math.floor(Math.random() * 90000 + 10000) + '</td></tr>',
            '<tr><td>Usia</td><td>:</td><td>' + dataPasien.usiaAsli + ' Tahun</td></tr>',
            '<tr><td>Jenis Kelamin</td><td>:</td><td>' + (dataPasien.gender === 'L' ? 'Laki-Laki' : 'Perempuan') + '</td></tr>',
            '<tr><td>Metode Analisis</td><td>:</td><td><b>Algoritma Naive Bayes (Sistem Pakar)</b></td></tr>',
            '<tr><td>Tanggal Pemeriksaan</td><td>:</td><td>' + new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) + '</td></tr>',
        '</table>',

        '<!-- Clinical Parameters -->',
        '<div style="font-size: 13px; line-height: 1.6;">',
            '<b style="font-size: 13px;">Parameter Klinis Awal:</b><br>',
            'Berdasarkan data pemeriksaan yang dimasukkan, didapatkan kondisi klinis sebagai berikut:<br><br>',
            '<table style="width: 100%; border: none; margin-left: 20px; margin-bottom: 25px;">',
                '<tr><td style="width: 180px;">Tekanan Darah</td><td style="width: 15px;">:</td><td style="text-transform: capitalize;">' + dataPasien.tekanan + '</td></tr>',
                '<tr><td>Kolesterol Total</td><td>:</td><td style="text-transform: capitalize;">' + dataPasien.kolesterol + '</td></tr>',
                '<tr><td>Gula Darah Puasa</td><td>:</td><td style="text-transform: capitalize;">' + dataPasien.gula_darah + '</td></tr>',
                '<tr><td>Riwayat Penyakit Jantung</td><td>:</td><td style="text-transform: capitalize;">' + dataPasien.riwayat + ' Keluarga</td></tr>',
            '</table>',
        '</div>',

        '<!-- Analysis Result -->',
        '<div style="font-size: 13px; line-height: 1.6; margin-bottom: 25px;">',
            '<b style="font-size: 13px;">Hasil Komputasi Model Medis:</b><br>',
            '<p style="margin-top: 5px; text-align: justify;">',
            'Melalui perhitungan probabilitas bersyarat dengan menggunakan ' + infoDataset.total + ' data historis pasien sebagai prior likelihood, probabilitas akhir (posterior) pasien ini menunjukkan angka sebesar <b>' + probabilitas.toFixed(2) + '%</b> untuk kecenderungan mengidap penyakit jantung koroner.',
            '</p>',
        '</div>',

        '<!-- Conclusion & Recommendation -->',
        '<table style="width: 100%; border: none; font-size: 13px; line-height: 1.6; margin-bottom: 40px;">',
            '<tr>',
                '<td style="width: 200px; vertical-align: top;"><b style="font-size: 13px;">Kesimpulan</b></td>',
                '<td style="width: 15px; vertical-align: top;">:</td>',
                '<td><b>KATEGORI RISIKO ' + kategori.toUpperCase() + ' (' + probabilitas.toFixed(2) + '%)</b></td>',
            '</tr>',
            '<tr>',
                '<td style="vertical-align: top; padding-top: 10px;"><b style="font-size: 13px;">Anjuran</b></td>',
                '<td style="vertical-align: top; padding-top: 10px;">:</td>',
                '<td style="padding-top: 10px; text-align: justify;">' + saran + '<br>Tetap pantau indikator kesehatan secara rutin. (Catatan: Ini adalah estimasi probabilistik awal. Lakukan konsultasi lebih lanjut dengan dokter spesialis untuk penanganan klinis yang akurat).</td>',
            '</tr>',
        '</table>',

        '<!-- Signature -->',
        '<div style="display: flex; justify-content: flex-end; font-size: 13px; text-align: center; margin-top: 50px;">',
            '<div>',
                '<p style="margin: 0;">Jakarta, ' + new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) + '</p>',
                '<div style="font-family: \'Brush Script MT\', cursive; font-size: 28px; margin: 15px 0; color: #1e3a8a; transform: rotate(-5deg);">',
                    'dr. HealthTech',
                '</div>',
                '<p style="margin: 0; text-decoration: underline; font-weight: bold;">dr. HealthTech, SpJP</p>',
                '<p style="margin: 0;">Sistem Prediksi AI</p>',
            '</div>',
        '</div>'
    ].join('');
    
    document.body.appendChild(printContainer);

    // === ANIMASI ANIME.JS ===
    let stat = { val: 0 };
    let numElement = document.querySelector('.counter-num');
    const timeline = anime.timeline({ easing: 'easeOutExpo', duration: 750 });

    timeline
    .add({ targets: '.tabs-container', opacity: [0, 1], duration: 400 })
    .add({ targets: ['#tabRingkasan .result-header', '#tabRingkasan .progress-section'], opacity: [0, 1], translateY: [15, 0], delay: anime.stagger(120), duration: 700 }, '-=300')
    .add({ targets: '#barFill', width: probabilitas + '%', easing: 'easeOutElastic(1, 1)', duration: 1300 }, '-=350')
    .add({ targets: stat, val: probabilitas, round: 1, duration: 1300, update: function() { if(numElement) numElement.innerHTML = parseFloat(stat.val).toFixed(1); } }, '-=1300');
}






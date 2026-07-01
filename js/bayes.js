// ============================================
// FUNGSI PERHITUNGAN NAIVE BAYES (6 PARAMETER KLINIS)
// ============================================

let infoDatasetTerakhir = { nama: 'Dataset Default Sistem', total: 150 };

async function loadDataset() {
    const sumberSelect = document.getElementById('sumberDataset');
    if (sumberSelect && sumberSelect.value === 'kustom') {
        if (!DATASET_KUSTOM || DATASET_KUSTOM.length === 0) throw new Error('Anda belum mengunggah file dataset atau file tersebut tidak valid/kosong.');
        const fileInput = document.getElementById('fileDataset');
        const fileName = (fileInput && fileInput.files[0]) ? fileInput.files[0].name : 'File Kustom';
        infoDatasetTerakhir = { nama: 'File Unggahan (' + fileName + ')', total: DATASET_KUSTOM.length };
        return DATASET_KUSTOM;
    }
    if (typeof DATASET_JANTUNG !== 'undefined' && Array.isArray(DATASET_JANTUNG)) {
        infoDatasetTerakhir = { nama: 'Dataset Default Sistem', total: DATASET_JANTUNG.length };
        return DATASET_JANTUNG;
    }
    throw new Error('Dataset default gagal dimuat.');
}

/**
 * Menghitung probabilitas bersyarat (Likelihood) P(Fitur = Nilai | Kelas)
 * Jika isLaplace aktif, tambahkan add-1 smoothing.
 */
function hitungLikelihood(subsetData, namaFitur, nilaiTarget, jumlahKategoriUnik, isLaplace) {
    const cocok = subsetData.filter(item => item[namaFitur] === nilaiTarget).length;
    if (isLaplace) {
        return (cocok + 1) / (subsetData.length + jumlahKategoriUnik);
    } else {
        return cocok / subsetData.length || 0;
    }
}

async function hitungResiko() {
    const errorBox = document.getElementById('error-message');
    if (errorBox) errorBox.style.display = 'none';

    const dataPasien = typeof getInputData === 'function' ? getInputData() : null;
    if (!dataPasien) return;

    try {
        const btn = document.getElementById('btnHitung');
        const textAwal = btn.innerHTML;
        btn.innerHTML = 'Menghitung...';
        btn.disabled = true;

        const dataset = await loadDataset();
        if (!dataset || dataset.length === 0) throw new Error('Dataset kosong atau tidak sah.');

        const laplaceToggle = document.getElementById('laplaceToggle');
        const isLaplace = laplaceToggle ? laplaceToggle.checked : true;

        const dataJantungYa = dataset.filter(d => d.jantung === 'ya');
        const dataJantungTidak = dataset.filter(d => d.jantung === 'tidak');

        const priorYa = dataJantungYa.length / dataset.length;
        const priorTidak = dataJantungTidak.length / dataset.length;

        // Hitung masing-masing kemungkinan fitur
        const likeYa_umur = hitungLikelihood(dataJantungYa, 'umur', dataPasien.usia, 3, isLaplace);
        const likeTidak_umur = hitungLikelihood(dataJantungTidak, 'umur', dataPasien.usia, 3, isLaplace);

        const likeYa_gender = hitungLikelihood(dataJantungYa, 'gender', dataPasien.gender, 2, isLaplace);
        const likeTidak_gender = hitungLikelihood(dataJantungTidak, 'gender', dataPasien.gender, 2, isLaplace);

        const likeYa_tekanan = hitungLikelihood(dataJantungYa, 'tekanan_darah', dataPasien.tekanan, 3, isLaplace);
        const likeTidak_tekanan = hitungLikelihood(dataJantungTidak, 'tekanan_darah', dataPasien.tekanan, 3, isLaplace);

        const likeYa_kolesterol = hitungLikelihood(dataJantungYa, 'kolesterol', dataPasien.kolesterol, 3, isLaplace);
        const likeTidak_kolesterol = hitungLikelihood(dataJantungTidak, 'kolesterol', dataPasien.kolesterol, 3, isLaplace);

        const likeYa_gula = hitungLikelihood(dataJantungYa, 'gula_darah', dataPasien.gula_darah, 2, isLaplace);
        const likeTidak_gula = hitungLikelihood(dataJantungTidak, 'gula_darah', dataPasien.gula_darah, 2, isLaplace);

        const likeYa_riwayat = hitungLikelihood(dataJantungYa, 'riwayat_keluarga', dataPasien.riwayat, 2, isLaplace);
        const likeTidak_riwayat = hitungLikelihood(dataJantungTidak, 'riwayat_keluarga', dataPasien.riwayat, 2, isLaplace);

        // Perhitungan Posterior (6 parameter)
        const unnormalizedYa = priorYa * likeYa_umur * likeYa_gender * likeYa_tekanan * likeYa_kolesterol * likeYa_gula * likeYa_riwayat;
        const unnormalizedTidak = priorTidak * likeTidak_umur * likeTidak_gender * likeTidak_tekanan * likeTidak_kolesterol * likeTidak_gula * likeTidak_riwayat;

        const totalProbabilitas = unnormalizedYa + unnormalizedTidak;
        // Tangani pembagian nol jika semua kemungkinan 0 tanpa laplace
        let probabilitasJantung = 0;
        if (totalProbabilitas > 0) {
            probabilitasJantung = (unnormalizedYa / totalProbabilitas) * 100;
        }

        // Kumpulkan Rincian Perhitungan
        const rincianHitung = {
            isLaplace,
            priorYa, priorTidak,
            likeYa: { umur: likeYa_umur, gender: likeYa_gender, tekanan: likeYa_tekanan, kolesterol: likeYa_kolesterol, gula: likeYa_gula, riwayat: likeYa_riwayat },
            likeTidak: { umur: likeTidak_umur, gender: likeTidak_gender, tekanan: likeTidak_tekanan, kolesterol: likeTidak_kolesterol, gula: likeTidak_gula, riwayat: likeTidak_riwayat },
            unnormYa: unnormalizedYa,
            unnormTidak: unnormalizedTidak
        };

        btn.innerHTML = textAwal;
        btn.disabled = false;

        if (typeof tampilkanHasil === 'function') {
            tampilkanHasil(probabilitasJantung, dataPasien, infoDatasetTerakhir, dataset, rincianHitung);
        }
    } catch (error) {
        console.error(error);
        const btn = document.getElementById('btnHitung');
        if (btn) { btn.innerHTML = '⚡ Hitung Probabilitas Risiko'; btn.disabled = false; }
        const errorBox = document.getElementById('error-message');
        if (errorBox) { errorBox.textContent = error.message; errorBox.style.display = 'block'; }
    }
}

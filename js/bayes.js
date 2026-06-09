// ============================================
// 1. FUNGSI UNTUK LOAD DAN HITUNG PROBABILITAS DARI DATASET
// ============================================

let datasetCache = null;
let probabilitasCache = null;

// Load dataset dari JSON file
async function loadDataset() {
    if (datasetCache) return datasetCache;
    
    try {
        const response = await fetch('data/dataset.json');
        datasetCache = await response.json();
        console.log("Dataset dimuat:", datasetCache.length, "records");
        return datasetCache;
    } catch (error) {
        console.error("Error loading dataset:", error);
        return [];
    }
}

// Hitung probabilitas dari dataset
function hitungProbabilitasDariDataset(dataset) {
    if (!dataset || dataset.length === 0) {
        console.warn("Dataset kosong, menggunakan nilai default");
        return null;
    }

    // Hitung jumlah total dan kasus penyakit jantung
    const totalData = dataset.length;
    const kasusJantung = dataset.filter(d => d.jantung === "ya").length;
    const kasusNormal = totalData - kasusJantung;

    // Prior probability: P(Jantung)
    const priorJantung = kasusJantung / totalData;
    const priorNormal = kasusNormal / totalData;

    console.log(`Prior - Jantung: ${(priorJantung * 100).toFixed(2)}%, Normal: ${(priorNormal * 100).toFixed(2)}%`);

    // Hitung likelihood untuk setiap faktor
    // P(Faktor | Jantung) dan P(Faktor | Normal)
    
    const dataJantung = dataset.filter(d => d.jantung === "ya");
    const dataNormal = dataset.filter(d => d.jantung === "tidak");

    const faktor = {};

    // Faktor: Umur Tinggi
    faktor.umurTinggi = {
        givenJantung: dataJantung.filter(d => d.umur === "tinggi").length / (dataJantung.length || 1),
        givenNormal: dataNormal.filter(d => d.umur === "tinggi").length / (dataNormal.length || 1)
    };

    // Faktor: Kolesterol Tinggi
    faktor.kolesterolTinggi = {
        givenJantung: dataJantung.filter(d => d.kolesterol === "tinggi").length / (dataJantung.length || 1),
        givenNormal: dataNormal.filter(d => d.kolesterol === "tinggi").length / (dataNormal.length || 1)
    };

    // Faktor: Tekanan Darah Tinggi
    faktor.tekananTinggi = {
        givenJantung: dataJantung.filter(d => d.tekanan_darah === "tinggi").length / (dataJantung.length || 1),
        givenNormal: dataNormal.filter(d => d.tekanan_darah === "tinggi").length / (dataNormal.length || 1)
    };

    console.log("Likelihood dari dataset:", faktor);

    return {
        priorJantung,
        priorNormal,
        faktor
    };
}

// ============================================
// 2. FUNGSI BAYESIAN (Original)
// ============================================

/**
 * Menghitung probabilitas posterior menggunakan Teorema Bayes.
 * P(A|B) = [P(B|A) * P(A)] / P(B)
 *
 * @param {number} priorA - Probabilitas awal (prior) kejadian A, P(A).
 * @param {number} likelihoodB_given_A - Probabilitas kejadian B jika A benar, P(B|A).
 * @param {number} likelihoodB_given_notA - Probabilitas kejadian B jika A salah, P(B|not A).
 * @returns {number} Probabilitas posterior kejadian A jika B benar, P(A|B).
 */
function calculateBayesianProbability(priorA, likelihoodB_given_A, likelihoodB_given_notA) {
    // Pastikan probabilitas berada dalam rentang [0, 1]
    if (priorA < 0 || priorA > 1 ||
        likelihoodB_given_A < 0 || likelihoodB_given_A > 1 ||
        likelihoodB_given_notA < 0 || likelihoodB_given_notA > 1) {
        throw new Error("Semua probabilitas harus berada di antara 0 dan 1.");
    }

    const priorNotA = 1 - priorA; // P(not A)

    // Hitung probabilitas bukti P(B)
    // P(B) = P(B|A) * P(A) + P(B|not A) * P(not A)
    const probabilityB = (likelihoodB_given_A * priorA) + (likelihoodB_given_notA * priorNotA);

    // Jika P(B) adalah 0, maka tidak mungkin B terjadi, sehingga P(A|B) juga 0.
    if (probabilityB === 0) {
        return 0;
    }

    // Hitung probabilitas posterior P(A|B)
    const posteriorA_given_B = (likelihoodB_given_A * priorA) / probabilityB;

    return posteriorA_given_B;
}

/**
 * Fungsi 'hitungResiko' untuk menghubungkan input di HTML dengan logika Bayes.
 * Fungsi ini dipanggil ketika tombol "Hitung Risiko" diklik.
 * MENGGUNAKAN DATA DARI DATASET UNTUK MENGHITUNG PROBABILITAS
 */
async function hitungResiko() {
    console.log("Memulai perhitungan risiko...");

    try {
        // 1. Ambil nilai dari input HTML form
        const usia = document.getElementById("usia").value;
        const gender = document.getElementById("gender").value;
        const tekanan = document.getElementById("tekanan").value;
        const kolesterol = document.getElementById("kolesterol").value;

        console.log("Data Input:", { usia, gender, tekanan, kolesterol });

        // 2. Load dataset dan hitung probabilitas
        const dataset = await loadDataset();
        
        if (!dataset || dataset.length === 0) {
            throw new Error("Tidak bisa load dataset");
        }

        const prob = hitungProbabilitasDariDataset(dataset);
        
        if (!prob) {
            throw new Error("Tidak bisa menghitung probabilitas dari dataset");
        }

        // 3. Konversi input ke kategori yang sesuai dengan dataset
        const usiaNum = parseInt(usia);
        let kategoriUsia = "rendah";
        if (usiaNum >= 40 && usiaNum < 60) {
            kategoriUsia = "sedang";
        } else if (usiaNum >= 60) {
            kategoriUsia = "tinggi";
        }

        console.log("Kategori Usia:", kategoriUsia);

        // 4. Hitung likelihood berdasarkan input dan faktor dari dataset
        // Mulai dari likelihood basal dari dataset
        let likelihoodJantung = prob.faktor.umurTinggi.givenJantung;
        let likelihoodNormal = prob.faktor.umurTinggi.givenNormal;

        // Tambahkan faktor kolesterol
        if (kolesterol === "tinggi") {
            likelihoodJantung *= prob.faktor.kolesterolTinggi.givenJantung;
            likelihoodNormal *= prob.faktor.kolesterolTinggi.givenNormal;
        } else {
            // Jika normal, gunakan complement
            likelihoodJantung *= (1 - prob.faktor.kolesterolTinggi.givenJantung);
            likelihoodNormal *= (1 - prob.faktor.kolesterolTinggi.givenNormal);
        }

        // Tambahkan faktor tekanan darah
        if (tekanan === "tinggi") {
            likelihoodJantung *= prob.faktor.tekananTinggi.givenJantung;
            likelihoodNormal *= prob.faktor.tekananTinggi.givenNormal;
        } else {
            likelihoodJantung *= (1 - prob.faktor.tekananTinggi.givenJantung);
            likelihoodNormal *= (1 - prob.faktor.tekananTinggi.givenNormal);
        }

        // Normalisasi likelihood agar tetap dalam range [0, 1]
        const maxLikelihood = Math.max(likelihoodJantung, likelihoodNormal);
        if (maxLikelihood > 1) {
            likelihoodJantung /= maxLikelihood;
            likelihoodNormal /= maxLikelihood;
        }

        console.log("Likelihood Jantung:", likelihoodJantung.toFixed(4));
        console.log("Likelihood Normal:", likelihoodNormal.toFixed(4));

        // 5. Hitung dengan Teorema Bayes
        const risikoPersentase = calculateBayesianProbability(
            prob.priorJantung,
            likelihoodJantung,
            likelihoodNormal
        ) * 100;

        console.log("Hasil Probabilitas:", risikoPersentase.toFixed(2) + "%");

        // 6. Tampilkan hasil
        if (typeof tampilkanHasil === "function") {
            tampilkanHasil(risikoPersentase);
        } else {
            console.error("Fungsi 'tampilkanHasil' tidak ditemukan. Pastikan file result.js sudah dimuat di HTML.");
        }
    } catch (error) {
        alert("Kesalahan: " + error.message);
        console.error(error);
    }
}
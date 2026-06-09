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
 */
function hitungResiko() {
    console.log("Memulai perhitungan risiko...");

    try {
        // 1. Ambil nilai dari input HTML form
        const usia = document.getElementById("usia").value;
        const gender = document.getElementById("gender").value;
        const tekanan = document.getElementById("tekanan").value;
        const kolesterol = document.getElementById("kolesterol").value;

        console.log("Data Input:", { usia, gender, tekanan, kolesterol });

        // 2. Hitung prior probability (probabilitas dasar risiko penyakit jantung)
        // Dasar: penyakit jantung ~ 10% dari populasi
        let priorRisiko = 0.10;

        // Adjust berdasarkan usia
        const usiaNum = parseInt(usia);
        if (usiaNum >= 60) {
            priorRisiko += 0.15; // Lansia lebih berisiko
        } else if (usiaNum >= 40) {
            priorRisiko += 0.05; // Paruh baya sedikit lebih berisiko
        }

        // 3. Hitung likelihood berdasarkan faktor-faktor
        let likelihoodDenganRisiko = 0.6; // P(gejala | sakit)
        
        // Tambah likelihood jika ada tekanan darah tinggi
        if (tekanan === "tinggi") {
            likelihoodDenganRisiko += 0.15;
        }

        // Tambah likelihood jika ada kolesterol tinggi
        if (kolesterol === "tinggi") {
            likelihoodDenganRisiko += 0.10;
        }

        // Kurangi likelihood jika wanita (usia reproduktif)
        if (gender === "P" && usiaNum < 50) {
            likelihoodDenganRisiko -= 0.10;
        }

        // Likelihood tanpa risiko (P(gejala | tidak sakit))
        const likelihoodTanpaRisiko = 0.15;

        // 4. Hitung dengan Teorema Bayes
        const risikoPersentase = calculateBayesianProbability(
            priorRisiko,
            likelihoodDenganRisiko,
            likelihoodTanpaRisiko
        ) * 100;

        console.log("Hasil Probabilitas:", risikoPersentase.toFixed(2) + "%");

        // 5. Tampilkan hasil
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
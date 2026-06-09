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

// --- Contoh Penggunaan untuk Risiko Jantung ---
// Misalkan:
// A = "Seseorang memiliki penyakit jantung"
// B = "Seseorang memiliki gejala tertentu (misalnya, nyeri dada, kolesterol tinggi)"

const priorHeartDisease = 0.10; // P(Penyakit Jantung) = 10% dari populasi memiliki penyakit jantung (probabilitas awal)
const likelihoodSymptom_given_HeartDisease = 0.80; // P(Gejala | Penyakit Jantung) = 80% orang dengan penyakit jantung memiliki gejala
const likelihoodSymptom_given_notHeartDisease = 0.20; // P(Gejala | Bukan Penyakit Jantung) = 20% orang tanpa penyakit jantung juga memiliki gejala

const posteriorHeartDisease = calculateBayesianProbability(priorHeartDisease, likelihoodSymptom_given_HeartDisease, likelihoodSymptom_given_notHeartDisease);

console.log(`Probabilitas seseorang memiliki penyakit jantung JIKA mereka memiliki gejala: ${posteriorHeartDisease.toFixed(4)}`);
console.log(`Ini berarti ada sekitar ${ (posteriorHeartDisease * 100).toFixed(2) }% kemungkinan orang tersebut memiliki penyakit jantung jika mereka menunjukkan gejala.`);
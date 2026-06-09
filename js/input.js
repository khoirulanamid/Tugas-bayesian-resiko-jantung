// js/input.js

function getInputData() {
    const umur = document.getElementById("umur").value;
    const tekananDarah = document.getElementById("tekananDarah").value;
    const kolesterol = document.getElementById("kolesterol").value;
    const gulaDarah = document.getElementById("gulaDarah").value;
    const merokok = document.getElementById("merokok").value;
    const olahraga = document.getElementById("olahraga").value;

    // Validasi input
    if (
        umur === "" ||
        tekananDarah === "" ||
        kolesterol === "" ||
        gulaDarah === "" ||
        merokok === "" ||
        olahraga === ""
    ) {
        alert("Semua data harus diisi!");
        return null;
    }

    // Mengubah umur menjadi kategori
    let kategoriUmur;

    if (umur < 40) {
        kategoriUmur = "Muda";
    } else if (umur < 60) {
        kategoriUmur = "ParuhBaya";
    } else {
        kategoriUmur = "Lansia";
    }

    return {
        umur: kategoriUmur,
        tekananDarah: tekananDarah,
        kolesterol: kolesterol,
        gulaDarah: gulaDarah,
        merokok: merokok,
        olahraga: olahraga
    };
}

// Event tombol prediksi
document.getElementById("btnPrediksi").addEventListener("click", function () {

    const dataPasien = getInputData();

    if (dataPasien) {
        console.log("Data Input:", dataPasien);

        // Kirim ke bayes.js
        hitungBayes(dataPasien);
    }

});
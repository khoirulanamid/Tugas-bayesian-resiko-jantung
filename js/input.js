// js/input.js

function getInputData() {
    const usia = document.getElementById("usia").value;
    const gender = document.getElementById("gender").value;
    const tekanan = document.getElementById("tekanan").value;
    const kolesterol = document.getElementById("kolesterol").value;

    // Validasi input
    if (
        usia === "" ||
        gender === "" ||
        tekanan === "" ||
        kolesterol === ""
    ) {
        alert("Semua data harus diisi!");
        return null;
    }

    // Mengubah usia menjadi kategori
    let kategoriUsia;

    if (parseInt(usia) < 40) {
        kategoriUsia = "Muda";
    } else if (parseInt(usia) < 60) {
        kategoriUsia = "ParuhBaya";
    } else {
        kategoriUsia = "Lansia";
    }

    return {
        usia: kategoriUsia,
        gender: gender,
        tekanan: tekanan,
        kolesterol: kolesterol
    };
}

// Event tombol hitung
document.getElementById("btnHitung").addEventListener("click", function () {

    const dataPasien = getInputData();

    if (dataPasien) {
        console.log("Data Input:", dataPasien);

        // Hitung risiko dengan Bayes
        hitungResiko();
    }

});
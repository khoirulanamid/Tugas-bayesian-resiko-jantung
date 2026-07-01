// js/input.js

function tampilkanError(pesan) {
    let errorBox = document.getElementById("error-message");
    if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.id = "error-message";
        errorBox.className = "error-alert";
        const form = document.getElementById("heartForm");
        form.parentNode.insertBefore(errorBox, form);
    }
    errorBox.textContent = pesan;
    errorBox.style.display = 'block';
}

function sembunyikanError() {
    const errorBox = document.getElementById("error-message");
    if (errorBox) {
        errorBox.style.display = 'none';
    }
}

function getInputData() {
    sembunyikanError();
    const usia = document.getElementById("usia").value;
    const gender = document.getElementById("gender").value;
    const tekanan = document.getElementById("tekanan").value;
    const kolesterol = document.getElementById("kolesterol").value;
    const gulaDarah = document.getElementById("gula_darah").value;
    const riwayat = document.getElementById("riwayat").value;

    // Validasi input
    if (!usia || !gender || !tekanan || !kolesterol || !gulaDarah || !riwayat) {
        tampilkanError("Mohon lengkapi semua parameter medis (6 field) terlebih dahulu!");
        return null;
    }

    if (usia <= 0 || usia > 120) {
        tampilkanError("Masukkan usia yang valid (1 - 120 tahun).");
        return null;
    }

    // Mengubah usia menjadi kategori
    let kategoriUsia;
    const umurInt = parseInt(usia);
    if (umurInt < 40) {
        kategoriUsia = "rendah";
    } else if (umurInt <= 60) {
        kategoriUsia = "sedang";
    } else {
        kategoriUsia = "tinggi";
    }

    return {
        usia: kategoriUsia,
        gender: gender,
        tekanan: tekanan,
        kolesterol: kolesterol,
        gula_darah: gulaDarah,
        riwayat: riwayat,
        usiaAsli: umurInt
    };
}

// Event tombol hitung
document.addEventListener('DOMContentLoaded', () => {
    const btnHitung = document.getElementById("btnHitung");
    if(btnHitung) {
        btnHitung.addEventListener("click", function () {
            const hasilContainer = document.getElementById("hasil");
            if(hasilContainer) hasilContainer.innerHTML = '';
            hitungResiko();
        });
    }
});

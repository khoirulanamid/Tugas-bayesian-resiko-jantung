// Menampilkan hasil prediksi risiko jantung (versi lebih rapi)

function tampilkanHasil(probabilitas) {

  const hasilContainer = document.getElementById("hasil");

  let kategori = "";
  let warna = "";
  let emoji = "";

  // Menentukan kategori risiko
  if (probabilitas < 40) {
    kategori = "Rendah";
    warna = "green";
    emoji = "🟢";
  } 
  else if (probabilitas < 70) {
    kategori = "Sedang";
    warna = "orange";
    emoji = "🟠";
  } 
  else {
    kategori = "Tinggi";
    warna = "red";
    emoji = "🔴";
  }

  // Tampilan hasil
  hasilContainer.innerHTML = `
    <div style="
      padding: 20px;
      margin-top: 20px;
      border-radius: 12px;
      background-color: #f5f5f5;
      border-left: 8px solid ${warna};
      font-family: Arial, sans-serif;
    ">
      <h2>${emoji} Hasil Prediksi Risiko Jantung</h2>
      
      <p style="font-size: 18px;">
        <b>Probabilitas:</b> ${probabilitas.toFixed(2)}%
      </p>

      <p style="font-size: 18px;">
        <b>Kategori:</b> 
        <span style="color:${warna}; font-weight:bold;">
          ${kategori}
        </span>
      </p>

      <hr>

      <p style="font-size: 14px; color: gray;">
        Sistem ini menggunakan metode Bayesian untuk memprediksi risiko berdasarkan data input pasien.
      </p>
    </div>
  `;
}
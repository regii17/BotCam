const fetch = require('node-fetch');
const NodeWebcam = require("node-webcam"); // Untuk menangkap gambar dari kamera
const fs = require("fs"); // Untuk membaca file

const sendMessageToTelegram = async (message, photoPath = null) => {
  const apiToken = "7537995896:AAGg4hCRAellVFqQHZml6qIZSBTEUs4WXQg"; // Ganti dengan token bot Anda
  const chatId = "7353825005"; // Ganti dengan chat ID Anda
  const messageUrl = `https://api.telegram.org/bot${apiToken}/sendMessage`;
  const photoUrl = `https://api.telegram.org/bot${apiToken}/sendPhoto`;

  try {
    // Kirim pesan teks
    const messageResponse = await fetch(messageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!messageResponse.ok) {
      console.error("Gagal mengirim pesan:", await messageResponse.text());
    } else {
      console.log("Pesan berhasil dikirim!");
    }

    // Jika ada foto, kirim juga
    if (photoPath) {
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("photo", fs.createReadStream(photoPath));

      const photoResponse = await fetch(photoUrl, {
        method: "POST",
        body: formData,
      });

      if (!photoResponse.ok) {
        console.error("Gagal mengirim foto:", await photoResponse.text());
      } else {
        console.log("Foto berhasil dikirim!");
      }
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};

// Ambil tangkapan kamera
const capturePhoto = (callback) => {
  const webcamOptions = {
    width: 1280,
    height: 720,
    quality: 100,
    output: "jpeg",
    callbackReturn: "location",
    verbose: true,
    device: false,
    saveShots: true,
    binding: "ffmpeg",
  };


  NodeWebcam.capture("capture", webcamOptions, (err, photoPath) => {
    if (err) {
      console.error("Gagal mengambil gambar:", err);
      callback(null);
    } else {
      console.log("Gambar berhasil diambil:", photoPath);
      callback(photoPath);
    }
  });
};

// Fungsi utama
const main = async () => {
  // Contoh: Mendapatkan lokasi (manual atau dari GPS)
  const latitude = -7.797068; // Ganti dengan koordinat lokasi Anda
  const longitude = 110.370529; // Ganti dengan koordinat lokasi Anda
  const locationMessage = `Lokasi saat ini: https://www.google.com/maps?q=${latitude},${longitude}`;

  // Tangkap foto dan kirim pesan
  capturePhoto((photoPath) => {
    if (photoPath) {
      sendMessageToTelegram(locationMessage, photoPath);
    } else {
      sendMessageToTelegram(locationMessage);
    }
  });
};

// Jalankan program
main();

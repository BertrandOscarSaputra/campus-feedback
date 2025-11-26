import { useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function FeedbackForm() {
  const [nama, setNama] = useState("");
  const [fakultas, setFakultas] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [kategori, setKategori] = useState("");
  const [umpanBalik, setUmpanBalik] = useState("");
  const [solusi, setSolusi] = useState("");
  const [buktiBase64, setBuktiBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // REF untuk file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ===============================
  // HANDLE FILE UPLOAD
  // ===============================
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "application/pdf"].includes(file.type)) {
      alert("File harus JPG, PNG, atau PDF");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran file maksimum 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setBuktiBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ===============================
  // SUBMIT FEEDBACK
  // ===============================
  const submit = async () => {
    if (!nama || !kategori || !umpanBalik.trim()) {
      alert("Isi minimal Nama, Kategori, dan Umpan Balik");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "feedback"), {
        nama,
        fakultas,
        nim,
        email,
        hp,
        kategori,
        umpanBalik,
        solusi,
        bukti: buktiBase64,
        createdAt: serverTimestamp(),
        deviceId: uuidv4(),
      });

      alert("Terima kasih! Umpan balik terkirim.");

      // RESET STATE
      setNama("");
      setFakultas("");
      setNim("");
      setEmail("");
      setHp("");
      setKategori("");
      setUmpanBalik("");
      setSolusi("");
      setBuktiBase64(null);

      // RESET FILE INPUT
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("Submit gagal, cek rules Firestore.");
    }

    setLoading(false);
  };

  // ===============================
  // UI FORM
  // ===============================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl border">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Form Umpan Balik Kampus
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />

            <select
              className="input"
              value={fakultas}
              onChange={(e) => setFakultas(e.target.value)}
            >
              <option value="">Pilih Fakultas</option>
              <option value="Fakultas Filsafat">Fakultas Filsafat</option>
              <option value="Fakultas Keguruan dan Ilmu Pendidikan">
                Fakultas Keguruan dan Ilmu Pendidikan
              </option>
              <option value="Fakultas Ekonomi & Bisnis">
                Fakultas Ekonomi & Bisnis
              </option>
              <option value="Fakultas Ilmu Komputer">
                Fakultas Ilmu Komputer
              </option>
              <option value="Fakultas Pertanian">Fakultas Pertanian</option>
              <option value="Fakultas Keperawatan">Fakultas Keperawatan</option>
              <option value="Fakultas Arsitektur">Fakultas Arsitektur</option>
            </select>

            <input
              className="input"
              placeholder="NIM"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
            />

            <input
              className="input"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input"
              placeholder="No. HP"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />

            <select
              className="input"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              <option value="">Pilih kategori</option>
              <option value="fasilitas">Fasilitas</option>
              <option value="dosen">Dosen</option>
              <option value="administrasi">Administrasi</option>
              <option value="keamanan">Keamanan</option>
              <option value="cafetaria">Cafetaria</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="label">Uraian Umpan Balik *</label>
            <textarea
              className="textarea"
              placeholder="Tuliskan masalah atau keluhan..."
              value={umpanBalik}
              onChange={(e) => setUmpanBalik(e.target.value)}
            />
          </div>

          <div className="mt-3">
            <label className="label">Usulan Solusi (opsional)</label>
            <textarea
              className="textarea"
              placeholder="Tuliskan solusi yang Anda usulkan..."
              value={solusi}
              onChange={(e) => setSolusi(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <p className="label">Unggah Bukti (JPG/PNG/PDF, max 8MB)</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              className="
                mt-2 block w-full text-sm text-gray-700 
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700 cursor-pointer
              "
            />

            {buktiBase64 && (
              <p className="text-green-600 text-sm mt-1">
                File berhasil diupload ✓
              </p>
            )}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 rounded-lg text-lg font-medium transition"
          >
            {loading ? "Mengirim..." : "Kirim Umpan Balik"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

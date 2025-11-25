import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

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

  // -------- Convert file → Base64 ----------
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "application/pdf"].includes(file.type)) {
      alert("File harus JPG, PNG, atau PDF");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Ukuran file maks 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setBuktiBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!nama || !kategori || !umpanBalik.trim()) {
      alert("Isi minimal nama, kategori, dan umpan balik");
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
        bukti: buktiBase64, // Base64 disimpan di Firestore
        createdAt: serverTimestamp(),
        deviceId: uuidv4(),
      });

      alert("Terima kasih — umpan balik terkirim!");

      // reset form
      setNama("");
      setFakultas("");
      setNim("");
      setEmail("");
      setHp("");
      setKategori("");
      setUmpanBalik("");
      setSolusi("");
      setBuktiBase64(null);
    } catch (err) {
      console.error(err);
      alert("Submit gagal, cek rules Firestore");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3">
      <h2 className="text-xl font-bold mb-2">Form Umpan Balik Kampus</h2>

      <input
        placeholder="Nama Lengkap"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        placeholder="Fakultas"
        value={fakultas}
        onChange={(e) => setFakultas(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        placeholder="NIM"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        placeholder="No. HP"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="border p-2 w-full"
      />

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Pilih kategori</option>
        <option value="fasilitas">Fasilitas</option>
        <option value="dosen">Dosen</option>
        <option value="administrasi">Administrasi</option>
        <option value="keamanan">Keamanan</option>
        <option value="lainnya">Lainnya</option>
      </select>

      <textarea
        placeholder="Uraian Umpan Balik"
        value={umpanBalik}
        onChange={(e) => setUmpanBalik(e.target.value)}
        className="border p-2 w-full h-24"
      />

      <textarea
        placeholder="Usulan Solusi (opsional)"
        value={solusi}
        onChange={(e) => setSolusi(e.target.value)}
        className="border p-2 w-full h-20"
      />

      <div>
        <label className="font-semibold">
          Unggah Bukti (PDF/JPG/PNG, maks 8MB)
        </label>
        <input type="file" onChange={handleFile} className="mt-1" />
        {buktiBase64 && (
          <p className="text-green-600 text-sm mt-1">
            File berhasil diupload ✓
          </p>
        )}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 text-white p-2 w-full rounded"
      >
        {loading ? "Mengirim..." : "Kirim Umpan Balik"}
      </button>
    </div>
  );
}

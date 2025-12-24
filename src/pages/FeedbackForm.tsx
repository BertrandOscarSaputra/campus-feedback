import { useState } from "react";
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("File harus JPG atau PNG");
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
      alert("Submit gagal, cek rules Firestore.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* HEADER */}
      <Header />

      {/* CONTENT */}
      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-3xl border border-blue-100/60 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200 rounded-full opacity-40 blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-200 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute top-20 -right-5 w-16 h-16 bg-sky-200 rounded-full opacity-30 blur-lg"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 
  bg-gradient-to-r from-blue-400 to-cyan-500 
  rounded-full flex items-center justify-center 
  mx-auto mb-4 shadow-lg 
  animate-[floatPulse_4s_ease-in-out_infinite]
  transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
              >
                <svg
                  className="w-8 h-8 text-white animate-[float_3s_ease-in-out_infinite]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Form Umpan Balik Kampus
              </h2>
              <p className="text-gray-600 text-sm">
                Suara Anda membantu kami menjadi lebih baik
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nama Lengkap *
                </label>
                <input
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-900"
                  placeholder="Masukkan nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Fakultas *
                </label>
                <select
                  className="w-full cursor-pointer px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900"
                  value={fakultas}
                  onChange={(e) => setFakultas(e.target.value)}
                >
                  <option value="" className="text-gray-400">
                    Pilih Fakultas
                  </option>
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
                  <option value="Fakultas Keperawatan">
                    Fakultas Keperawatan
                  </option>
                  <option value="Fakultas Arsitektur">
                    Fakultas Arsitektur
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  NIM *
                </label>
                <input
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-900"
                  placeholder="Nomor Induk Mahasiswa"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  E-mail *
                </label>
                <input
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-900"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  No. HP
                </label>
                <input
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-900"
                  placeholder="08xxxxxxxxxx"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Kategori *
                </label>
                <select
                  className="w-full cursor-pointer px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                >
                  <option value="" className="text-gray-400">
                    Pilih kategori
                  </option>
                  <option value="fasilitas">Fasilitas</option>
                  <option value="dosen">Dosen</option>
                  <option value="administrasi">Administrasi</option>
                  <option value="keamanan">Keamanan</option>
                  <option value="cafetaria">Cafetaria</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Uraian Umpan Balik *
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-900 resize-vertical min-h-[120px]"
                  placeholder="Tuliskan masalah atau keluhan yang ingin Anda sampaikan..."
                  rows={4}
                  value={umpanBalik}
                  onChange={(e) => setUmpanBalik(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Usulan Solusi
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white/80 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-gray-900 resize-vertical min-h-[100px]"
                  placeholder="Bagaimana menurut Anda solusi yang tepat untuk masalah ini?"
                  rows={3}
                  value={solusi}
                  onChange={(e) => setSolusi(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Unggah Bukti (JPG/PNG, max 8MB)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={handleFile}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center px-6 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:border-blue-400 text-blue-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Pilih File
                  </label>
                  {buktiBase64 && (
                    <div className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      File berhasil diupload
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 cursor-pointer hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Kirim Umpan Balik
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              * Menandakan field yang wajib diisi
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

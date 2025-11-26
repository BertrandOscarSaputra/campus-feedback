import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/Modal";

interface Feedback {
  id: string;
  nama: string;
  fakultas: string;
  nim: string;
  email: string;
  hp: string;
  kategori: string;
  umpanBalik: string;
  solusi: string;
  bukti?: string | null;
  createdAt?: any;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [filterKategori, setFilterKategori] = useState("");
  const [filterFakultas, setFilterFakultas] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setItems(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const yes = confirm("Yakin ingin menghapus feedback ini?");
    if (!yes) return;
    await deleteDoc(doc(db, "feedback", id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDateTime = (ts: any) => {
    if (!ts) return "-";
    const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    load();
  }, []);

  const displayedItems = items
    .filter(
      (fb) =>
        (filterKategori ? fb.kategori === filterKategori : true) &&
        (filterFakultas ? fb.fakultas === filterFakultas : true)
    )
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const tA =
        a.createdAt instanceof Timestamp
          ? a.createdAt.toMillis()
          : new Date(a.createdAt).getTime();
      const tB =
        b.createdAt instanceof Timestamp
          ? b.createdAt.toMillis()
          : new Date(b.createdAt).getTime();
      return sortAsc ? tA - tB : tB - tA;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Kelola feedback dari mahasiswa dengan mudah
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={load}
                className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* FILTER & SORT SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter & Sortir
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Kategori */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Feedback
              </label>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Semua Kategori</option>
                <option value="fasilitas">Fasilitas</option>
                <option value="dosen">Dosen</option>
                <option value="administrasi">Administrasi</option>
                <option value="keamanan">Keamanan</option>
                <option value="cafetaria">Cafetaria</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            {/* Filter Fakultas */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fakultas
              </label>
              <select
                value={filterFakultas}
                onChange={(e) => setFilterFakultas(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Semua Fakultas</option>
                <option value="Fakultas Filsafat">Fakultas Filsafat</option>
                <option value="Fakultas Keguruan dan Ilmu Pendidikan">
                  FKIP
                </option>
                <option value="Fakultas Ekonomi & Bisnis">FEB</option>
                <option value="Fakultas Ilmu Komputer">FIKOM</option>
                <option value="Fakultas Pertanian">FAPERTA</option>
                <option value="Fakultas Keperawatan">FKep</option>
                <option value="Fakultas Arsitektur">Farsitek</option>
              </select>
            </div>

            {/* Sort Button */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutkan Tanggal
              </label>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm border ${
                  sortAsc
                    ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                }`}
              >
                {sortAsc ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                      />
                    </svg>
                    Terlama - Terbaru
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                    Terbaru - Terlama
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {items.length}
              </div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {items.filter((item) => item.kategori === "fasilitas").length}
              </div>
              <div className="text-sm text-gray-600">Feedback Fasilitas</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {items.filter((item) => item.kategori === "dosen").length}
              </div>
              <div className="text-sm text-gray-600">Feedback Dosen</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {displayedItems.length}
              </div>
              <div className="text-sm text-gray-600">Tampil</div>
            </div>
          </div>
        )}

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Tidak ada feedback
              </h3>
              <p className="mt-1 text-gray-500">
                {items.length === 0
                  ? "Belum ada feedback yang diterima"
                  : "Coba ubah filter untuk melihat hasil"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <tr>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Nama
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Email
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Fakultas
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Kategori
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Tanggal
                    </th>
                    <th className="py-4 px-6 text-center text-white font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedItems.map((fb, index) => (
                    <tr
                      key={fb.id}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {fb.nama}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{fb.email}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {fb.fakultas}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                          {fb.kategori}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-sm">
                        {formatDateTime(fb.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setSelected(fb)}
                            className="flex items-center gap-1 cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Detail
                          </button>
                          <button
                            onClick={() => handleDelete(fb.id)}
                            className="flex items-center cursor-pointer gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Detail */}
        {selected && (
          <Modal onClose={() => setSelected(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selected.nama}
                  </h2>
                  <p className="text-gray-600 mt-1">{selected.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selected.fakultas}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      NIM: {selected.nim}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {selected.hp}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Umpan Balik:
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selected.umpanBalik}
                    </p>
                  </div>
                </div>

                {selected.solusi && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Usulan Solusi:
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selected.solusi}
                      </p>
                    </div>
                  </div>
                )}

                {selected.bukti && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Bukti:</h3>
                    {selected.bukti.startsWith("data:image") ? (
                      <div className="flex flex-col items-start">
                        <img
                          src={selected.bukti}
                          className="max-w-full rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => setZoomedImage(selected.bukti!)}
                        />
                        <button
                          onClick={() => setZoomedImage(selected.bukti!)}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Klik untuk memperbesar
                        </button>
                      </div>
                    ) : (
                      <a
                        href={selected.bukti}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Lihat File PDF
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Zoom Gambar */}
        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4 cursor-zoom-out"
            onClick={() => setZoomedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={zoomedImage}
                className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

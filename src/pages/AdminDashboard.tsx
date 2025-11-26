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
import Modal from "../components/Modal"; // Modal sederhana

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
  const [selected, setSelected] = useState<Feedback | null>(null); // modal detail
  const [zoomedImage, setZoomedImage] = useState<string | null>(null); // modal zoom gambar

  // =============================
  // Sort / Filter State
  // =============================
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

  // =============================
  // Filtered & Sorted Items
  // =============================
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
    <div className="max-w-6xl mx-auto p-5">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer shadow"
          >
            Refresh
          </button>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* FILTER & SORT */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Filter Kategori */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Kategori</span>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="border rounded-lg px-3 py-2 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Fakultas</span>
          <select
            value={filterFakultas}
            onChange={(e) => setFilterFakultas(e.target.value)}
            className="border rounded-lg px-3 py-2 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Semua Fakultas</option>
            <option value="Fakultas Filsafat">Fakultas Filsafat</option>
            <option value="Fakultas Keguruan dan Ilmu Pendidikan">FKIP</option>
            <option value="Fakultas Ekonomi & Bisnis">FEB</option>
            <option value="Fakultas Ilmu Komputer">FIKOM</option>
            <option value="Fakultas Pertanian">FAPERTA</option>
            <option value="Fakultas Keperawatan">FKep</option>
            <option value="Fakultas Arsitektur">Farsitek</option>
          </select>
        </div>

        {/* Sort Tombol */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Urut Tanggal</span>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className={`px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2
        ${
          sortAsc
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        }`}
          >
            {sortAsc ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
            {sortAsc ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : displayedItems.length === 0 ? (
        <p className="text-center text-gray-600">Tidak ada feedback.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Nama</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Fakultas</th>
                <th className="py-2 px-4 border">Kategori</th>
                <th className="py-2 px-4 border">Tanggal</th>
                <th className="py-2 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.map((fb) => (
                <tr key={fb.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{fb.nama}</td>
                  <td className="py-2 px-4 border">{fb.email}</td>
                  <td className="py-2 px-4 border">{fb.fakultas}</td>
                  <td className="py-2 px-4 border">{fb.kategori}</td>
                  <td className="py-2 px-4 border">
                    {formatDateTime(fb.createdAt)}
                  </td>
                  <td className="py-2 px-4 border flex gap-2">
                    <button
                      onClick={() => setSelected(fb)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 cursor-pointer rounded"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleDelete(fb.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 cursor-pointer rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <h2 className="text-xl font-bold mb-2">{selected.nama}</h2>
          <p className="text-sm text-gray-600 mb-1">{selected.email}</p>
          <p className="text-sm text-gray-600 mb-3">
            {selected.fakultas} | {selected.nim} | {selected.hp}
          </p>

          <div className="mb-3">
            <p className="font-semibold mb-1">Umpan Balik:</p>
            <p className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selected.umpanBalik}
            </p>
          </div>

          {selected.solusi && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Usulan Solusi:</p>
              <p className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selected.solusi}
              </p>
            </div>
          )}

          {selected.bukti && (
            <div className="mb-3">
              <p className="font-semibold mb-1">Bukti:</p>
              {selected.bukti.startsWith("data:image") ? (
                <img
                  src={selected.bukti}
                  className="max-w-xs rounded-md border shadow-sm cursor-pointer hover:scale-105 transition"
                  onClick={() => setZoomedImage(selected.bukti!)}
                />
              ) : (
                <a
                  href={selected.bukti}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Lihat File PDF
                </a>
              )}
            </div>
          )}

          <div className="text-right">
            <button
              onClick={() => setSelected(null)}
              className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white px-4 py-2 rounded"
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Zoom Gambar */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            className="max-h-[90vh] max-w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

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
    const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts); // support Timestamp or string
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

  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
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

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-600">Tidak ada feedback.</p>
      ) : (
        <div className="space-y-6">
          {items.map((fb) => (
            <div
              key={fb.id}
              className="p-5 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex justify-between">
                <h2 className="text-xl font-bold text-gray-900">{fb.nama}</h2>
                <button
                  onClick={() => handleDelete(fb.id)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white cursor-pointer px-3 py-1 rounded-md"
                >
                  Hapus
                </button>
              </div>

              <p className="text-gray-600 mt-1">{fb.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                <span className="font-semibold">Tanggal:</span>{" "}
                {formatDateTime(fb.createdAt)}
              </p>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Kategori:</span> {fb.kategori}
                </p>
                <p>
                  <span className="font-semibold">NIM:</span> {fb.nim}
                </p>
                <p>
                  <span className="font-semibold">Fakultas:</span> {fb.fakultas}
                </p>
                <p>
                  <span className="font-semibold">HP:</span> {fb.hp}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold mb-1">Umpan Balik:</p>
                <p className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap">
                  {fb.umpanBalik}
                </p>
              </div>

              {fb.solusi && (
                <div className="mt-4">
                  <p className="font-semibold mb-1">Usulan Solusi:</p>
                  <p className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap">
                    {fb.solusi}
                  </p>
                </div>
              )}

              {fb.bukti && (
                <div className="mt-4">
                  <p className="font-semibold mb-1">Bukti:</p>
                  {fb.bukti.startsWith("data:image") ? (
                    <img
                      src={fb.bukti}
                      className="max-w-xs rounded-md border shadow-sm"
                    />
                  ) : (
                    <a
                      href={fb.bukti}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Lihat File PDF
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

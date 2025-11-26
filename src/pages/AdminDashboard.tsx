import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
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
}

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const yes = confirm("Yakin ingin menghapus feedback ini?");
    if (!yes) return;

    await deleteDoc(doc(db, "feedback", id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
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
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Hapus
                </button>
              </div>

              <p className="text-gray-600 mt-1">{fb.email}</p>

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

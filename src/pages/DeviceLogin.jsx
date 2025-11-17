import { useState } from "react";
import { useHistory } from "react-router-dom";
import { fetchDeviceData } from "../api/api";

export default function DeviceLogin() {
  const [idPerangkat, setIdPerangkat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchDeviceData(idPerangkat.trim());
      history.push(`/dashboard/${idPerangkat}`, { data });
    } catch (err) {
      setModalMsg(err.message || "Terjadi kesalahan.");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          Masukkan ID Perangkat
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={idPerangkat}
            onChange={(e) => setIdPerangkat(e.target.value)}
            placeholder="Contoh: TONGKAT001"
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition"
          >
            Masuk
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-6">
          Pastikan ID perangkat Anda sudah terdaftar di sistem.
        </p>
      </div>

      {/* Modal Alert */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl p-6 animate-scaleUp text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              ⚠️ ID Tidak Ditemukan
            </h3>
            <p className="text-gray-700 text-sm mb-4">{modalMsg}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

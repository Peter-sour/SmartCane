import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// PENTING: Ganti dengan IP Address lokal dan port backend Anda
const apiClient = axios.create({
  baseURL: 'https://iot-backend-production-3ee9.up.railway.app/api', // <-- GANTI DENGAN IP LOKAL & PORT BACKEND ANDA
});

function Test() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await apiClient.get('/data?limit=100');
      setDataList(response.data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Tidak bisa terhubung ke server. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const getActivityInfo = (activity) => {
    switch (activity) {
      case 'DIAM': return { icon: '🧘', color: 'text-blue-600' };
      case 'JALAN': return { icon: '🚶‍♂️', color: 'text-green-600' };
      case 'LARI': return { icon: '🏃‍♂️', color: 'text-orange-600' };
      case 'JATUH': return { icon: '💥', color: 'text-red-600 font-bold' };
      case 'BERPUTAR': return { icon: '🔄', color: 'text-purple-600' };
      case 'GOYANG': return { icon: '👋', color: 'text-yellow-600' };
      default: return { icon: '❔', color: 'text-gray-500' };
    }
  };

  const chartData = [...dataList].reverse();

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard Tongkat Pintar</h1>
          <p className="text-gray-500 mt-1">Menampilkan semua data sensor secara realtime</p>
        </header>

        {loading && <p className="text-center text-gray-600">Memuat data awal...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

        {!loading && !error && (
          <main className="flex flex-col gap-8">

            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tabel Data Realtime</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* -- FIX: Tambahkan max-h-[...] dan overflow-y-auto di sini -- */}
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                  <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th scope="col" className="px-4 py-3">Waktu</th>
                        <th scope="col" className="px-4 py-3">Aktivitas</th>
                        <th scope="col" className="px-4 py-3">Jarak (cm)</th>
                        <th scope="col" className="px-4 py-3">Baterai (%)</th>
                        <th scope="col" className="px-4 py-3">Tegangan (V)</th>
                        <th scope="col" className="px-4 py-3">Sinyal (dBm)</th>
                        <th scope="col" className="px-4 py-3">Aksel (m/s²)</th>
                        <th scope="col" className="px-4 py-3">Gyro (rad/s)</th>
                        <th scope="col" className="px-4 py-3">Akurasi Jarak</th>
                        <th scope="col" className="px-4 py-3">Akurasi Aksel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center p-8 text-gray-500">
                            Belum ada data...
                          </td>
                        </tr>
                      ) : (
                        dataList.map((data) => {
                          const { icon, color } = getActivityInfo(data.aktivitas);
                          return (
                            <tr
                              key={data._id}
                              className={`border-b hover:bg-gray-50 transition-colors duration-150 ${data.aktivitas === 'JATUH' ? 'bg-red-100' : 'bg-white'}`}
                            >
                              <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                                {new Date(data.createdAt).toLocaleTimeString('id-ID')}
                              </td>
                              <td className={`px-4 py-3 font-medium ${color} whitespace-nowrap`}>
                                <span className="mr-2">{icon}</span>
                                {data.aktivitas}
                              </td>
                              <td className="px-4 py-3">
                                {data.jarak_cm > 0 ? data.jarak_cm.toFixed(1) : 'N/A'}
                              </td>
                              <td className="px-4 py-3">{data.persen_baterai}</td>
                              <td className="px-4 py-3">{data.tegangan_baterai.toFixed(2)}</td>
                              <td className="px-4 py-3">{data.kekuatan_sinyal}</td>
                              <td className="px-4 py-3">{data.magnitudo_aksel.toFixed(2)}</td>
                              <td className="px-4 py-3">{data.magnitudo_gyro.toFixed(2)}</td>
                              <td className="px-4 py-3">{data.akurasi_jarak.toFixed(1)}%</td>
                              <td className="px-4 py-3">{data.akurasi_aksel.toFixed(1)}%</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="w-full">
               <h2 className="text-2xl font-semibold mb-4 text-gray-700">Grafik Sensor</h2>
               <div className="bg-white rounded-lg shadow-md p-4 h-[60vh]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="createdAt"
                        tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'})}
                        angle={-30}
                        textAnchor="end"
                        height={50}
                        tick={{ fill: '#6b7280' }}
                      />
                      <YAxis yAxisId="left" stroke="#8884d8" tick={{ fill: '#8884d8' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#e67e22" tick={{ fill: '#e67e22' }} />
                      <Tooltip
                        labelFormatter={(label) => new Date(label).toLocaleString('id-ID')}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="jarak_cm"
                        name="Jarak (cm)"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                      />
                       <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="magnitudo_aksel"
                        name="Magnitudo Akselerasi (m/s²)"
                        stroke="#e67e22"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                 </ResponsiveContainer>
               </div>
            </div>

          </main>
        )}
      </div>
    </div>
  );
}

export default Test;
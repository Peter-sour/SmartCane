export async function fetchDeviceData(id_perangkat) {
  const res = await fetch(`http://localhost:5000/api/data/${id_perangkat}`);
  if (!res.ok) throw new Error("ID perangkat tidak ditemukan atau belum terdaftar");
  return await res.json();
}
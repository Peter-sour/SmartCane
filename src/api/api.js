export async function fetchDeviceData(id_perangkat) {
  const res = await fetch(`https://mollusklike-intactly-kennedi.ngrok-free.dev/api/data/${id_perangkat}`);
  if (!res.ok) throw new Error("ID perangkat tidak ditemukan atau belum terdaftar");
  return await res.json();
}
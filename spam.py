# spam_debug_loop.py
import pyautogui
import time
import sys

# Safety
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.1

def main():
    try:
        print("Script mulai. Kamu punya 8 detik untuk membuka/menfokuskan WhatsApp Web dan memilih chat.")
        time.sleep(8)  # beri waktu untuk fokus ke browser/WA Web

        for i in range(1, 101):  # loop 100 kali
            # Debug: tunjukkan posisi mouse saat ini (bila perlu)
            x, y = pyautogui.position()
            print(f"[{i}/100] Posisi mouse saat ini: x={x}, y={y}")
            print(f"[{i}/100] Mengetik pesan: 'Halo' ...")
            
            pyautogui.write('Mas Sayang Adek', interval=0.02)
            time.sleep(0.15)
            pyautogui.press('enter')
            print(f"[{i}/100] Pesan dikirim.")

            # Tambahan delay kecil supaya tidak terlalu cepat
            time.sleep(0.5)

        print("Loop selesai. 100 pesan telah dikirim (seharusnya).")

    except pyautogui.FailSafeException:
        print("FailSafe: mouse dipindahkan ke pojok kiri atas. Script dihentikan.")
        sys.exit(1)
    except Exception as e:
        print("Terjadi error:", repr(e))
        sys.exit(1)

if __name__ == "__main__":
    main()

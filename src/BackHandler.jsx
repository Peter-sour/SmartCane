import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useHistory } from 'react-router-dom';

export default function BackHandler() {
  const history = useHistory();

  useEffect(() => {
    let removeListener;

    App.addListener('backButton', ({ canGoBack }) => {
      if (history.length > 1) {
        history.goBack();
      } else {
        App.exitApp();
      }
    }).then(listener => {
      // simpan fungsi remove() biar bisa dipanggil waktu komponen unmount
      removeListener = listener.remove;
    });

    // cleanup: hapus listener saat komponen unmount
    return () => {
      if (removeListener) removeListener();
    };
  }, [history]);

  return null;
}

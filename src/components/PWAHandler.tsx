import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, WifiOff, X, CheckCircle2 } from 'lucide-react';

export const PWAHandler: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showInstallToast, setShowInstallToast] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallToast(true);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setShowInstallToast(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-3 shadow-lg"
          >
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-bold">Estás trabajando sin conexión. Los cambios se sincronizarán al volver.</span>
          </motion.div>
        )}

        {showInstallToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4"
          >
            <div className="bg-brand-gold p-3 rounded-xl text-brand-black">
              <Download className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">App lista para instalar</p>
              <p className="text-xs text-slate-400">Accede más rápido y usa la app sin conexión.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-brand-gold hover:bg-white text-brand-black text-xs font-bold rounded-lg transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowInstallToast(false)}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Después
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

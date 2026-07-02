import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isIosSafari() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
  return isIos && isSafari;
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const { t } = useLanguage();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('simplebook-install-dismissed') === '1');

  useEffect(() => {
    if (dismissed || isStandalone()) {
      return;
    }

    setShowIosHint(isIosSafari());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [dismissed]);

  if (dismissed || isStandalone() || (!installEvent && !showIosHint)) {
    return null;
  }

  async function handleInstall() {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  function handleDismiss() {
    localStorage.setItem('simplebook-install-dismissed', '1');
    setDismissed(true);
  }

  return (
    <section className="mx-5 mb-3 rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
      {installEvent ? (
        <button
          className="w-full rounded-2xl bg-gray-950 px-4 py-3 text-sm font-bold text-white"
          type="button"
          onClick={() => void handleInstall()}
        >
          {t.install.addToHome}
        </button>
      ) : (
        <p className="text-sm leading-6 text-gray-600">{t.install.iosHint}</p>
      )}
      <button className="mt-2 w-full py-1 text-xs font-semibold text-gray-400" type="button" onClick={handleDismiss}>
        {t.install.dismiss}
      </button>
    </section>
  );
}

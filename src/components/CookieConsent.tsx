import React from 'react';
import { getConsent, grantConsent, denyConsent } from '../analytics';

interface Props {
  isDarkMode: boolean;
  /** Quando true, o banner reabre mesmo que ja exista uma escolha salva. */
  forceOpen?: boolean;
  onResolved?: () => void;
}

/**
 * Banner de consentimento de cookies.
 * Aparece no primeiro acesso, ou quando o usuario reabre pelas preferencias.
 * "Aceitar" carrega o Google Analytics. "Recusar" nao carrega nada.
 */
const CookieConsent: React.FC<Props> = ({ isDarkMode, forceOpen = false, onResolved }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (forceOpen || getConsent() === null) setVisible(true);
    else setVisible(false);
  }, [forceOpen]);

  if (!visible) return null;

  const resolve = () => {
    setVisible(false);
    onResolved?.();
  };

  const accept = () => {
    grantConsent();
    resolve();
  };

  const reject = () => {
    denyConsent();
    resolve();
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className={`fixed bottom-0 left-0 right-0 z-[80] border-t-2 px-4 py-4 md:py-5 shadow-2xl ${
        isDarkMode
          ? 'bg-stone-900 border-red-800 text-stone-200'
          : 'bg-white border-stone-800 text-stone-800'
      }`}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <p className="text-sm leading-relaxed flex-1">
          Usamos o Google Analytics para entender o trafego do site. Ele so e ativado
          se voce aceitar, e envia dados (incluindo seu IP) ao Google nos EUA. Saiba mais
          na{' '}
          <a
            href="/privacidade.html"
            className="underline font-semibold hover:text-red-600"
          >
            Politica de Privacidade
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border-2 transition-colors ${
              isDarkMode
                ? 'border-stone-700 text-stone-300 hover:bg-stone-800'
                : 'border-stone-300 text-stone-600 hover:bg-stone-100'
            }`}
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

/**
 * Analytics carregado apenas apos consentimento explicito (LGPD/GDPR).
 * Enquanto o visitante nao aceitar, nenhum script do Google e injetado
 * e nenhum cookie de medicao e criado. Recusa = nada carrega.
 */

const GA_ID = 'G-YTGFZY41N4';
const STORAGE_KEY = 'ninjadex-consent';

export type ConsentValue = 'granted' | 'denied';

let loaded = false;

export const getConsent = (): ConsentValue | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
};

const persist = (value: ConsentValue) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* localStorage indisponivel (modo privado restrito): ignora */
  }
};

export const loadAnalytics = () => {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag('js', new Date());
  // anonymize_ip reduz o dado pessoal enviado ao Google.
  w.gtag('config', GA_ID, { anonymize_ip: true });
};

/** Chamado quando o visitante aceita: persiste e carrega o GA. */
export const grantConsent = () => {
  persist('granted');
  loadAnalytics();
};

/** Chamado quando o visitante recusa: persiste e nao carrega nada. */
export const denyConsent = () => {
  persist('denied');
};

/** No boot do app: so recarrega o GA se o consentimento ja foi dado antes. */
export const initAnalytics = () => {
  if (getConsent() === 'granted') loadAnalytics();
};

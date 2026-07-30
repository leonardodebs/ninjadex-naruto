import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const GTAG_SELECTOR = 'script[src*="googletagmanager.com/gtag/js"]';

const freshImport = async () => {
  // Reimporta o modulo com estado interno `loaded` zerado entre os testes.
  vi.resetModules();
  return await import('./analytics');
};

describe('analytics (gating por consentimento)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.head.querySelectorAll(GTAG_SELECTOR).forEach((s) => s.remove());
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sem consentimento salvo, initAnalytics NAO carrega o GA', async () => {
    const a = await freshImport();
    a.initAnalytics();
    expect(document.querySelector(GTAG_SELECTOR)).toBeNull();
    expect((window as unknown as { gtag?: unknown }).gtag).toBeUndefined();
  });

  it('recusar persiste "denied" e nao carrega nada', async () => {
    const a = await freshImport();
    a.denyConsent();
    expect(a.getConsent()).toBe('denied');
    expect(document.querySelector(GTAG_SELECTOR)).toBeNull();
  });

  it('aceitar persiste "granted" e injeta o script do GA', async () => {
    const a = await freshImport();
    a.grantConsent();
    expect(a.getConsent()).toBe('granted');
    expect(document.querySelector(GTAG_SELECTOR)).not.toBeNull();
    expect(typeof (window as unknown as { gtag?: unknown }).gtag).toBe('function');
  });

  it('com consentimento previo "granted", initAnalytics recarrega o GA', async () => {
    localStorage.setItem('ninjadex-consent', 'granted');
    const a = await freshImport();
    a.initAnalytics();
    expect(document.querySelector(GTAG_SELECTOR)).not.toBeNull();
  });
});

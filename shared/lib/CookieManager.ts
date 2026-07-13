// ================================================================
//  BILIA-V4 — shared/lib/CookieManager.ts
//  Gestion des cookies RGPD-friendly
// ================================================================

/** Options de cookie */
export interface CookieOptions {
  expires?:  Date | number;  // Date ou nombre de jours
  path?:     string;
  domain?:   string;
  secure?:   boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;        // côté serveur uniquement
}

/**
 * Gestionnaire de cookies côté client.
 * Préférer localStorage pour les données de session BiLiA.
 * Utiliser les cookies uniquement pour les préférences persistantes (thème, langue).
 */
export class CookieManager {
  /**
   * Définir un cookie.
   * @param name    - Nom du cookie.
   * @param value   - Valeur (sera encodée URI).
   * @param options - Options (expires, path, secure…).
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const exp = options.expires instanceof Date
        ? options.expires
        : new Date(Date.now() + options.expires * 864e5);
      cookie += `; expires=${exp.toUTCString()}`;
    }

    cookie += `; path=${options.path ?? '/'}`;
    if (options.domain)   cookie += `; domain=${options.domain}`;
    if (options.secure)   cookie += '; secure';
    cookie += `; samesite=${options.sameSite ?? 'Lax'}`;

    document.cookie = cookie;
  }

  /**
   * Lire un cookie par son nom.
   * @returns La valeur décodée, ou null si absent.
   */
  static get(name: string): string | null {
    const encoded = encodeURIComponent(name);
    const match   = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${encoded}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }

  /**
   * Supprimer un cookie en le faisant expirer immédiatement.
   */
  static remove(name: string, path = '/'): void {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  }

  /**
   * Vérifier si un cookie existe.
   */
  static has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Lire tous les cookies sous forme de Map.
   */
  static getAll(): Map<string, string> {
    const map = new Map<string, string>();
    document.cookie.split('; ').forEach(pair => {
      const [k, ...rest] = pair.split('=');
      if (k) map.set(decodeURIComponent(k), decodeURIComponent(rest.join('=')));
    });
    return map;
  }
}

export default CookieManager;

// Device-side PIN lock + WebAuthn (biometric) helpers.
// The PIN is hashed with SHA-256 and stored per Supabase user in localStorage.
// The biometric credential id is also stored per user; unlock uses WebAuthn
// "get" with userVerification=required so Face ID / Touch ID / Android
// fingerprint are required to satisfy the assertion.

const PIN_KEY = (uid: string) => `pin_hash_v1:${uid}`;
const BIO_KEY = (uid: string) => `pin_bio_cred_v1:${uid}`;
const UNLOCKED_KEY = (uid: string) => `pin_unlocked_v1:${uid}`; // sessionStorage

export const isValidPin = (pin: string) =>
  /^\d{4}$/.test(pin) && !/^(\d)\1{3}$/.test(pin);

const sha256 = async (text: string) => {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const hasPin = (uid: string) => !!localStorage.getItem(PIN_KEY(uid));

export const setPin = async (uid: string, pin: string) => {
  if (!isValidPin(pin)) throw new Error("invalid_pin");
  const salted = `${uid}:${pin}`;
  localStorage.setItem(PIN_KEY(uid), await sha256(salted));
};

export const verifyPin = async (uid: string, pin: string) => {
  const stored = localStorage.getItem(PIN_KEY(uid));
  if (!stored) return false;
  const candidate = await sha256(`${uid}:${pin}`);
  return candidate === stored;
};

export const clearPin = (uid: string) => {
  localStorage.removeItem(PIN_KEY(uid));
  localStorage.removeItem(BIO_KEY(uid));
  sessionStorage.removeItem(UNLOCKED_KEY(uid));
};

export const isUnlocked = (uid: string) =>
  sessionStorage.getItem(UNLOCKED_KEY(uid)) === "1";

export const markUnlocked = (uid: string) => {
  sessionStorage.setItem(UNLOCKED_KEY(uid), "1");
};

export const lock = (uid: string) => {
  sessionStorage.removeItem(UNLOCKED_KEY(uid));
};

// ---- WebAuthn (biometric) ----

export const isBiometricSupported = () =>
  typeof window !== "undefined" &&
  !!window.PublicKeyCredential &&
  typeof navigator.credentials?.create === "function";

// Async check for an actual platform authenticator (Touch ID / Face ID / Windows Hello / Android fingerprint).
export const isPlatformAuthenticatorAvailable = async (): Promise<boolean> => {
  if (!isBiometricSupported()) return false;
  try {
    const fn = (window.PublicKeyCredential as any)
      ?.isUserVerifyingPlatformAuthenticatorAvailable;
    if (typeof fn !== "function") return false;
    return await fn.call(window.PublicKeyCredential);
  } catch {
    return false;
  }
};

export const hasBiometric = (uid: string) => !!localStorage.getItem(BIO_KEY(uid));

const b64uToBytes = (s: string) => {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
};
const bytesToB64u = (buf: ArrayBuffer) => {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const enrollBiometric = async (uid: string, label: string) => {
  if (!isBiometricSupported()) throw new Error("unsupported");
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = new TextEncoder().encode(uid);
  const cred = (await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "Finance App", id: window.location.hostname },
      user: { id: userId, name: label, displayName: label },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("no_credential");
  localStorage.setItem(BIO_KEY(uid), bytesToB64u(cred.rawId));
};

export const unlockWithBiometric = async (uid: string) => {
  const stored = localStorage.getItem(BIO_KEY(uid));
  if (!stored || !isBiometricSupported()) return false;
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  try {
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        allowCredentials: [
          { type: "public-key", id: b64uToBytes(stored) as BufferSource },
        ],
        rpId: window.location.hostname,
      },
    })) as PublicKeyCredential | null;
    if (!assertion) return false;
    markUnlocked(uid);
    return true;
  } catch {
    return false;
  }
};

export const disableBiometric = (uid: string) => {
  localStorage.removeItem(BIO_KEY(uid));
};

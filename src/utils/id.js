// crypto.randomUUID só existe em *contextos seguros* (HTTPS ou localhost).
// O fallback cobre o acesso por IP da rede local (http://192.168.x.x),
// comum ao testar o app no celular com `npm run dev -- --host`.
export const gerarId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

import confetti from 'canvas-confetti';

// Respeita a preferência de movimento reduzido do sistema:
// com prefers-reduced-motion ativo, o confete não dispara.
confetti.disableForReducedMotion = true;

export default confetti;

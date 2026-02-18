"use client";

import { useCallback, useRef } from "react";

/**
 * Sons retro gerados via Web Audio API — sem arquivos externos.
 * Imita cliques, alertas e interações de um sistema operacional clássico.
 */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  /** Clique de botão genérico — "toc" curto */
  const playClick = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // silently fail — audio may not be available
    }
  }, [getCtx]);

  /** Troca de aba — "tic" mais suave e agudo */
  const playTab = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Abrir janela / modal — "chirp" ascendente */
  const playOpen = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Fechar janela / modal — "chirp" descendente */
  const playClose = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Confirmar / sucesso — dois bips rápidos ascendentes */
  const playConfirm = useCallback(() => {
    try {
      const ctx = getCtx();
      // Bip 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(600, ctx.currentTime);
      gain1.gain.setValueAtTime(0.1, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.06);
      // Bip 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "square";
      osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.08);
      gain2.gain.setValueAtTime(0.001, ctx.currentTime);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.14);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Erro / alerta — buzz curto e grave */
  const playError = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(120, ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Hover em ícone do desktop — "tick" sutil */
  const playHover = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Clique no botão Iniciar — fanfarra curta */
  const playStartup = useCallback(() => {
    try {
      const ctx = getCtx();
      const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        const t = ctx.currentTime + i * 0.06;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      });
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Jingle de boot do OS — melodia estilo Win95, harmônica e longa */
  const playBootJingle = useCallback(() => {
    try {
      const ctx = getCtx();

      // Melodia principal — notas suaves com reverb simulado
      const melody: [number, number, number][] = [
        // [frequência, início, duração]
        [392, 0, 0.45],     // G4
        [523, 0.35, 0.45],  // C5
        [659, 0.7, 0.4],    // E5
        [784, 1.0, 0.5],    // G5
        [659, 1.4, 0.3],    // E5
        [784, 1.65, 0.6],   // G5
        [1047, 1.95, 0.9],  // C6 — nota final longa
      ];

      melody.forEach(([freq, start, dur]) => {
        // Onda principal — triângulo (suave)
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.type = "triangle";
        const t = ctx.currentTime + start;
        osc1.frequency.setValueAtTime(freq, t);
        g1.gain.setValueAtTime(0.001, ctx.currentTime);
        g1.gain.linearRampToValueAtTime(0.12, t + 0.04);
        g1.gain.setValueAtTime(0.12, t + dur * 0.6);
        g1.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc1.connect(g1);
        g1.connect(ctx.destination);
        osc1.start(t);
        osc1.stop(t + dur + 0.05);

        // Harmônico sutil — sine uma oitava acima
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 2, t);
        g2.gain.setValueAtTime(0.001, ctx.currentTime);
        g2.gain.linearRampToValueAtTime(0.04, t + 0.04);
        g2.gain.setValueAtTime(0.04, t + dur * 0.5);
        g2.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc2.connect(g2);
        g2.connect(ctx.destination);
        osc2.start(t);
        osc2.stop(t + dur + 0.05);
      });

      // Pad de fundo — acorde sustentado suave
      const padFreqs = [262, 330, 392]; // C4 E4 G4
      padFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        const t = ctx.currentTime;
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.03, t + 0.3);
        g.gain.setValueAtTime(0.03, t + 2.0);
        g.gain.exponentialRampToValueAtTime(0.001, t + 3.0);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.1);
      });
    } catch {
      // silently fail
    }
  }, [getCtx]);

  return {
    playClick,
    playTab,
    playOpen,
    playClose,
    playConfirm,
    playError,
    playHover,
    playStartup,
    playBootJingle,
  };
}

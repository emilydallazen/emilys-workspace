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

  /** Troca de aba — som suave de página sendo folheada */
  const playTab = useCallback(() => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;
      const duration = 0.28;

      // Ruído suave — simula o deslizar do papel
      const bufferSize = Math.ceil(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      // Filtro passa-baixa — remove aspereza, mantém só o "ssshh" suave
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(3000, t);
      lp.frequency.exponentialRampToValueAtTime(1500, t + 0.12);
      lp.frequency.exponentialRampToValueAtTime(800, t + duration);
      lp.Q.setValueAtTime(0.3, t);

      // Filtro passa-alta — tira graves para não soar como tapa
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(1200, t);
      hp.frequency.exponentialRampToValueAtTime(600, t + duration);

      // Envelope — ataque gradual, fade longo e suave
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.001, t);
      env.gain.linearRampToValueAtTime(0.08, t + 0.04); // sobe devagar
      env.gain.setValueAtTime(0.07, t + 0.08); // platô suave
      env.gain.exponentialRampToValueAtTime(0.03, t + 0.16);
      env.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(lp);
      lp.connect(hp);
      hp.connect(env);
      env.connect(ctx.destination);

      noise.start(t);
      noise.stop(t + duration + 0.01);
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

  /** Fechar janela — som satisfatório descendente com "whoosh" */
  const playClose = useCallback(() => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      // Tom descendente — nota principal suave
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(600, t);
      osc1.frequency.exponentialRampToValueAtTime(250, t + 0.15);
      osc1.frequency.exponentialRampToValueAtTime(120, t + 0.25);
      g1.gain.setValueAtTime(0.001, t);
      g1.gain.linearRampToValueAtTime(0.1, t + 0.01);
      g1.gain.exponentialRampToValueAtTime(0.04, t + 0.12);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.26);

      // Harmônico — oitava acima, mais sutil
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1200, t);
      osc2.frequency.exponentialRampToValueAtTime(400, t + 0.18);
      g2.gain.setValueAtTime(0.001, t);
      g2.gain.linearRampToValueAtTime(0.04, t + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.19);

      // "Whoosh" de ar — ruído filtrado curto
      const bufSize = Math.ceil(ctx.sampleRate * 0.15);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        d[i] = Math.random() * 2 - 1;
      }
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(2500, t);
      bp.frequency.exponentialRampToValueAtTime(600, t + 0.12);
      bp.Q.setValueAtTime(0.7, t);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.001, t);
      ng.gain.linearRampToValueAtTime(0.06, t + 0.015);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      noiseSrc.connect(bp);
      bp.connect(ng);
      ng.connect(ctx.destination);
      noiseSrc.start(t);
      noiseSrc.stop(t + 0.15);
    } catch {
      // silently fail
    }
  }, [getCtx]);

  /** Confirmar / adicionar — clique de mouse realista (press + release) */
  const playConfirm = useCallback(() => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const makeClick = (when: number, volume: number, duration: number) => {
        const len = Math.ceil(ctx.sampleRate * duration);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          const env = Math.exp(-i / (ctx.sampleRate * 0.001));
          data[i] = (Math.random() * 2 - 1) * env;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;

        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(1800, when);

        const peak = ctx.createBiquadFilter();
        peak.type = "peaking";
        peak.frequency.setValueAtTime(3500, when);
        peak.gain.setValueAtTime(8, when);
        peak.Q.setValueAtTime(2, when);

        const g = ctx.createGain();
        g.gain.setValueAtTime(volume, when);
        g.gain.exponentialRampToValueAtTime(0.001, when + duration);

        src.connect(hp);
        hp.connect(peak);
        peak.connect(g);
        g.connect(ctx.destination);
        src.start(when);
        src.stop(when + duration);
      };

      // PRESS — botão descendo, impacto no micro-switch (mais forte)
      makeClick(t, 1.0, 0.012);

      // RELEASE — botão voltando com a mola (~60ms depois, mais suave)
      makeClick(t + 0.06, 0.6, 0.008);
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
        [392, 0, 0.45], // G4
        [523, 0.35, 0.45], // C5
        [659, 0.7, 0.4], // E5
        [784, 1.0, 0.5], // G5
        [659, 1.4, 0.3], // E5
        [784, 1.65, 0.6], // G5
        [1047, 1.95, 0.9], // C6 — nota final longa
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

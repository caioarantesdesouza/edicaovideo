import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cores, fontes, fontesParaCarregar } from "./tema";

const suave = Easing.bezier(0.22, 1, 0.36, 1);

// Segura o render até as fontes estarem carregadas.
export const useFontesCarregadas = () => {
  const [handle] = useState(() => delayRender("Carregando fontes"));
  useEffect(() => {
    Promise.all(fontesParaCarregar.map((f) => document.fonts.load(f)))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

// Fundo escuro com brilho central e moldura dourada fina.
export const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const deriva = interpolate(frame, [0, durationInFrames], [42, 50]);
  const moldura = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: suave,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: cores.fundo }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 55% at 50% ${deriva}%, ${cores.fundoCentro} 0%, ${cores.fundo} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          margin: 48,
          border: `1px solid ${cores.dourado}`,
          opacity: 0.35 * moldura,
        }}
      />
    </AbsoluteFill>
  );
};

// Envolve uma cena com entrada e saída em fade + leve deslocamento.
export const Cena: React.FC<{
  duracao: number;
  children: React.ReactNode;
  semEntrada?: boolean;
  semSaida?: boolean;
}> = ({ duracao, children, semEntrada, semSaida }) => {
  const frame = useCurrentFrame();
  const entrada = semEntrada
    ? 1
    : interpolate(frame, [0, 12], [0, 1], {
        extrapolateRight: "clamp",
        easing: suave,
      });
  const saida = semSaida
    ? 1
    : interpolate(frame, [duracao - 10, duracao], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const escala = interpolate(frame, [0, duracao], [1, 1.03]);

  return (
    <AbsoluteFill
      style={{ opacity: Math.min(entrada, saida), transform: `scale(${escala})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Revela o texto palavra por palavra, subindo de trás de uma máscara.
// Use "\n" no texto para forçar quebra de linha.
export const RevelarPalavras: React.FC<{
  texto: string;
  inicio?: number;
  intervalo?: number;
  style?: React.CSSProperties;
}> = ({ texto, inicio = 0, intervalo = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let indice = 0;

  return (
    <div style={style}>
      {texto.split("\n").map((linha, l) => (
        <div
          key={l}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        >
          {linha.split(" ").map((palavra, i, palavras) => {
            const p = spring({
              frame: frame - inicio - indice++ * intervalo,
              fps,
              config: { damping: 200 },
              durationInFrames: 18,
            });
            return (
              <span
                key={i}
                style={{
                  overflow: "hidden",
                  display: "inline-block",
                  // Folga para acentos e descendentes não serem cortados.
                  padding: "0.18em 0 0.12em",
                  margin: "-0.18em 0 -0.12em",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${(1 - p) * 110}%)`,
                    opacity: p,
                    whiteSpace: "pre",
                  }}
                >
                  {palavra}
                  {i < palavras.length - 1 ? " " : ""}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Linha dourada que cresce a partir do centro.
export const LinhaDourada: React.FC<{ inicio?: number; largura?: number }> = ({
  inicio = 0,
  largura = 160,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - inicio, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: suave,
  });
  return (
    <div
      style={{
        width: largura * p,
        height: 2,
        backgroundColor: cores.dourado,
        margin: "0 auto",
      }}
    />
  );
};

// Texto pequeno em caixa alta, espaçado, que aparece em fade.
export const Rotulo: React.FC<{
  texto: string;
  inicio?: number;
  style?: React.CSSProperties;
}> = ({ texto, inicio = 0, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - inicio, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: suave,
  });
  return (
    <div
      style={{
        fontFamily: fontes.sans,
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: cores.dourado,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        ...style,
      }}
    >
      {texto}
    </div>
  );
};

// Parágrafo que aparece em fade suave.
export const Paragrafo: React.FC<{
  texto: string;
  inicio?: number;
  style?: React.CSSProperties;
}> = ({ texto, inicio = 0, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - inicio, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: suave,
  });
  return (
    <div
      style={{
        fontFamily: fontes.sans,
        fontWeight: 300,
        fontSize: 44,
        lineHeight: 1.5,
        color: cores.textoSuave,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        ...style,
      }}
    >
      {texto}
    </div>
  );
};

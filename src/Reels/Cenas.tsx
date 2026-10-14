import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LinhaDourada, Paragrafo, RevelarPalavras, Rotulo } from "./componentes";
import { areaSegura, cores, fontes } from "./tema";
import { textos } from "./textos";

const centro: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: `${areaSegura.topo}px ${areaSegura.lateral}px ${areaSegura.base}px`,
};

export const Gancho: React.FC = () => {
  const { linha1, destaque } = textos.gancho;
  return (
    <AbsoluteFill style={centro}>
      <RevelarPalavras
        texto={linha1}
        intervalo={2}
        style={{
          fontFamily: fontes.serifa,
          fontWeight: 500,
          fontSize: 88,
          lineHeight: 1.08,
          color: cores.texto,
        }}
      />
      <RevelarPalavras
        texto={destaque}
        inicio={10}
        intervalo={3}
        style={{
          fontFamily: fontes.serifa,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 112,
          lineHeight: 1.08,
          color: cores.douradoClaro,
          marginTop: 12,
        }}
      />
      <div style={{ marginTop: 56 }}>
        <LinhaDourada inicio={24} largura={200} />
      </div>
    </AbsoluteFill>
  );
};

export const CenaInfo: React.FC<{ indice: number }> = ({ indice }) => {
  const frame = useCurrentFrame();
  const cena = textos.cenas[indice];
  const numero = String(indice + 1).padStart(2, "0");
  const numeroOpacidade = interpolate(frame, [0, 24], [0, 0.45], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={centro}>
      <div
        style={{
          fontFamily: fontes.serifa,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 200,
          lineHeight: 1,
          marginBottom: 36,
          color: cores.dourado,
          opacity: numeroOpacidade,
        }}
      >
        {numero}
      </div>
      <Rotulo texto={cena.rotulo} inicio={4} />
      <div style={{ margin: "40px 0 44px" }}>
        <LinhaDourada inicio={8} largura={120} />
      </div>
      <RevelarPalavras
        texto={cena.titulo}
        inicio={10}
        intervalo={3}
        style={{
          fontFamily: fontes.serifa,
          fontWeight: 500,
          fontSize: 112,
          lineHeight: 1.08,
          color: cores.texto,
        }}
      />
      <Paragrafo
        texto={cena.texto}
        inicio={30}
        style={{ marginTop: 48, maxWidth: 780 }}
      />
    </AbsoluteFill>
  );
};

export const Fechamento: React.FC = () => {
  const frame = useCurrentFrame();
  const f = textos.fechamento;
  const subtitulo = [f.profissao, f.cro].filter(Boolean).join(" · ");
  const chamadaP = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brilho = interpolate(frame % 60, [0, 30, 60], [0.35, 0.8, 0.35]);

  return (
    <AbsoluteFill style={centro}>
      <Rotulo texto={f.local} inicio={0} style={{ fontSize: 26 }} />
      <div style={{ margin: "44px 0 40px" }}>
        <LinhaDourada inicio={4} largura={120} />
      </div>
      <RevelarPalavras
        texto={f.nome}
        inicio={8}
        intervalo={4}
        style={{
          fontFamily: fontes.serifa,
          fontWeight: 600,
          fontSize: 132,
          lineHeight: 1.05,
          color: cores.texto,
        }}
      />
      <Paragrafo
        texto={subtitulo}
        inicio={20}
        style={{
          marginTop: 20,
          fontSize: 40,
          letterSpacing: "0.12em",
          color: cores.douradoClaro,
        }}
      />
      <div
        style={{
          marginTop: 110,
          opacity: chamadaP,
          transform: `translateY(${(1 - chamadaP) * 24}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "30px 46px",
            whiteSpace: "nowrap",
            border: `1.5px solid rgba(201, 169, 110, ${brilho})`,
            borderRadius: 100,
            fontFamily: fontes.sans,
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: "0.04em",
            color: cores.texto,
          }}
        >
          {f.chamada}
        </div>
        {f.whatsapp ? (
          <div
            style={{
              marginTop: 28,
              fontFamily: fontes.sans,
              fontWeight: 300,
              fontSize: 38,
              letterSpacing: "0.1em",
              color: cores.textoSuave,
            }}
          >
            {f.whatsapp}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

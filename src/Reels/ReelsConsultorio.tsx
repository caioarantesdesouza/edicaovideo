import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { CenaInfo, Fechamento, Gancho } from "./Cenas";
import { Cena, Fundo, useFontesCarregadas } from "./componentes";
import { textos } from "./textos";

export const FPS = 30;

const quadros = (segundos: number) => Math.round(segundos * FPS);

const GANCHO = quadros(textos.duracoes.gancho);
const CENA = quadros(textos.duracoes.cena);
const FECHAMENTO = quadros(textos.duracoes.fechamento);

export const DURACAO_TOTAL =
  GANCHO + CENA * textos.cenas.length + FECHAMENTO;

export const ReelsConsultorio: React.FC = () => {
  useFontesCarregadas();
  const inicioFechamento = GANCHO + CENA * textos.cenas.length;

  return (
    <AbsoluteFill>
      <Fundo />
      {textos.musica.arquivo ? (
        <Html5Audio
          src={staticFile(textos.musica.arquivo)}
          volume={(f) =>
            textos.musica.volume *
            interpolate(
              f,
              [0, 6, DURACAO_TOTAL - 45, DURACAO_TOTAL],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}
      <Sequence durationInFrames={GANCHO} name="Gancho">
        <Cena duracao={GANCHO} semEntrada>
          <Gancho />
        </Cena>
      </Sequence>
      {textos.cenas.map((_, i) => (
        <Sequence
          key={i}
          from={GANCHO + CENA * i}
          durationInFrames={CENA}
          name={`Cena ${i + 1}`}
        >
          <Cena duracao={CENA}>
            <CenaInfo indice={i} />
          </Cena>
        </Sequence>
      ))}
      <Sequence
        from={inicioFechamento}
        durationInFrames={FECHAMENTO}
        name="Fechamento"
      >
        <Cena duracao={FECHAMENTO} semSaida>
          <Fechamento />
        </Cena>
      </Sequence>
    </AbsoluteFill>
  );
};

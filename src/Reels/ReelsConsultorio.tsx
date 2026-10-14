import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
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

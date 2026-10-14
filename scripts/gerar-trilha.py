"""Gera a trilha original do Reels (piano suave + pad ambiente).

Uso: python3 scripts/gerar-trilha.py [saida.wav]

Os acordes mudam junto com as cenas. Se alterar as durações em
src/Reels/textos.ts, ajuste GANCHO / CENA / FECHAMENTO abaixo e gere de novo.
"""

import sys
import wave

import numpy as np

SR = 48000
GANCHO, CENA, FECHAMENTO = 2.6, 4.0, 5.0
TOTAL = GANCHO + 3 * CENA + FECHAMENTO

rng = np.random.default_rng(7)


def hz(nota: str) -> float:
    nomes = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6,
             "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    nome, oitava = nota[:-1], int(nota[-1])
    midi = 12 * (oitava + 1) + nomes[nome]
    return 440.0 * 2 ** ((midi - 69) / 12)


def tempo(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


def piano(nota: str, dur: float = 3.5, vel: float = 0.5) -> np.ndarray:
    f = hz(nota)
    t = tempo(dur)
    som = np.zeros_like(t)
    for n, amp in enumerate([1.0, 0.45, 0.22, 0.12, 0.06], start=1):
        fn = f * n * (1 + 0.0004 * n * n)  # leve inarmonicidade
        som += amp * np.sin(2 * np.pi * fn * t) * np.exp(-t * (1.6 + 1.1 * n))
    ataque = np.minimum(t / 0.006, 1.0)
    return vel * som * ataque


def pad(notas: list[str], dur: float, vel: float = 0.12) -> np.ndarray:
    t = tempo(dur)
    som = np.zeros_like(t)
    for nota in notas:
        f = hz(nota)
        for desafino in (-0.12, 0.0, 0.12):
            fd = f * 2 ** (desafino / 12)
            fase = rng.uniform(0, 2 * np.pi)
            som += np.sin(2 * np.pi * fd * t + fase)
            som += 0.25 * np.sin(2 * np.pi * 2 * fd * t + fase)
    som *= 1 + 0.08 * np.sin(2 * np.pi * 0.25 * t)
    env = np.minimum(t / 1.2, 1.0) * np.minimum((dur - t) / 1.2, 1.0)
    return vel * som / (3 * len(notas)) * np.clip(env, 0, 1)


def grave(f: float, dur: float = 2.5, vel: float = 0.5) -> np.ndarray:
    t = tempo(dur)
    return vel * np.sin(2 * np.pi * f * t) * np.exp(-t * 1.8) * np.minimum(t / 0.01, 1)


def mistura(trilha: np.ndarray, som: np.ndarray, inicio: float) -> None:
    i = int(inicio * SR)
    fim = min(len(trilha), i + len(som))
    trilha[i:fim] += som[: fim - i]


def reverb(seco: np.ndarray, semente: int) -> np.ndarray:
    r = np.random.default_rng(semente)
    t = tempo(2.8)
    ir = r.standard_normal(len(t)) * np.exp(-t * 2.4)
    n = len(seco) + len(ir)
    molhado = np.fft.irfft(np.fft.rfft(seco, n) * np.fft.rfft(ir, n), n)[: len(seco)]
    return molhado / np.max(np.abs(molhado)) * np.max(np.abs(seco))


def main() -> None:
    saida = sys.argv[1] if len(sys.argv) > 1 else "public/trilha-reels.wav"
    trilha = np.zeros(int(TOTAL * SR) + SR)

    # Gancho: grave suave + nota aguda que chama atenção, pad crescendo.
    mistura(trilha, grave(hz("D2"), vel=0.55), 0.0)
    mistura(trilha, piano("D5", vel=0.35), 0.05)
    mistura(trilha, piano("A4", vel=0.25), 0.9)
    mistura(trilha, pad(["D3", "A3", "E4"], GANCHO + 1.0, vel=0.10), 0.0)

    # Cenas: um acorde por cena, com arpejo de piano.
    cenas = [
        (["D3", "A3", "C#4", "F#4"], ["A4", "C#5", "E5", "F#5", "E5", "C#5"]),
        (["B2", "F#3", "A3", "D4"], ["F#4", "A4", "C#5", "D5", "C#5", "A4"]),
        (["G2", "D3", "F#3", "B3"], ["D4", "F#4", "A4", "B4", "A4", "F#4"]),
    ]
    for i, (acorde, arpejo) in enumerate(cenas):
        inicio = GANCHO + i * CENA
        mistura(trilha, grave(hz(acorde[0]) / 2, vel=0.35), inicio)
        mistura(trilha, pad(acorde, CENA + 1.2, vel=0.13), inicio - 0.3)
        for j, nota in enumerate(arpejo):
            mistura(trilha, piano(nota, vel=0.30 - 0.02 * j), inicio + j * 0.6)

    # Fechamento: suspensão e resolução em D.
    inicio = GANCHO + 3 * CENA
    mistura(trilha, pad(["A2", "E3", "A3", "D4"], 1.6, vel=0.12), inicio - 0.3)
    mistura(trilha, piano("E5", vel=0.25), inicio)
    mistura(trilha, piano("D5", vel=0.22), inicio + 0.6)
    resolucao = inicio + 1.2
    mistura(trilha, grave(hz("D2"), vel=0.4), resolucao)
    mistura(trilha, pad(["D3", "A3", "E4", "F#4"], TOTAL - resolucao + 1, vel=0.13), resolucao)
    for j, nota in enumerate(["D4", "A4", "E5", "F#5", "A5"]):
        mistura(trilha, piano(nota, dur=4.5, vel=0.26), resolucao + j * 0.35)

    trilha = trilha[: int(TOTAL * SR)]
    esquerda = 0.7 * trilha + 0.3 * reverb(trilha, 1)
    direita = 0.7 * trilha + 0.3 * reverb(trilha, 2)
    estereo = np.stack([esquerda, direita], axis=1)

    t = np.arange(len(estereo)) / SR
    estereo *= np.clip((TOTAL - t) / 1.5, 0, 1)[:, None]  # fade-out final
    estereo *= 10 ** (-1 / 20) / np.max(np.abs(estereo))  # pico em -1 dBFS

    with wave.open(saida, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((estereo * 32767).astype("<i2").tobytes())
    print(f"{saida}: {TOTAL:.1f}s")


if __name__ == "__main__":
    main()

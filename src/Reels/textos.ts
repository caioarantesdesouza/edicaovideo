// =====================================================================
//  TEXTOS DO REELS — edite aqui.
//  Tudo o que aparece escrito no vídeo está neste arquivo.
//  Para mudar a duração de cada parte, ajuste os valores em "duracoes"
//  (em segundos). A duração total do vídeo é calculada automaticamente.
// =====================================================================

export const textos = {
  // 1) Gancho (primeiros segundos)
  // Use "\n" para forçar quebra de linha.
  gancho: {
    linha1: "Seu sorriso pode estar",
    destaque: "envelhecendo\nseu rosto.",
  },

  // 2) Cenas curtas
  cenas: [
    {
      rotulo: "Facetas",
      titulo: "Resina ou cerâmica.",
      texto: "A indicação certa para o seu caso, com planejamento individual.",
    },
    {
      rotulo: "Proporção dental",
      titulo: "Harmonia com o seu rosto.",
      texto: "Forma, tamanho e cor pensados para um resultado natural.",
    },
    {
      rotulo: "Atendimento",
      titulo: "Sem pressa.",
      texto: "Tempo para ouvir, avaliar e explicar cada etapa.",
    },
  ],

  // 3) Fechamento
  fechamento: {
    nome: "Dr. Caio Arantes",
    profissao: "Cirurgião-Dentista",
    // Número do CRO (exigido pelo CFO em publicidade). Ex.: "CRO-PE 12345".
    // Deixe vazio ("") para não exibir.
    cro: "",
    local: "Estética dental · Olinda",
    chamada: "Agende sua avaliação pelo WhatsApp",
    // Número exibido abaixo da chamada. Ex.: "(81) 90000-0000". Vazio = oculto.
    whatsapp: "",
  },

  // Música de fundo (arquivo dentro da pasta "public").
  // Para usar outra música, coloque o arquivo em public/ e troque o nome.
  // Deixe arquivo: "" para gerar o vídeo sem som.
  musica: {
    arquivo: "trilha-reels.wav",
    volume: 0.8, // 0 a 1
  },

  // Durações em segundos
  duracoes: {
    gancho: 2.6,
    cena: 4,
    fechamento: 5,
  },
};

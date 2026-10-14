import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/500.css";

export const cores = {
  fundo: "#0d0c0a",
  fundoCentro: "#1c1913",
  dourado: "#c9a96e",
  douradoClaro: "#e6d3a8",
  texto: "#f3eee6",
  textoSuave: "rgba(243, 238, 230, 0.68)",
};

export const fontes = {
  serifa: '"Cormorant Garamond", Georgia, serif',
  sans: '"Montserrat", Helvetica, Arial, sans-serif',
};

// Strings usadas para garantir o carregamento das fontes antes do render.
export const fontesParaCarregar = [
  '500 80px "Cormorant Garamond"',
  'italic 500 80px "Cormorant Garamond"',
  '600 80px "Cormorant Garamond"',
  '300 40px "Montserrat"',
  '500 40px "Montserrat"',
];

// Margens seguras para a interface do Instagram Reels.
export const areaSegura = {
  lateral: 110,
  topo: 300,
  base: 380,
};

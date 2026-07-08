export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectType = {
  title: string;
  desc: string;
  image: ImageAsset;
};

export type MethodStep = {
  n: string;
  title: string;
  description: string;
};

export const images = {
  logoMark: {
    src: "/palma/palma-01.png",
    alt: "Palma",
    width: 551,
    height: 637,
  },
  heidiName: {
    src: "/palma/palma-02.png",
    alt: "Heidi Ignatov",
    width: 2058,
    height: 637,
  },
  studioGarden: {
    src: "/palma/palma-03.jpg",
    alt: "Patio y jardín residencial con área de estar exterior",
    width: 1920,
    height: 1275,
  },
  heroGarden: {
    src: "/palma/palma-04.jpg",
    alt: "Jardín residencial con piscina diseñado por Palma",
    width: 1920,
    height: 1275,
  },
  founders: {
    src: "/palma/palma-05.jpg",
    alt: "Isabella de Sousa y Heidi Ignatov",
    width: 1200,
    height: 800,
  },
  designTable: {
    src: "/palma/palma-06.jpg",
    alt: "Mesa de diseño paisajístico y proceso creativo de Palma",
    width: 1600,
    height: 1000,
  },
  residentialFront: {
    src: "/palma/palma-07.jpg",
    alt: "Proyecto de paisajismo residencial",
    width: 1600,
    height: 1063,
  },
  isabellaName: {
    src: "/palma/palma-08.png",
    alt: "Isabella de Sousa",
    width: 2659,
    height: 637,
  },
  logoFull: {
    src: "/palma/palma-09.png",
    alt: "Palma - Diseño de Paisajes con Sentido",
    width: 1730,
    height: 637,
  },
  verticalGarden: {
    src: "/palma/palma-10.jpg",
    alt: "Jardín residencial vertical",
    width: 1600,
    height: 2409,
  },
  planTexture: {
    src: "/palma/palma-11.jpg",
    alt: "Plano y textura de proyecto paisajístico",
    width: 1200,
    height: 1349,
  },
  ruralFlower: {
    src: "/palma/palma-12.jpg",
    alt: "Flor amarilla en paisaje rural",
    width: 1600,
    height: 2400,
  },
  corporateFlower: {
    src: "/palma/palma-13.jpg",
    alt: "Detalle floral en espacio exterior",
    width: 1600,
    height: 1067,
  },
  consultingFlower: {
    src: "/palma/palma-14.jpg",
    alt: "Flores y vegetación para consultoría paisajística",
    width: 1600,
    height: 1067,
  },
  hospitalityPlanting: {
    src: "/palma/palma-15.jpg",
    alt: "Plantación y cuidado de espacios exteriores",
    width: 1200,
    height: 1200,
  },
  residentialTrees: {
    src: "/palma/palma-16.jpg",
    alt: "Arbolado y jardín residencial",
    width: 1600,
    height: 1067,
  },
  terraceWater: {
    src: "/palma/palma-17.jpg",
    alt: "Agua y vegetación para balcones y terrazas",
    width: 1200,
    height: 1200,
  },
  developmentWater: {
    src: "/palma/palma-18.jpg",
    alt: "Paisaje de agua para desarrollos residenciales",
    width: 1600,
    height: 1067,
  },
} satisfies Record<string, ImageAsset>;

export const projectTypes: ProjectType[] = [
  {
    title: "Balcones y terrazas verdes",
    desc: "Paisajismo para espacios urbanos reducidos.",
    image: images.terraceWater,
  },
  {
    title: "Patios y jardines residenciales de todas las escalas",
    desc: "Jardines pensados para cada forma de habitar y cada escala.",
    image: images.residentialTrees,
  },
  {
    title: "Jardines rurales, casas de campo y paisajes de gran escala",
    desc: "Propuestas que dialogan con el paisaje y las condiciones del entorno.",
    image: images.ruralFlower,
  },
  {
    title: "Diseño paisajístico para barrios privados y desarrollos residenciales",
    desc: "Diseño de espacios comunes con identidad y continuidad paisajística.",
    image: images.developmentWater,
  },
  {
    title: "Espacios exteriores para empresas y entornos corporativos",
    desc: "Espacios exteriores que acompañan la dinámica y la imagen institucional.",
    image: images.corporateFlower,
  },
  {
    title: "Paisajismo para áreas industriales y logísticas",
    desc: "Paisajismo funcional para entornos productivos y de circulación.",
    image: images.planTexture,
  },
  {
    title: "Diseño exterior para hotelería, gastronomía y espacios de encuentro",
    desc: "Atmósferas que invitan a permanecer.",
    image: images.hospitalityPlanting,
  },
  {
    title: "Consultoría paisajística para estudios de arquitectura",
    desc: "Asesoramiento y acompañamiento paisajístico en las distintas etapas del proyecto.",
    image: images.consultingFlower,
  },
];

export const typeProcessSteps = [
  {
    title: "Relevamiento del espacio",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  },
  {
    title: "Propuesta de diseño",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
  },
  {
    title: "Ejecución y acompañamiento",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.",
  },
];

export const methodSteps: MethodStep[] = [
  {
    n: "01",
    title: "Diagnóstico y escucha",
    description:
      "Visitamos el lugar y observamos su entorno: orientación, suelo, clima, vegetación y modos de habitar el espacio. Conocemos la arquitectura, las líneas del paisaje y su escala; investigamos la historia y los orígenes del sitio, y escuchamos los gustos y necesidades del cliente. Este diagnóstico es la base sobre la que se construye el proyecto.",
  },
  {
    n: "02",
    title: "Anteproyecto",
    description:
      "Traducimos lo escuchado en una propuesta de diseño. Presentamos planos, croquis y referencias que permiten comprenderla y visualizarla. Es una instancia de diálogo, intercambio y ajustes para construir una visión compartida.",
  },
  {
    n: "03",
    title: "Proyecto ejecutivo",
    description:
      "Desarrollamos la documentación técnica con las especificaciones necesarias para la ejecución: planos, detalles constructivos, materialidades, iluminación, riego y plantación. Todo lo necesario para llevar el proyecto a la obra.",
  },
  {
    n: "04",
    title: "Dirección de obra",
    description:
      "Coordinamos y supervisamos la ejecución del proyecto, acompañando cada etapa del proceso. Gestionamos proveedores, materiales y logística, procurando que cada decisión y cada detalle respeten fielmente la propuesta de diseño.",
  },
  {
    n: "05",
    title: "Seguimiento y mantenimiento",
    description:
      "El jardín madura y evoluciona con el tiempo, y requiere cuidados y atención para desarrollarse plenamente. Acompañamos a nuestros clientes y capacitamos a quienes estarán a cargo de su mantenimiento, para preservar y acompañar su desarrollo.",
  },
];

export const contactOptions = [
  ["", "Seleccioná una opción"],
  ["balcon", "Balcón o terraza"],
  ["patio", "Patio o jardín residencial"],
  ["rural", "Jardín rural o campo"],
  ["barrio", "Barrio privado o desarrollo"],
  ["corporativo", "Espacio corporativo"],
  ["industrial", "Área industrial o logística"],
  ["hoteleria", "Hotelería o gastronomía"],
  ["consultoria", "Consultoría de arquitectura"],
  ["otro", "Otro"],
] as const;

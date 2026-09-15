export type ProductVisual = 'drone' | 'component' | 'digital' | 'board' | 'module';

export type Product = {
  slug: string;
  name: string;
  category: string;
  kind: 'FÍSICO' | 'DIGITAL';
  price: string;
  description: string;
  image?: '/dron.png' | '/product.jpeg';
  imageAlt?: string;
  visual: ProductVisual;
  availability: string;
  details: string[];
};

export const products: Product[] = [
  {
    slug: 'mavic-pro',
    name: 'Mavic Pro',
    category: 'DRONES',
    kind: 'FÍSICO',
    price: 'S/ 3,490',
    description: 'Cámara 4K, 27 min de vuelo y un formato que cabe en la mochila.',
    image: '/dron.png',
    imageAlt: 'Dron Mavic Pro gris',
    visual: 'drone',
    availability: 'EN STOCK · ENTREGA EN 24 H',
    details: ['Cámara 4K estabilizada', '27 min de vuelo', 'Alcance de 7 km'],
  },
  {
    slug: 'xt60-connector-set',
    name: 'XT60 Connector Set',
    category: 'COMPONENTES',
    kind: 'FÍSICO',
    price: 'S/ 24',
    description: 'Conectores de alta corriente para baterías, controladores y tus próximos prototipos.',
    image: '/product.jpeg',
    imageAlt: 'Conector XT60 dorado',
    visual: 'component',
    availability: 'EN STOCK · ENTREGA EN 24 H',
    details: ['10 pares de conectores', 'Corriente continua: 60 A', 'Carcasa de nylon resistente'],
  },
  {
    slug: 'starter-flight-plans',
    name: 'Starter Flight Plans',
    category: 'RECURSOS',
    kind: 'DIGITAL',
    price: 'S/ 19',
    description: 'Planos, lista de piezas y configuraciones base para iniciar tu proyecto FPV.',
    visual: 'digital',
    availability: 'DESCARGA INMEDIATA',
    details: ['8 planos en PDF', 'Lista de piezas editable', 'Configuraciones de vuelo base'],
  },
  {
    slug: 'frame-lab-5',
    name: 'Frame Lab 5”',
    category: 'FPV',
    kind: 'FÍSICO',
    price: 'S/ 169',
    description: 'Un chasis de carbono limpio, rígido y listo para construir alrededor de tu cámara.',
    visual: 'board',
    availability: 'EN STOCK · ENTREGA EN 48 H',
    details: ['Fibra de carbono 3K', 'Compatible con hélices de 5 pulgadas', 'Incluye tornillería'],
  },
  {
    slug: 'maker-sensor-kit',
    name: 'Maker Sensor Kit',
    category: 'ARDUINO',
    kind: 'FÍSICO',
    price: 'S/ 129',
    description: 'Sensores, cables y piezas esenciales para pasar de la curiosidad al primer circuito.',
    visual: 'module',
    availability: 'EN STOCK · ENTREGA EN 24 H',
    details: ['12 módulos de sensores', 'Cables Dupont incluidos', 'Guía de primeros proyectos'],
  },
  {
    slug: 'signal-notes-vol-01',
    name: 'Signal Notes Vol. 01',
    category: 'RECURSOS',
    kind: 'DIGITAL',
    price: 'S/ 12',
    description: 'Una colección de esquemas, referencias y notas para pensar mejor tus prototipos.',
    visual: 'digital',
    availability: 'DESCARGA INMEDIATA',
    details: ['32 páginas de referencia', 'Esquemas en alta resolución', 'Archivo PDF descargable'],
  },
];

export const featuredProducts = products.slice(0, 3);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

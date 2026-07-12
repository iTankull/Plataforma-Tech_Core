import { Product, Review } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'keychron-k2',
    name: 'Keychron K2 Pro',
    category: 'Keyboard',
    price: 689.00,
    rating: 4.8,
    originalLink: 'https://www.keychron.com/products/keychron-k2-pro-qmk-via-wireless-mechanical-keyboard',
    description: 'Teclado mecânico sem fio compacto (75%) com switches Keychron K Pro pré-lubrificados, keycaps PBT double-shot e retroiluminação RGB de alta intensidade. Excelente para digitação e produtividade.',
    image: 'https://cdn.shopify.com/s/files/1/0059/0630/1017/files/Keychron-K2-wireless-mechanical-keyboard-3.jpg?v=1691568464',
    specs: {
      'Layout': 'ANSI / ISO QMK/VIA',
      'Switches': 'Keychron K Pro Brown (Tátil)',
      'Conexão': 'Bluetooth 5.1 / Cabo Type-C',
      'Bateria': '4000 mAh (Até 300 horas)',
      'Compatibilidade': 'macOS / Windows / Linux'
    },
    stock: 3,
    observations: 'Seminovo; excelente estado; sem marcas de uso; na caixa original com cabo USB-C.'
  },
  {
    id: 'gmmk-pro',
    name: 'Glorious GMMK Pro 75%',
    category: 'Keyboard',
    price: 1899.00,
    rating: 4.9,
    originalLink: 'https://www.gloriousgaming.com/products/gmmk-pro-75-barebone-black',
    description: 'Teclado mecânico barebone premium de montagem em junta (gasket mount) com chapa de alumínio usinado CNC, knob rotativo codificado e iluminação lateral exclusiva.',
    image: 'https://microless.com/cdn/products/a88e5b066c5294740e2200d3c0d39da7-hi.jpg',
    specs: {
      'Material': 'Alumínio Usinado CNC',
      'Layout': '75% Layout US',
      'Montagem': 'Gasket Mount',
      'Knob': 'Rotativo Totalmente Programável',
      'Iluminação': 'RGB Per-Key & Side Diffused'
    },
    stock: 1,
    observations: 'Novo; lacrado na caixa original; switches e keycaps não inclusos (versão barebone).'
  },
  {
    id: 'sony-a6400',
    name: 'Sony Alpha a6400 Mirrorless',
    category: 'Câmeras',
    price: 5499.00,
    rating: 4.7,
    originalLink: 'https://www.sony.com.br/electronics/cameras-lentes-amoviveis/ilce-6400',
    description: 'Câmera digital Mirrorless avançada com sensor APS-C de 24.2 MP, foco automático ultra-rápido de 0.02s com Real-time Eye AF, gravação de vídeo em 4K HDR e tela LCD articulada inclinável a 180° para vlogging.',
    image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6324/6324859ld.jpg',
    specs: {
      'Sensor': '24.2 MP APS-C Exmor CMOS',
      'Processador': 'BIONZ X',
      'Vídeo': '4K UHD @ 30fps / 1080p @ 120fps',
      'Foco': '425 pontos de detecção de fase',
      'Tela': 'Touchscreen LCD de 3" articulada'
    },
    stock: 1,
    observations: 'Seminovo; marcas leves de uso estético no corpo; sensor 100% limpo; acompanha bateria e carregador original.'
  },
  {
    id: 'canon-r50',
    name: 'Canon EOS R50 Mirrorless',
    category: 'Câmeras',
    price: 4599.00,
    rating: 4.6,
    originalLink: 'https://www.canon.com.br/produtos/produtos-para-voce/cameras/linha-eos-r/eos-r50',
    description: 'Câmera compacta ideal para criadores de conteúdo ativos, com autofoco Dual Pixel CMOS AF II inteligente que detecta pessoas, animais e veículos, gravação de vídeos em 4K sem cortes e conectividade impecável.',
    image: 'https://www.bhphotovideo.com/images/images1500x1500/canon_eos_r50_with_rf_s_1748812.jpg',
    specs: {
      'Sensor': '24.2 MP APS-C CMOS',
      'Foco': 'Dual Pixel CMOS AF II',
      'Vídeo': '4K @ 30fps (Oversampled de 6K)',
      'Conexão': 'Wi-Fi / Bluetooth / USB-C',
      'Peso': '375g (Extremamente leve)'
    },
    stock: 2,
    observations: 'Seminovo; na caixa original; pouquíssimos disparos; marcas sutis de uso no case.'
  },
  {
    id: 'apple-watch-s9',
    name: 'Apple Watch Series 9 GPS',
    category: 'Smartwatches',
    price: 3299.00,
    rating: 4.9,
    originalLink: 'https://www.apple.com/br/apple-watch-series-9/',
    description: 'O relógio inteligente mais poderoso do mundo agora traz o novo chip S9, tela Retina Sempre Ativa de até 2000 nits, recurso revolucionário de Toque Duplo sem tocar na tela e inteligência de saúde avançada.',
    image: 'https://www.apple.com/newsroom/images/2023/09/apple-introduces-the-advanced-new-apple-watch-series-9/article/Apple-Watch-S9-silver-aluminum-Solo-Loop-olive-230912_inline.jpg.large_2x.jpg',
    specs: {
      'Processador': 'Chip S9 SiP de 64 bits',
      'Tela': 'Retina Sempre Ativa (Até 2000 nits)',
      'Sensores': 'Oxigênio, ECG, Temperatura, Sensor Cardíaco',
      'Resistência': 'À prova d\'água (50m) e poeira IP6X',
      'Bateria': 'Até 18 hours de uso normal'
    },
    stock: 1,
    observations: 'Novo e Lacrado; garantia de fábrica ativa; acompanha pulseira esportiva estelar original.'
  },
  {
    id: 'galaxy-watch-6',
    name: 'Samsung Galaxy Watch6 Classic',
    category: 'Smartwatches',
    price: 1999.00,
    rating: 4.8,
    originalLink: 'https://www.samsung.com/br/watches/galaxy-watch/galaxy-watch6-classic-47mm-black-lte-sm-r965fzkazto/',
    description: 'O clássico está de volta com uma coroa giratória física refinada e uma tela 20% maior. Oferece análise detalhada de sono, medição de composição corporal por bioimpedância e monitoramento de pressão arterial.',
    image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6546/6546710cv11d.jpg',
    specs: {
      'Sistema': 'Wear OS powered by Samsung',
      'Material': 'Caixa em Aço Inoxidável',
      'Tela': 'Super AMOLED de 1.5 polegadas',
      'Sensores': 'BioActive (Pressão, ECG, BIA)',
      'Diferencial': 'Coroa Rotativa Física'
    },
    stock: 2,
    observations: 'Excelente estado de conservação; bateria com 98% de saúde; marcas mínimas na coroa rotativa.'
  },
  {
    id: 'shure-mv7',
    name: 'Shure MV7 USB/XLR',
    category: 'Microfones',
    price: 1849.00,
    rating: 4.8,
    originalLink: 'https://www.shure.com/pt-BR/produtos/microfones/mv7',
    description: 'Inspirado no lendário SM7B, o Shure MV7 é um microfone dinâmico de alta fidelidade com conexões digitais USB e analógicas XLR. Possui tecnologia de isolamento de voz para gravações de estúdio limpas em qualquer ambiente.',
    image: 'https://www.bhphotovideo.com/images/images2500x2500/shure_mv7_k_podcast_microphone_1808586.jpg',
    specs: {
      'Tipo': 'Dinâmico',
      'Padrão Polar': 'Cardióide Unidirecional',
      'Conexão': 'Micro-B USB / XLR',
      'Resolução USB': '24-bit / 48 kHz',
      'Painel de Controle': 'Painel Touch Integrado de Ganho/Mute'
    },
    stock: 3,
    observations: 'Seminovo; na caixa com manuais; acompanha cabos USB e XLR originais; espuma pop filter nova.'
  },
  {
    id: 'blue-yeti',
    name: 'Logitech G Blue Yeti X',
    category: 'Microfones',
    price: 949.00,
    rating: 4.7,
    originalLink: 'https://www.bluemic.com/en-us/products/yeti-x/',
    description: 'O microfone USB definitivo para streamers e podcasters. Equipado com matriz de condensador de 4 cápsulas, medidor de LED em tempo real de alta definição e efeitos vocais avançados via software Blue VO!CE.',
    image: 'https://imageio.forbes.com/specials-images/imageserve/5dc802202c886a0007ebccf0/Box-shot-of-Blue-Yeti-X/0x0.jpg',
    specs: {
      'Tipo': 'Condensador de 4 Cápsulas',
      'Padrões Polares': 'Cardióide, Omnidirecional, Bidirecional, Estéreo',
      'Taxa de Amostragem': '24-bit / 48 kHz',
      'Conexão': 'Micro-USB Plug and Play',
      'Software': 'Integração Blue VO!CE / G HUB'
    },
    stock: 1,
    observations: 'Marcas de uso moderadas no acabamento da base; funcionamento acústico perfeito; acompanha cabo USB genérico.'
  },
  {
    id: 'sony-xm5',
    name: 'Sony WH-1000XM5 ANC',
    category: 'Headset & Headphones',
    price: 2199.00,
    rating: 4.9,
    originalLink: 'https://www.sony.com.br/electronics/headband-headphones/wh-1000xm5',
    description: 'Os headphones premium WH-1000XM5 redefinem o cancelamento de ruído e a qualidade de áudio sem fio. Apresentam dois processadores controlando oito microfones, otimizador automático de cancelamento de ruído e chamadas cristalinas.',
    image: 'https://img.freepik.com/premium-photo/isolated-sony-wh-1000xm5-wireless-headphones-front-view-featuring-white-background-clean_655090-801083.jpg?w=2000',
    specs: {
      'Conexão': 'Bluetooth 5.2 / P2 (3.5mm)',
      'Bateria': 'Até 30 horas com ANC ativo / 38 horas desligado',
      'Codecs': 'SBC, AAC, LDAC (Hi-Res)',
      'Tecnologias': 'DSEE Extreme, Speak-to-Chat, 360 Reality Audio',
      'Peso': '250g'
    },
    stock: 2,
    observations: 'Excelente estado; case rígido de viagem original incluso; espumas higienizadas, macias e sem desgastes.'
  },
  {
    id: 'lg-ultragear-34',
    name: 'LG UltraGear 34" IPS Curvo',
    category: 'Monitores Portáteis',
    price: 2899.00,
    rating: 4.6,
    originalLink: 'https://www.lg.com/br/monitores/lg-34wp550-b',
    description: 'Aumente seu campo de visão e mergulhe em seus jogos e conteúdos favoritos com este monitor ultra-amplo em formato 21:9. Possui painel IPS de fidelidade extrema com HDR10 e taxa de atualização fluida.',
    image: 'https://www.lg.com/content/dam/channel/wcms/ca_en/images/monitors/34g600a-b/gallery/ultragear-gaming-34g600a-2025-gallery-zoom-05.jpg',
    specs: {
      'Tamanho da Tela': '34 Polegadas UltraWide (21:9)',
      'Painel': 'IPS com 99% sRGB',
      'Resolução': '2560 x 1080 (WFHD)',
      'Atualização': '75 Hz com AMD FreeSync',
      'Entradas': '2x HDMI, Entrada de Fone de Ouvido'
    },
    stock: 1,
    observations: 'Excelente estado de conservação; zero dead pixels; acompanha fonte original e cabo DisplayPort.'
  },
  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro 2',
    category: 'Earbuds',
    price: 1899.00,
    rating: 4.9,
    originalLink: 'https://www.apple.com/br/airpods-pro/',
    description: 'Cancelamento Ativo de Ruído até duas vezes melhor, Transparência Adaptativa e Áudio Espacial Personalizado com rastreamento dinâmico da cabeça.',
    image: 'https://i.pinimg.com/736x/42/d3/90/42d390c9c7c43e13810c9f6ffef4933d.jpg',
    specs: {
      'Estojo de recarga': 'MagSafe com alto-falante e entrada para cordão',
      'Chip': 'Apple H2',
      'Bateria': 'Até 6 horas de áudio com apenas uma carga',
      'Resistência': 'Resistente a suor e água (IPX4)'
    },
    stock: 4,
    observations: 'Novo e Lacrado na caixa original; modelo homologado pela Anatel; estojo de carregamento com USB-C.'
  },
  {
    id: 'mx-master-3s',
    name: 'Logitech MX Master 3S',
    category: 'Mouse',
    price: 649.00,
    rating: 4.8,
    originalLink: 'https://www.logitech.com/pt-br/products/mice/mx-master-3s.910-006557.html',
    description: 'Mouse sem fio ergonômico de alta performance com cliques discretos e sensor de 8.000 DPI que rastreia em qualquer superfície, até mesmo vidro.',
    image: 'https://www.bhphotovideo.com/images/fb/logitech_910_006556_mx_master_3s_black_1703320.jpg',
    specs: {
      'Sensor': 'Darkfield de alta precisão de 8k DPI',
      'Botões': '7 botões personalizáveis com scroll inteligente MagSpeed',
      'Conexão': 'Bluetooth Low Energy ou receptor Logi Bolt',
      'Bateria': 'Até 70 dias com carga completa'
    },
    stock: 2,
    observations: 'Seminovo; marcas sutis de uso na borracha lateral; acompanha dongle USB Logi Bolt original.'
  },
  {
    id: 'steam-deck-oled',
    name: 'Steam Deck OLED 512GB',
    category: 'Consoles Portáteis',
    price: 4899.00,
    rating: 4.9,
    originalLink: 'https://store.steampowered.com/steamdeck',
    description: 'O PC portátil definitivo para jogos agora vem com tela HDR OLED de 7.4" de 90Hz, bateria com duração de até 50% maior e Wi-Fi 6E ultrarrápido.',
    image: 'https://www.pcworld.com/wp-content/uploads/2023/11/Steam-Deck-OLED-screen.jpg?quality=50https://images.unsplash.com/photo-1669837401587-f9a4cdf3126e?auto=format&fit=crop&q=80&w=600strip=all',
    specs: {
      'Tela': '7.4" HDR OLED 90Hz 1000 nits',
      'Processador': 'APU AMD de 6 nm (Zen 2 + RDNA 2)',
      'Armazenamento': '512GB NVMe SSD de alta velocidade',
      'Bateria': '50 Wh (Até 12 horas de jogo)'
    },
    stock: 1,
    observations: 'Novo, aberto apenas para conferência física; película protetora de vidro aplicada; estojo oficial incluso.'
  },
  {
    id: 'timemore-c3',
    name: 'Moedor Manual Timemore Chestnut C3',
    category: 'Utilitários para Café',
    price: 389.00,
    rating: 4.7,
    originalLink: 'https://www.timemore.com/products/timemore-chestnut-c3-manual-coffee-grinder',
    description: 'Moedor manual de café de alta precisão com rebarbas cônicas de aço S2C 660 exclusivas. Ajuste ponto a ponto para espresso, coados e prensa francesa.',
    image: 'https://lazenskakava.s24.cdn-upgates.com/_cache/7/6/76038ad422b9040ffecfd2e5e32b6a7d-timemore-c3-esp.webp',
    specs: {
      'Material': 'Alumínio de aviação e rebarbas de aço inox',
      'Capacidade': 'Aproximadamente 25g de grãos',
      'Rebarba': 'S2C 660 patenteada de 38mm',
      'Design': 'Padrão xadrez antiderrapante elegante'
    },
    stock: 3,
    observations: 'Seminovo; usado pouquíssimas vezes; totalmente higienizado; acompanha sacola de veludo e pincel originais.'
  },
  {
    id: 'catan-game',
    name: 'Catan: Edição de Luxo 3D',
    category: 'Board Games',
    price: 1899.00,
    rating: 4.8,
    originalLink: 'https://www.catan.com/',
    description: 'A ilha de Catan ganha vida como nunca antes! Esta bela edição especial apresenta modelos tridimensionais detalhados de cada peça pintados à mão de forma impecável.',
    image: 'https://c1-ebgames.eb-cdn.com.au/merchandising/images/packshots/029383a438be4af1a18f6defaae26a58_Original.jpg',
    specs: {
      'Componentes': '19 terrenos hexadecimais 3D pintados, cidades e estradas em resina detalhada',
      'Jogadores': '3 a 4 jogadores',
      'Duração': '60 a 90 minutos',
      'Idade recomendada': 'A partir de 10 anos'
    },
    stock: 1,
    observations: 'Novo e Lacrado; edição especial de colecionador extremamente rara no Brasil; caixa em perfeito estado.'
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'keychron-k2',
    username: 'Felipe Neves',
    rating: 5,
    comment: 'Melhor teclado que já tive! O feedback tátil do switch Brown é perfeito para quem passa o dia programando. A bateria dura semanas com os LEDs desligados.',
    createdAt: '2026-06-15T14:32:00.000Z'
  },
  {
    id: 'rev-2',
    productId: 'keychron-k2',
    username: 'Mariana Costa',
    rating: 4,
    comment: 'Excelente qualidade de construção e keycaps lindíssimas. Sinto falta apenas de um descanso de pulso na caixa, pois ele é um pouco alto.',
    createdAt: '2026-06-20T10:15:00.000Z'
  },
  {
    id: 'rev-3',
    productId: 'sony-a6400',
    username: 'Thiago M.',
    rating: 5,
    comment: 'O autofoco nos olhos é simplesmente mágico! Comprei para fazer vlogs e gravação de cursos e a qualidade em 4K é de outro mundo.',
    createdAt: '2026-05-12T18:45:00.000Z'
  },
  {
    id: 'rev-4',
    productId: 'apple-watch-s9',
    username: 'Juliana P.',
    rating: 5,
    comment: 'O gesto de toque duplo ajuda demais quando estou com as mãos ocupadas carregando compras. A tela sob o sol do meio-dia é super visível. Vale cada centavo!',
    createdAt: '2026-07-01T09:20:00.000Z'
  },
  {
    id: 'rev-5',
    productId: 'shure-mv7',
    username: 'Rodrigo Podcast',
    rating: 5,
    comment: 'Uso a saída USB conectada diretamente ao computador e os resultados do app ShurePlus Motiv são impecáveis. Elimina totalmente o eco do meu quarto sem tratamento acústico.',
    createdAt: '2026-06-28T21:10:00.000Z'
  },
  {
    id: 'rev-6',
    productId: 'sony-xm5',
    username: 'Aline Souza',
    rating: 5,
    comment: 'O isolamento é absurdo. Consigo trabalhar ao lado de uma avenida movimentada sem ouvir nada. É confortável ao ponto de eu esquecer que estou usando por 6 horas consecutivas.',
    createdAt: '2026-07-04T15:40:00.000Z'
  },
  {
    id: 'rev-7',
    productId: 'lg-ultragear-34',
    username: 'Bruno Tech',
    rating: 4,
    comment: 'O espaço extra de tela mudou minha produtividade, consigo deixar 3 janelas de código abertas lado a lado perfeitamente. Apenas as caixas de som integradas deixam um pouco a desejar.',
    createdAt: '2026-06-11T11:05:00.000Z'
  }
];

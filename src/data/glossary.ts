export const GLOSSARY: Record<string, string> = {
  'qmk/via': 'Software de código aberto que permite remapear qualquer tecla e criar macros avançadas diretamente no teclado.',
  'gasket mount': 'Método de montagem onde a placa interna é suspensa por tiras de espuma/borracha, proporcionando digitação mais flexível, macia e acústica refinada.',
  'pbt': 'Plástico premium de altíssima durabilidade. Não desgasta, não fica brilhante com o tempo e oferece sensação tátil áspera agradável.',
  'double-shot': 'Método de fabricação em duas camadas de plástico injetado para garantir que as letras nunca apaguem ou descasquem com o uso.',
  'rgb': 'Iluminação personalizável com suporte a milhões de cores e múltiplos efeitos visuais dinâmicos integrados.',
  'ansi': 'Padrão americano de layout físico de teclas (caracterizado pelo botão Enter retangular e horizontal).',
  'iso': 'Padrão europeu/internacional de layout físico de teclas (caracterizado pelo botão Enter grande em formato de "L" invertido).',
  'barebone': 'Teclado que vem pré-montado com placa e estrutura eletrônica, mas sem switches e keycaps, permitindo personalização total pelo usuário.',
  'mirrorless': 'Câmera moderna que não utiliza espelho reflexivo interno, resultando em corpo mais leve, autofoco mais rápido e visualização digital em tempo real.',
  'aps-c': 'Sensor de câmera de formato recortado (crop) de nível profissional. Excelente equilíbrio entre profundidade de campo, nitidez e portabilidade.',
  'cmos': 'Sensor de imagem ativo de alta velocidade que captura luz de forma altamente eficiente, consumindo pouca bateria e reduzindo ruídos visuais.',
  'eye af': 'Tecnologia inteligente baseada em IA que detecta e rastreia em tempo real os olhos das pessoas ou animais para foco impecável em retratos e vídeos.',
  'uhd': 'Ultra High Definition (Altíssima Definição), resolução de altíssima qualidade de imagem (geralmente 3840x2160 pixels).',
  '4k': 'Resolução de vídeo ou imagem com aproximadamente 4000 pixels de largura horizontal, oferecendo nitidez 4x maior do que o Full HD comum.',
  'fps': 'Frames Per Second (Quadros por Segundo). Mede a fluidez de um vídeo: quanto maior o valor, mais suave é a gravação (ex: 60fps ou 120fps para câmera lenta).',
  'dual pixel': 'Sistema de autofoco ultrarrápido proprietário da Canon onde cada pixel individual do sensor faz foco e capta imagem simultaneamente.',
  'oversampled': 'Técnica de capturar o vídeo em resolução superior do sensor (como 6K) e reescalar para 4K, eliminando ruídos e garantindo máxima definição.',
  'ecg': 'Eletrocardiograma (ECG): Recurso que registra os impulsos elétricos do coração para detectar possíveis irregularidades de ritmo cardíaco.',
  'nits': 'Unidade que mede o brilho/luminância máxima da tela. Quanto maior o valor, melhor é a visibilidade da tela sob sol forte de meio-dia.',
  'ip6x': 'Grau máximo de certificação contra infiltração de poeira e partículas finas de sujeira.',
  'ip68': 'Classificação de resistência que garante proteção total contra poeira e contra submersão contínua em água doce (geralmente até 1.5 metros por 30min).',
  'mah': 'Miliampere-hora (mAh). Unidade que mede a capacidade de armazenamento de energia de uma bateria. Quanto maior, maior é a autonomia do dispositivo.',
  'cnc': 'Controle Numérico Computadorizado. Processo mecânico de alta tecnologia que esculpe blocos maciços de alumínio para acabamento perfeito e sem emendas.',
  'bluetooth': 'Protocolo de comunicação sem fio de curto alcance otimizado para baixíssimo consumo de energia e transmissão ágil de áudio e comandos.',
  'type-c': 'Conector físico de padrão reversível de última geração que entrega taxas de dados ultrarrápidas e recarga elétrica inteligente de alta voltagem.',
  'switches': 'Mecanismos de acionamento mecânico individuais sob cada tecla, ditando o som (clique audível, silencioso, linear) e a pressão física ao digitar.',
  'dpi': 'Dots Per Inch (Pontos por Polegada). Determina o nível de sensibilidade de leitura do sensor físico do mouse: mais DPI equivale a mais velocidade de cursor.',
  'latência': 'O atraso de tempo medido em milissegundos entre uma ação física do usuário e sua renderização de resposta no display. Menor é melhor.',
  'ips': 'Tecnologia de tela de alta fidelidade cromática que oferece cores vibrantes e ângulo de visão amplo de 178 graus sem alteração de tonalidade.',
  'hz': 'Hertz (Hz). Taxa de atualização de tela: indica quantas vezes por segundo o display redesenha a imagem. 120Hz ou superior traz extrema fluidez.',
  'dac': 'Conversor de Áudio Digital para Analógico. Chip de processamento sonoro responsável por transformar sinais binários de áudio em som de alta fidelidade para fones.',
  'anc': 'Active Noise Cancelling (Cancelamento Ativo de Ruído). Tecnologia inteligente de microfones invertidos que neutraliza ruídos ambientais externos.',
  'keycaps': 'As tampas plásticas superiores que cobrem cada tecla mecânica. Variam em material (ABS ou PBT) e altura de perfil (OEM, Cherry, XDA, etc.).',
  'macose': 'Excelente suporte nativo de integração com sistemas operacionais computacionais da Apple.'
};

/**
 * Procura por um termo ou sigla técnica dentro de um texto e retorna a explicação correspondente se encontrar.
 */
export function findGlossaryTerm(text: string): { term: string; explanation: string } | null {
  if (!text) return null;
  const normalizedText = text.toLowerCase().trim();
  
  // Procura correspondência direta exata
  for (const [term, explanation] of Object.entries(GLOSSARY)) {
    if (normalizedText === term) {
      return { term, explanation };
    }
  }

  // Procura correspondência parcial no início ou no fim do texto ou palavra inclusa
  for (const [term, explanation] of Object.entries(GLOSSARY)) {
    // Evita falsos positivos curtos como 'hz', '4k' no meio de outras palavras compridas
    if (term.length <= 3) {
      const words = normalizedText.split(/[\s/\-()]+/);
      if (words.includes(term)) {
        return { term, explanation };
      }
    } else {
      if (normalizedText.includes(term)) {
        return { term, explanation };
      }
    }
  }

  return null;
}

# Tech_Core // Marketplace de Tecnologia

Plataforma de marketplace e outlet moderna para entusiastas de tecnologia e entusiastas de hardware de alta performance. O **Tech_Core** reúne periféricos de ponta (como teclados mecânicos customizados), câmeras profissionais, smartwatches de última geração e equipamentos de áudio premium com foco em experiência de usuário imersiva, design refinado de estilo "Cosmic Slate" e responsividade excelente.

---

## 🚀 Principais Recursos e Funcionalidades

### 1. Glossário Técnico & Tooltips Informativos
*   **Decodificador de Siglas**: Integrado diretamente ao catálogo e detalhes de especificações.
*   **Informação sob Demanda**: Elementos técnicos, perfis ou siglas como `QMK/VIA`, `Gasket Mount`, `PBT`, `Double-Shot`, `CMOS`, `Eye AF` e `IP68` exibem um balão explicativo dinâmico (com animação suave) ao passar o cursor ou ao receber foco do usuário.
*   **Interatividade**: Facilita a compreensão de especificações técnicas complexas sem sobrecarregar a interface.

### 2. Painel de Usuário & Histórico de Compras
*   **Perfil Completo**: Drawer deslizante acessível pelo avatar do usuário com status de *Cliente VIP*.
*   **Controle de Fundos Fictícios**: Adicione saldo fictício de forma instantânea para realizar testes e simulações na loja.
*   **Histórico Consolidado**: Seção dedicada de rastreio de compras anteriores contendo:
    *   ID do pedido (`TC-XXXXXX`).
    *   Data e hora exata da transação simulada.
    *   Itens adquiridos com imagens, quantidades e preços unitários.
    *   Modo e endereço/ponto de entrega selecionados na finalização da compra.
    *   Armazenamento persistente no cache local (`localStorage`).

### 3. Filtros e Pesquisa Ultra-Responsivos (Mobile & Tablet)
*   **Filtro Adaptativo**: Área redesenhada exclusivamente para dispositivos móveis e tablets que permite busca instantânea e navegação por categorias em carrossel horizontal com arraste suave (*smooth scroll snap*).
*   **Ordenação e Favoritos**: Acesso rápido a mouses, teclados, smartwatches e câmeras, filtragem instantânea por favoritos do usuário e ordenação de relevância ou preços direto da barra adaptativa.

### 4. Apresentação Visual Consistente
*   **Imagens Nítidas e Coloridas**: As imagens dos produtos mantêm sua saturação e cores originais de fábrica a todo momento (com zoom sutil no hover), evitando a falsa impressão de falta de estoque gerada pelo filtro preto e branco antigo.
*   **Tema Moderno Cosmic**: Estrutura em tons escuros refinados, realces laranjas vibrantes (`#FF3E00`) e tipografia mono-espaçada inspirada em terminais industriais.

### 5. Checkout Seguro Simulado
*   **Opções de Logística**: Escolha entre entrega via Correios/Sedex com inserção de dados postais ou retirada programada em pontos físicos estratégicos.
*   **Validação de Saldo**: O sistema calcula automaticamente os 45% de desconto de revenda do outlet e garante a dedução apenas caso haja fundos suficientes na carteira fictícia do usuário.

---

## 🛠️ Stack Tecnológica

*   **Framework**: [React 19](https://react.dev/) com [Vite](https://vite.dev/)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animações**: [Motion](https://motion.dev/) (antigo Framer Motion)
*   **Ícones**: [Lucide React](https://lucide.dev/)

---

## 📦 Estrutura de Arquivos

```bash
├── src/
│   ├── components/
│   │   ├── Tooltip.tsx         # Componente explicativo flutuante
│   │   ├── ProfileDrawer.tsx   # Painel lateral do perfil do usuário e histórico de compras
│   │   ├── ProductCard.tsx     # Card individual de exibição dos produtos
│   │   ├── ProductModal.tsx    # Modal de detalhes ricos e avaliação
│   │   ├── CartDrawer.tsx      # Carrinho de compras dinâmico
│   │   ├── CheckoutView.tsx    # Tela de pagamento simulado e entrega
│   │   └── AuthModal.tsx       # Sistema de login e criação de contas fictícias
│   ├── data/
│   │   ├── glossary.ts         # Base de dados de termos técnicos (Glossário)
│   │   └── products.ts         # Banco de produtos e depoimentos default
│   ├── App.tsx                 # Core da aplicação e gerenciador de estados
│   ├── main.tsx                # Entrada principal da renderização React
│   ├── types.ts                # Definições estritas de interfaces TypeScript
│   └── index.css               # Folha de estilos globais e tema Tailwind
├── index.html                  # Template HTML5 principal
├── package.json                # Dependências, scripts e configurações npm
└── metadata.json               # Configurações de metadados do AI Studio
```

---

## 💻 Instalação e Execução Local

1.  **Clone o projeto** para seu ambiente local.
2.  **Instale as dependências** recomendadas:
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
4.  Abra o navegador no endereço indicado (geralmente [http://localhost:3000](http://localhost:3000)).

---

*Desenvolvido com carinho para o ecossistema de demonstração e simulação de varejo inteligente.*

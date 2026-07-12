const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state variable
code = code.replace(
  "const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);",
  "const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);\n  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(6000);"
);

// 2. Add filter logic
code = code.replace(
  "// Sort Logic",
  "// Price Filter\n    if (maxPriceFilter < 6000) {\n      result = result.filter((p) => p.price <= maxPriceFilter);\n    }\n\n    // Sort Logic"
);

// 3. Clear filters reset (desktop and mobile)
code = code.replace(
  /setShowFavoritesOnly\(false\);\n\s*setSortBy\('default'\);/g,
  "setShowFavoritesOnly(false);\n                  setSortBy('default');\n                  setMaxPriceFilter(6000);"
);

// 4. Update welcome text
code = code.replace(
  "Seja bem-vindo ao meu catálogo pessoal de revendas de tecnologia! São itens em estado de novo, impecáveis ou de outlet, que adquiri e agora estou revendendo bem abaixo do valor original de mercado. Todos contam com o desconto padrão incrível de 45% já aplicado sobre o valor de referência original.",
  "Bem-vindo ao meu catálogo tech pessoal! Revenda de itens novos ou outlet com preços imbatíveis. Todos os produtos já estão com 45% de desconto flat sobre o valor original."
);

fs.writeFileSync('src/App.tsx', code);

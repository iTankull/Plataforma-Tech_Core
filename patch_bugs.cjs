const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix useMemo dependencies
code = code.replace(
  "}, [products, selectedCategory, showFavoritesOnly, searchQuery, favorites, sortBy]);",
  "}, [products, selectedCategory, showFavoritesOnly, searchQuery, favorites, sortBy, maxPriceFilter]);"
);

// 2. Fix the initial text again to be smaller
code = code.replace(
  "Bem-vindo ao meu catálogo tech pessoal! Revenda de itens novos ou outlet com preços imbatíveis. Todos os produtos já estão com 45% de desconto flat sobre o valor original.",
  "Catálogo pessoal de itens tech novos e outlet. Desconto de 45% já aplicado em todos os produtos."
);
code = code.replace(
  "Seja bem-vindo ao meu catálogo pessoal de revendas de tecnologia! São itens em estado de novo, impecáveis ou de outlet, que adquiri e agora estou revendendo bem abaixo do valor original de mercado. Todos contam com o desconto padrão incrível de 45% já aplicado sobre o valor de referência original.",
  "Catálogo pessoal de itens tech novos e outlet. Desconto de 45% já aplicado em todos os produtos."
);

// 3. Fix AnimatePresence wrapping
// We want to wrap the map with AnimatePresence, not the conditional, or at least put AnimatePresence inside the grid.
const oldGrid = `            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-bg-card border-2 border-dashed border-border-subtle p-8"
                >
                  <ShoppingBag className="w-12 h-12 text-text-dim mx-auto mb-4" />
                  <h4 className="font-sans font-black text-text-main text-lg uppercase tracking-widest mb-2">NENHUM PRODUTO ENCONTRADO</h4>
                  <p className="text-text-muted text-xs font-mono leading-relaxed max-w-sm mx-auto mb-6">
                    A pesquisa atual não retornou resultados no banco de dados. Modifique as palavras-chave ou limpe as categorias selecionadas.
                  </p>
                  <button
                    id="btn-empty-reset"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todas');
                      setShowFavoritesOnly(false);
                  setSortBy('default');
                  setMaxPriceFilter(6000);
                    }}
                    className="px-5 py-3 bg-[#FF3E00] hover:bg-[#ff551f] text-white text-[10px] font-black tracking-widest uppercase"
                  >
                    EXIBIR TODOS OS PRODUTOS
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  id="products-grid-container"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                >
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(product.id, e)}
                      onClickDetails={() => setSelectedProduct(product)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>`;

const newGrid = `            {filteredAndSortedProducts.length === 0 ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 bg-bg-card border-2 border-dashed border-border-subtle p-8"
                >
                  <ShoppingBag className="w-12 h-12 text-text-dim mx-auto mb-4" />
                  <h4 className="font-sans font-black text-text-main text-lg uppercase tracking-widest mb-2">NENHUM PRODUTO ENCONTRADO</h4>
                  <p className="text-text-muted text-xs font-mono leading-relaxed max-w-sm mx-auto mb-6">
                    A pesquisa atual não retornou resultados no banco de dados. Modifique as palavras-chave ou limpe as categorias selecionadas.
                  </p>
                  <button
                    id="btn-empty-reset"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todas');
                      setShowFavoritesOnly(false);
                      setSortBy('default');
                      setMaxPriceFilter(6000);
                    }}
                    className="px-5 py-3 bg-[#FF3E00] hover:bg-[#ff551f] text-white text-[10px] font-black tracking-widest uppercase"
                  >
                    EXIBIR TODOS OS PRODUTOS
                  </button>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div
                id="products-grid-container"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
              >
                <AnimatePresence>
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(product.id, e)}
                      onClickDetails={() => setSelectedProduct(product)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}`;

code = code.replace(oldGrid, newGrid);

fs.writeFileSync('src/App.tsx', code);

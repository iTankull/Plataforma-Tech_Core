const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const desktopSlider = `
              {/* Desktop Price Slider */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] font-black tracking-widest text-text-dim uppercase block">PREÇO MÁX</label>
                  <span className="text-[10px] font-black text-[#FF3E00]">
                    {maxPriceFilter >= 6000 ? 'QUALQUER' : \`R$ \${maxPriceFilter.toLocaleString('pt-BR')}\`}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="6000" 
                  step="100"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#FF3E00] cursor-pointer"
                />
              </div>
`;

code = code.replace(
  "{/* Sort selector stylized */}",
  desktopSlider + "\n              {/* Sort selector stylized */}"
);

const mobileSlider = `
            {/* Mobile Price Slider */}
            <div className="w-full flex-1 flex flex-col justify-center border-t border-border-very-subtle sm:border-none sm:border-l sm:pl-3 pt-3 sm:pt-0">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-black tracking-widest text-text-dim uppercase">PREÇO MÁX</label>
                <span className="text-[10px] font-black text-[#FF3E00]">
                  {maxPriceFilter >= 6000 ? 'QUALQUER' : \`R$ \${maxPriceFilter.toLocaleString('pt-BR')}\`}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="6000" 
                step="100"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#FF3E00] cursor-pointer"
              />
            </div>
`;

// Mobile section replacement
// We find:
/*
            {/* Exhibition Order Selection *\/}
            <div className="relative flex-1">
*/
code = code.replace(
  "{/* Exhibition Order Selection */}",
  mobileSlider + "\n            {/* Exhibition Order Selection */}"
);

// We should also ensure clear filters resets price filter to 6000. Wait, we need to update the condition to show clear filters button.
// `(searchQuery || selectedCategory !== 'Todas' || showFavoritesOnly || sortBy !== 'default') && (`
// becomes `(searchQuery || selectedCategory !== 'Todas' || showFavoritesOnly || sortBy !== 'default' || maxPriceFilter < 6000) && (`

code = code.replace(
  /\(searchQuery \|\| selectedCategory !== 'Todas' \|\| showFavoritesOnly \|\| sortBy !== 'default'\) && \(/g,
  "(searchQuery || selectedCategory !== 'Todas' || showFavoritesOnly || sortBy !== 'default' || maxPriceFilter < 6000) && ("
);

fs.writeFileSync('src/App.tsx', code);

async function searchImage(query) {
  try {
    const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query + " product photography")}&t=h_&iar=images&iax=images&ia=images`);
    const html = await res.text();
    const match = html.match(/vqd="([^"]+)"/);
    if (!match) return null;
    const vqd = match[1];
    
    const imageRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query + " product photography")}&vqd=${vqd}`);
    const json = await imageRes.json();
    if (json && json.results && json.results.length > 0) {
      return json.results[0].image;
    }
  } catch (e) {}
  return null;
}

(async () => {
  const products = [
    "Keychron K2",
    "GMMK Pro keyboard",
    "Sony A6400 camera",
    "Canon EOS R50 camera",
    "Apple Watch Series 9",
    "Samsung Galaxy Watch 6",
    "Shure MV7 microphone",
    "Blue Yeti X",
    "Sony WH-1000XM5",
    "LG UltraGear 34",
    "AirPods Pro 2",
    "Logitech MX Master 3S",
    "Steam Deck OLED",
    "Timemore C3 manual grinder",
    "Catan board game"
  ];
  for (let p of products) {
    console.log(p + " ===> " + await searchImage(p));
  }
})();

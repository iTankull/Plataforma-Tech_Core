async function search(query) {
  try {
    const res = await fetch(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`);
    const data = await res.text();
    const matches = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g);
    // filter out common random photos by taking the first few and seeing if they make sense, 
    // or just take the first unique one.
    if (matches && matches.length > 0) {
      return matches[0] + '?auto=format&fit=crop&q=80&w=600';
    }
  } catch (e) {}
  return null;
}

(async () => {
  const queries = [
    "Keychron",
    "mechanical keyboard",
    "Sony A6400",
    "Canon camera",
    "Apple Watch",
    "Samsung Galaxy Watch",
    "Shure microphone",
    "Blue Yeti",
    "Sony WH-1000XM5",
    "LG UltraGear",
    "AirPods Pro",
    "Logitech MX Master",
    "Steam Deck",
    "coffee grinder manual",
    "Catan board game"
  ];
  for (let q of queries) {
    const url = await search(q);
    console.log(q + " ===> " + url);
  }
})();

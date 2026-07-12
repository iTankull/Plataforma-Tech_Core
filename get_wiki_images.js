async function getWikiImage(pageTitle) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`);
    const json = await res.json();
    if (json.thumbnail && json.thumbnail.source) {
      return json.thumbnail.source.replace(/\d+px-/, '800px-');
    }
  } catch (e) {}
  return null;
}

(async () => {
  const products = [
    "Computer_keyboard", "Sony_Alpha_6400", "Canon_EOS_R", "Apple_Watch", "Samsung_Galaxy_Watch", "Microphone",
    "Headphones", "Computer_monitor", "AirPods_Pro", "Computer_mouse", "Steam_Deck", "Coffee_grinder", "Catan"
  ];
  for (let p of products) {
    console.log(p + ": " + await getWikiImage(p));
  }
})();

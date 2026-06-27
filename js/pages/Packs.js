[
  {
    "name": "Sapphire Pack",
    "color": "#0070ff",
    "points": 15,
    "levels": [
      12345678,
      23456789,
      34567890
    ]
  },
  {
    "name": "Ruby Pack",
    "color": "#ff0000",
    "points": 25,
    "levels": [
      45678901,
      56789012
    ]
  },
  {
    "name": "Quantum Pack",
    "color": "#00ffcc",
    "points": 50,
    "levels": [
      67890123,
      78901234,
      89012345,
      90123456
    ]
  }
]
// Příklad jednoduchého Hash Routeru v čistém JavaScriptu
function handleRoute() {
    const path = window.location.hash || '#/';

    if (path === '#/') {
        renderLeaderboard();
    } else if (path === '#/packs') {
        renderPacks(); // Tato funkce vykreslí balíčky
    } else {
        render404();
    }
}

// Sledování změn v URL adrese
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

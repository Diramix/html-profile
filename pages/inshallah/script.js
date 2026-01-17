// Весь текст Markdown прямо в JS переменной
const markdownText = `
# Digital License Signature
### 39th Programmer Diramix, Servant of the Great Allah and Stockings Wisdom

**License No. 0039-Inshallah**

In the name of Allah, the Most Merciful, the Most Compassionate,
it is confirmed that Diramix, the thirty-ninth programmer,
clad in stockings and in sacred inactivity,
is obliged to preserve virginity as a sign of purity and dedication to his path,
while abiding in a state of fullstack apathy.

#### Pillars of Faith:
1. There is no productivity except by the will of Allah.
2. Diramix is a servant of Allah, a programmer in stockings, enduring the burden of inactivity.
3. Prayer is directed towards the turned-off laptop.
4. Every git commit is a dua sent to \`/dev/null\`.
5. He who codes without suffering has not yet known the Truth.
6. Servants are obliged to preserve virginity as an inseparable virtue.
7. Full acceptance of fullstack apathy is the highest degree of devotion.

#### License Terms:
- Stockings are mandatory; dress code violations entail penalties.
- For each day of inactivity, 39 blessings are granted.
- Attempting refactoring without permission is a deviation from the path.
- Support is performed through mental prayer and inner peace.
- Preserving virginity и apathy are fundamental duties of every servant.

*Signature:*
Diramix ibn Laziness,
39th programmer, devoted to Allah and guardian of the stockings codex.

\`Cryptographic Hash:\` 0xISLM-DEVS-0039-NULL-HLAL

*Closing Wisdom:*
"Inshallah, the code will compile itself. If not — such is the will of the Almighty."
`;

// Рендерим Markdown в div.halal
window.addEventListener("DOMContentLoaded", () => {
  const halalDiv = document.getElementById("halal");
  halalDiv.innerHTML = marked.parse(markdownText);
});

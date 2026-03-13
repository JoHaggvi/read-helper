function formatText(text) {
  const words = text.split(" ");
  return words.map(word => {
    if (word.length < 2) return word;
    return "<b>" + word.substr(0, 2) + "</b>" + word.substr(2);
  }).join(" ");
}

function processNode(el) {
  if (el.dataset && el.dataset.boldFormatted) return;
  if (el.dataset) el.dataset.boldFormatted = "true";

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    if (!text.trim()) return;

    const span = document.createElement("span");
    span.innerHTML = formatText(text);
    textNode.parentNode.replaceChild(span, textNode);
  });
}

function applyBoldFormatting() {
  document.querySelectorAll("p, td, h1, h2, h3, li").forEach(processNode);
}

applyBoldFormatting();

// Debounced observer - waits 500ms after changes stop before running
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyBoldFormatting, 500);
});

observer.observe(document.body, { childList: true, subtree: true });
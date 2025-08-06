const dataTemplate = document.querySelector("[data-template]");
const dataContainer = document.querySelector("[data-container]");
const searchInput = document.querySelector("[data-search]");

let quoteList = [];

function debounce(fun, delay = 1000) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fun(...args);
    }, delay);
  };
}

function handleSearchInput(value) {
  const searchValue = value.toLowerCase();
  quoteList.forEach((quotes) => {
    const isVisible =
      quotes.quote.toLowerCase().includes(searchValue) ||
      quotes.author.toLowerCase().includes(searchValue);
    quotes.element.classList.toggle("hide", !isVisible);
  });
}

const debounceSearch = debounce((e) => {
  handleSearchInput(e.target.value);
}, 1000);

searchInput.addEventListener("input", debounceSearch);

// Feth data
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    quoteList = data.map((quotes) => {
      const cardTemplate = dataTemplate.content.cloneNode(true).children[0];

      const quote = cardTemplate.querySelector("[data-quote]");
      const author = cardTemplate.querySelector("[data-author]");

      quote.textContent = quotes.message;
      author.textContent = quotes.author;

      dataContainer.append(cardTemplate);
      return {
        quote: quotes.message,
        author: quotes.author,
        element: cardTemplate
      };
    });
  });
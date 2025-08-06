const dailyQuoteElement = document.querySelector("[data-daily-quote]");
const dailyAuthorElement = document.querySelector("[data-daily-author]");
const dataTemplate = document.querySelector("[data-template]");
const dataContainer = document.querySelector("[data-container]");
const searchInput = document.querySelector("[data-search]");

// LIST
let quoteList = [];

async function loadPage() {
  await loadQuotesFetch();
  await showDailyQuote();
}
loadPage();

// DEBOUNCE -> FEWER REQUESTS MADE TO THE API
function debounce(fun, delay = 1200) {
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
}, 1200);

searchInput.addEventListener("input", debounceSearch);

// FETCH DATA -> API
async function loadQuotesFetch() {
  try {
    const res = await fetch("./data.json");

    if (!res.ok) {
      throw new Error("Erro ao carregar os dados");
    }

    const data = await res.json();

    quoteList = data.map((quotes) => {
      const cardTemplate = dataTemplate.content.cloneNode(true).children[0];

      const quote = cardTemplate.querySelector("[data-quote]");
      const author = cardTemplate.querySelector("[data-author]");

      quote.innerHTML = `<i class="ph ph-quotes"></i> ${quotes.message}`;
      author.textContent = `- ${quotes.author}`;

      dataContainer.append(cardTemplate);
      return {
        quote: quotes.message,
        author: quotes.author,
        element: cardTemplate,
      };
    });

    return data;
  } catch (error) {
    console.error("Error", error);
    dataContainer.innerHTML = `<p class="error-message"><i class="ph ph-bug-beetle"></i> Error: The server is currently suffer some bugs </p>`;
    return [];
  }
}

// QUOTE OF THE DAY - FUNCTION
async function showDailyQuote() {
  try {
    const quotes = quoteList;

    if (!quotes || quotes.length === 0) {
      dailyQuoteElement.textContent = "No quotes available today.";
      return;
    }

    const today = new Date().toLocaleDateString();
    const storedQuote = JSON.parse(localStorage.getItem("dailyQuote"));

    let dailyQuote;

    if (storedQuote && storedQuote.date === today) {
      dailyQuote = storedQuote.quote;
    } else {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      dailyQuote = quotes[randomIndex];
      localStorage.setItem(
        "dailyQuote",
        JSON.stringify({
          date: today,
          quote: dailyQuote,
        })
      );
    }

    dailyQuoteElement.textContent = `"${dailyQuote.message}"`;
    dailyAuthorElement.textContent = `- ${dailyQuote.author}`;
  } catch (error) {
    console.error("Error", error);
    dataContainer.innerHTML = `<p class="error-message"><i class="ph ph-bug-beetle"></i> Error: Quote of the Day can't be displayed due to a bug... Try again later. </p>`;
  }
}

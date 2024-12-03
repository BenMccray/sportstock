const NEWS_API_KEY = "50fae6fe05f54538b30bfdea7e438015";
const GNEWS_API_KEY = "353b7583fdd64138f31a0a6633a9cd9a";

async function getNewsStories(searchQuery) {
  // First api attempt need a date
  // free plan only allows 1 month of data
  let date = new Date();
  let fromDate = `${date.getFullYear()}-${date.getMonth()}-01}`;
  let currentDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?searchIn=title,description&language=en&q=${searchQuery}&from=${fromDate}&to=${currentDate}&apiKey=${NEWS_API_KEY}`
    );
    const data = await response.json();
    // if no results from newsapi, try gnews
    if (data.totalResults === 0) {
      try {
        const gnewsResponse = await fetch(
          `https://gnews.io/api/v4/search?q="${searchQuery}"&in=title,description&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`
        );
        const gnewsData = await gnewsResponse.json();
        // if no results from gnews, then we're SOL and return nothing
        if (gnewsData.totalArticles === 0) {
          return [];
        }
        return gnewsData;
      } catch (error) {
        console.error("Error fetching news stories:", error);
        return undefined;
      }
    }
    return data;
  } catch (error) {
    try {
      const gnewsResponse = await fetch(
        `https://gnews.io/api/v4/search?q="${searchQuery}"&in=title,description&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`
      );
      const gnewsData = await gnewsResponse.json();
      // if no results from gnews, then we're SOL and return nothing
      if (gnewsData.totalArticles === 0) {
        return undefined;
      }
      return gnewsData;
    } catch (error) {
      console.error("Error fetching news stories:", error);
      return undefined;
    }
  }
}

function displayNewsStories(newsStories) {
  // display news stories in player page
  const newsList = document.getElementById("news-list");
  newsStories.forEach((story) => {
    // Grab the needed data for each story
    const title = story.title;
    const description = story.description;
    const url = story.url;
    const imageSrc = story.urlToImage || story.image;

    // Create a news item element
    const newsListItem = document.createElement("li");
    const newsItemLink = document.createElement("a");
    const newsItemImage = document.createElement("img");
    const newsTextContainer = document.createElement("p");
    const newsItemTitle = document.createElement("h3");
    const newsItemDescription = document.createElement("span");

    // Set the attributes and text content for each element
    newsItemLink.href = url;
    newsItemImage.src = imageSrc;
    newsItemImage.alt = title;
    newsItemTitle.textContent = title;
    newsItemDescription.textContent = description;

    // Set the classes for each element
    const newsListItemClasses = [
      "border-green-400",
      "border-4",
      "rounded-lg",
      "w-50",
      "mx-auto",
      "my-2",
      "hover:border-green-700",
      "sm:w-full",
      "sm:mx-1",
      "sm:my-2",
      "p-4",
      "text-white",
      // text color
    ];
    const newsItemLinkClasses = ["flex", "flex-row"];
    const newsTextContainerClasses = ["flex", "flex-col", "m-6"];
    const newsItemTitleClasses = ["text-lg", "font-bold"];
    const newsItemDescriptionClasses = ["text-sm"];
    const newsItemImageClasses = ["w-40", "h-40", "rounded-lg"];

    newsListItem.classList.add(...newsListItemClasses);
    newsItemLink.classList.add(...newsItemLinkClasses);
    newsTextContainer.classList.add(...newsTextContainerClasses);
    newsItemTitle.classList.add(...newsItemTitleClasses);
    newsItemDescription.classList.add(...newsItemDescriptionClasses);
    newsItemImage.classList.add(...newsItemImageClasses);

    // Append the elements to the news list item
    newsTextContainer.appendChild(newsItemTitle);
    newsTextContainer.appendChild(newsItemDescription);
    imageSrc ? newsItemLink.appendChild(newsItemImage) : null;
    newsItemLink.appendChild(newsTextContainer);
    newsListItem.appendChild(newsItemLink);

    // Add the news list item to the news list
    newsList.appendChild(newsListItem);
  });
}

function displayNoStories() {
  const noStories = document.createElement("p");
  noStories.textContent = "No news stories";
  document.querySelector("#news-list").appendChild(noStories);
}

(async function () {
  const searchQuery = sessionStorage.getItem("searchQuery");
  const newsStories = await getNewsStories(searchQuery);
  // display news stories in player page
  newsStories ? displayNewsStories(newsStories.articles) : displayNoStories();
})();

/**
 * TODO: display news stories in player page
 * TODO: list them in a scrollable div, if too much make pagination
 * TODO: make each a link to outside url
 * TODO: if no stories, display "No news stories found"
 * TODO: saves specific story?
 */

const NEWS_API_KEY = "50fae6fe05f54538b30bfdea7e438015";
const GNEWS_API_KEY = "353b7583fdd64138f31a0a6633a9cd9a";

async function getNewsStories(searchQuery) {
  // First api attempt need a date
  // free plan only allows 1 month of data
  let date = new Date();
  let fromDate = `${date.getFullYear()}-${date.getMonth()}-01}`;
  let currentDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  try {
    const response = await fetch(`https://site.web.api.espn.com/apis/search/v2?query=${searchQuery.name}&limit=15`)
    const data = await response.json();
    return data;
  } catch (error) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=sports&country=us&q=+${encodeURIComponent(searchQuery.name)}&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      // if no results from newsapi, try gnews
      if (data.totalResults === 0) {
        try {
          const gnewsResponse = await fetch(
            `https://gnews.io/api/v4/top-headlines?category=sports&q="${searchQuery.name}"&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`
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
      return data;
    } catch (error) {
      try {
        const gnewsResponse = await fetch(
          `https://gnews.io/api/v4/top-headlines?category=sports&q="${searchQuery.name}"&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`
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
}

function displayNewsStories(newsStories) {
  // display news stories in player page
  const newsList = document.getElementById("news-list");
  newsStories.forEach((story) => {
    // Grab the needed data for each story
    const title = story.title || story.displayName;
    const description = story.description || "";
    const url = story.url || story.link.web;
    const imageSrc = story.urlToImage || story.image || story.images[0].url;

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
      "hover:border-green-700",
      "lg:w-full",
      "w-3/4",
      "my-2",
      "mx-auto",
      "p-4",
      "text-white",
      // text color
    ];
    const newsItemLinkClasses = ["flex", "lg:flex-row", "flex-col"];
    const newsTextContainerClasses = ["flex", "flex-col", "m-6"];
    const newsItemTitleClasses = ["text-lg", "font-bold"];
    const newsItemDescriptionClasses = ["text-sm"];
    const newsItemImageClasses = ["w-600", "h-40", "rounded-lg"];

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
  const classes = ["text-center", "text-4xl", "my-16", "text-white"]
  const backClasses = ["flex", "justify-center", "text-white", "items-center"]
  const backArrow = document.createElement("button");
  backArrow.id = "back-arrow"
  backArrow.addEventListener("click", () => history.back())
  const arrow = document.createElement("img");
  arrow.classList.add("filter", "brightness-0", "invert")
  const goBack = document.createElement("span")
  arrow.src = "../../images/arrow_left.png";
  arrow.alt = "go back";
  goBack.textContent = "Return to last page";
  backArrow.appendChild(arrow);
  backArrow.appendChild(goBack);
  noStories.classList.add(...classes)
  backArrow.classList.add(...backClasses)
  noStories.textContent = "No news stories";
  const list = document.querySelector("#news-list")
  list.appendChild(noStories);
  list.appendChild(backArrow);
  
}

(async function () {
  const searchQuery = JSON.parse(sessionStorage.getItem("searchQuery"));
  console.log(searchQuery)
  const newsStories = await getNewsStories(searchQuery);
  // display news stories in player page
  console.log(newsStories)
  if (newsStories.resultTypes) {
    console.log(searchQuery.name.split(" ")[1])
    let articles = newsStories.results[1].contents.filter(article => article.displayName.includes(searchQuery.name) 
                                                                  || (searchQuery.teamId && article.displayName.includes(searchQuery.name.split(" ")[1])));
    
    newsStories.articles = articles
  }
  console.log(newsStories.articles)
  newsStories !== undefined && newsStories.articles.length > 0 ? displayNewsStories(newsStories.articles) : displayNoStories();
})();

/**
 * TODO: display news stories in player page
 * TODO: list them in a scrollable div, if too much make pagination
 * TODO: make each a link to outside url
 * TODO: if no stories, display "No news stories found"
 * TODO: saves specific story?
 */

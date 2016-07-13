# Hacker-News
https://agjozev.github.io/Hacker-News/

# About
This is a JavaScript application created in a learning process in a front end development learning project.
It is a news gathering application using the HackerNews API https://github.com/HackerNews/API .
The UI is mimicking the UI design from the experimental version of Hacker News Search https://blog.algolia.com/try-new-experimental-version-hn-search/,   adjusted for the HackerNews API.

## Description
The application has a header with search input field, side menu with news categories and main area where the news stories are shown in rows incorporating a small thumbnail picture, news title, source site,  points for the story, user who added the story, and time of the publishing.
By clicking on the title or the thumbnail picture, the original page of the story will be loaded. 

## Categories
On the side menu there are five categories of stories, which are based on the HackerNews API.
By clicking on a category you’ll get all the stories from that category on the main area arranged in pages, twenty stories per page. 

## Comments
Each story has a comments counter on the far right. 
By clicking on the counter all the comments for that story will be loaded underneath it.
To close the comments just click on the counter again.

## Share
Every story has a share button. This will share the original story page on to your Facebook timeline. There is a share icon in the header that will share this application on Facebook.

## Search
The search is done by writing a search text in the search input field and clicking on the search icon or hitting enter. The search is performed only in the active category.
The API doesn’t support search requests. The stories requests must be done individually for every story. This means that every search request must be done by individual requests for each story, comparing the title, user name and source site url to the searched text, so the time for the search to be done might take awhile.

## Offline 
While online, for every request for news stories, by clicking on a category or by sweeping thru the pages of the results the stories are stored in the browsers local storage. This means that when you are offline you will still have access to all the stories that were stored, get them thru their categories or perform searches. 


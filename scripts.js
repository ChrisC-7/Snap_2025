/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

let movies = [];
let currentMovies = [];

fetch('movies_v2.json')
  .then(res => res.json())
  .then(data => {
    movies = data;
    currentMovies = [...movies];
    renderMovies(currentMovies);
    populateGenreFilter();
    document.getElementById("searchInput").addEventListener("input", searchMovies);
  });
// let currentMovies = [...movies];

// document.addEventListener("DOMContentLoaded", () => {
//   renderMovies(currentMovies);
//   populateGenreFilter();
//   document.getElementById("searchInput").addEventListener("input", searchMovies);
// });

function renderMovies(movieList) {
  const container = document.getElementById("card-container");
  const template = document.getElementById("card-template");
  container.innerHTML = "";

  movieList.forEach((movie) => {
    const card = template.content.cloneNode(true);
    card.querySelector("h2").textContent = movie.name;
    card.querySelector("img").src = movie.image_url;
    card.querySelector("img").alt = `${movie.name} Poster`;
    card.querySelector(".movie-year").textContent = movie.year;
    card.querySelector(".movie-genre").textContent = Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre;
    card.querySelector(".movie-rating").textContent = movie.rating;

    // 如果你想加导演显示（你可以添加一个 <li><strong>Director:</strong> <span class="movie-director"></span></li> 到 HTML 中）
    card.querySelector(".movie-director").textContent = Array.isArray(movie.directors) ? movie.directors.join(", ") : movie.directors;

    const commentList = card.querySelector(".comment-list");
    if (!movie.comments) movie.comments = [];
    movie.comments.forEach(comment => {
      const li = document.createElement("li");
      li.textContent = comment;
      commentList.appendChild(li);
    });

    const textarea = card.querySelector(".comment-input");
    const commentBtn = card.querySelector(".comment-btn");
    commentBtn.addEventListener("click", () => {
      if (textarea.value.trim()) {
        movie.comments.push(textarea.value.trim());
        renderMovies(movieList);  // 重新渲染带评论
      }
    });

    container.appendChild(card);
  });
}

// function renderMovies(movieList) {
//   const container = document.getElementById("card-container");
//   const template = document.getElementById("card-template");
//   container.innerHTML = "";

//   movieList.forEach((movie) => {
//     const card = template.content.cloneNode(true);
//     card.querySelector("h2").textContent = movie.title;
//     card.querySelector("img").src = movie.image;
//     card.querySelector("img").alt = `${movie.title} Poster`;
//     card.querySelector(".movie-year").textContent = movie.year;
//     card.querySelector(".movie-genre").textContent = movie.genre;
//     card.querySelector(".movie-rating").textContent = movie.rating;

//     const commentList = card.querySelector(".comment-list");
//     movie.comments.forEach(comment => {
//       const li = document.createElement("li");
//       li.textContent = comment;
//       commentList.appendChild(li);
//     });

//     const textarea = card.querySelector(".comment-input");
//     const commentBtn = card.querySelector(".comment-btn");
//     commentBtn.addEventListener("click", () => {
//       if (textarea.value.trim()) {
//         movie.comments.push(textarea.value.trim());
//         renderMovies(currentMovies);
//       }
//     });

//     container.appendChild(card);
//   });
// }

// function populateGenreFilter() {
//   const genres = new Set(["all", ...movies.map(movie => movie.genre)]);
//   const filter = document.getElementById("genreFilter");
//   filter.innerHTML = "";
//   genres.forEach(genre => {
//     const option = document.createElement("option");
//     option.value = genre;
//     option.textContent = genre;
//     filter.appendChild(option);
//   });
// }

function populateGenreFilter() {
  const genreSet = new Set();
  movies.forEach(movie => {
    if (Array.isArray(movie.genre)) {
      movie.genre.forEach(g => genreSet.add(g));
    } else {
      genreSet.add(movie.genre);
    }
  });

  const filter = document.getElementById("genreFilter");
  filter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Genres";
  filter.appendChild(allOption);

  Array.from(genreSet).sort().forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    filter.appendChild(option);
  });
}


// function filterMovies() {
//   const genre = document.getElementById("genreFilter").value;
//   currentMovies = genre === "all" ? [...movies] : movies.filter(m => m.genre === genre);x
//   renderMovies(currentMovies);
// }

function filterMovies() {
  const genre = document.getElementById("genreFilter").value;
  currentMovies = genre === "all"
    ? [...movies]
    : movies.filter(m => Array.isArray(m.genre) && m.genre.includes(genre));
  renderMovies(currentMovies);
}
function searchMovies() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  currentMovies = movies.filter(m => m.name.toLowerCase().includes(term));
  renderMovies(currentMovies);
}

function sortByRating() {
  currentMovies.sort((a, b) => b.rating - a.rating);
  renderMovies(currentMovies);
}

function addMovie() {
  const name = document.getElementById("newTitle").value;
  const year = parseInt(document.getElementById("newYear").value);
  const genre = document.getElementById("newGenre").value;
  const rating = parseFloat(document.getElementById("newRating").value);
  const image_url = document.getElementById("newImage").value || "https://via.placeholder.com/300x450.png?text=No+Image";

  if (!title || !year || !genre || !rating) {
    alert("Please fill in all fields.");
    return;
  }

  const newMovie = { title, year, genre, rating, image, comments: [] };
  movies.push(newMovie);
  currentMovies = [...movies];
  renderMovies(currentMovies);
  populateGenreFilter();
}

function removeLastCard() {
  movies.pop();
  currentMovies = [...movies];
  renderMovies(currentMovies);
}

function quoteAlert() {
  alert("Here's looking at you, kid.");
}

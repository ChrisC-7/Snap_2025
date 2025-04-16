// define the vars that we gonna use
let movies = [];
let currentMovies = [];

//  get the data from the dataset
fetch('movies_v2.json')
  .then(res => res.json())
  .then(data => {
    movies = data; // original data
    currentMovies = [...movies]; // get all the movie 
    renderMovies(currentMovies); // show the movie cards
    populateGenreFilter(); // the menu 
    document.getElementById("searchInput").addEventListener("input", searchMovies);
  });


// the function for show the cards
function renderMovies(movieList) {
  const container = document.getElementById("card-container");
  const template = document.getElementById("card-template");
  container.innerHTML = ""; // clear the cards now 

  movieList.forEach((movie) => {
    const card = template.content.cloneNode(true); // copy the template
    card.querySelector("h2").textContent = movie.name;
    card.querySelector("img").src = movie.image_url;
    card.querySelector("img").alt = `${movie.name} Poster`;
    card.querySelector(".movie-year").textContent = movie.year;
    card.querySelector(".movie-genre").textContent = Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre;
    card.querySelector(".movie-rating").textContent = movie.rating;
    card.querySelector(".movie-director").textContent = Array.isArray(movie.directors) ? movie.directors.join(", ") : movie.directors;
 
    // show the comments that we have now 
    const commentList = card.querySelector(".comment-list");
    if (!movie.comments) movie.comments = []; // store in the comments array
    movie.comments.forEach(comment => {
      const li = document.createElement("li");
      li.textContent = comment;
      commentList.appendChild(li);
    });

    // button for add new comment
    const textarea = card.querySelector(".comment-input");
    const commentBtn = card.querySelector(".comment-btn");
    commentBtn.addEventListener("click", () => {
      if (textarea.value.trim()) {
        movie.comments.push(textarea.value.trim());
        renderMovies(movieList);  // show the card again to show the new comment
      }
    });

    container.appendChild(card); 
  });
}

// the option for the menu
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

  // make each genre as options 
  Array.from(genreSet).sort().forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    filter.appendChild(option);
  });
}

function filterMovies() {
  const genre = document.getElementById("genreFilter").value;
  currentMovies = genre === "all"
    ? [...movies]
    : movies.filter(m => Array.isArray(m.genre) && m.genre.includes(genre));
  renderMovies(currentMovies);
}

// search movie
function searchMovies() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  currentMovies = movies.filter(m => m.name.toLowerCase().includes(term));
  renderMovies(currentMovies);
}

// sort by the rating
function sortByRating() {
  currentMovies.sort((a, b) => b.rating - a.rating);
  renderMovies(currentMovies);
}

// add new movie data 
function addMovie() {
  const name = document.getElementById("newTitle").value;
  const year = parseInt(document.getElementById("newYear").value);
  const genre = document.getElementById("newGenre").value;
  const rating = parseFloat(document.getElementById("newRating").value);
  const image_url = document.getElementById("newImage").value || "https://via.placeholder.com/300x450.png?text=No+Image";

  // check if the information enough
  if (!name || !year || !genre || !rating) {
    alert("Please fill in all fields.");
    return;
  }

  // create new object for movie
  const newMovie = {
    name,
    year,
    genre: genre.split(',').map(g => g.trim()),  
    rating,
    image_url,
    directors: ["Unknown"], 
    comments: []
  };
  // add the object to the array 
  movies.push(newMovie);
  currentMovies = [...movies];
  renderMovies(currentMovies);
  populateGenreFilter();
}

// delete the last movie card
function removeLastCard() {
  movies.pop();
  currentMovies = [...movies];
  renderMovies(currentMovies);
}

function quoteAlert() {
  alert("Here's looking at you, kid.");
}

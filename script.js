
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const messageElement = document.querySelector("#message");
const movieResults = document.querySelector("#movie-results");
const movieDetails = document.querySelector("#movie-details");
const backButton = document.querySelector("#back-button");
const API_KEY = "YOUR_OMDB_API_KEY"; // Replace with your actual OMDb API key

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
     
    const movieName = searchInput.value.trim();
     movieDetails.innerHTML = "";
    if (movieName === "") {
        messageElement.textContent = "Please enter a movie name.";
        movieResults.innerHTML = "";
        return;
    }

    movieResults.innerHTML = "";
    messageElement.textContent = `Searching for "${movieName}"...`;
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movieName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                messageElement.textContent = `Found ${data.Search.length} results for "${movieName}".`;
                movieResults.innerHTML = "";
                data.Search.forEach(movie => {
                    const movieCard = document.createElement("div");
                    movieCard.classList.add("movie-card");
                    movieCard.innerHTML = `
                     ${movie.Poster && movie.Poster !== "N/A"
                            ? `<img src="${movie.Poster}" alt="${movie.Title}"
                            onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'), {
                            className: 'no-poster',
                            textContent: 'Poster unavailable'
                            }))">`
                            : `<div class="no-poster">No poster available</div>`
                        }
                    <h3>${movie.Title}</h3>
                    <p>Year: ${movie.Year}</p>
                    <p>Type: ${movie.Type}</p>
                `;
                    movieCard.style.cursor = "pointer";
                    movieCard.addEventListener("click", () => {
                        backButton.hidden = false;
                        movieResults.style.display = "none";
                        messageElement.textContent = `Loading details for "${movie.Title}"...`;
                        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.Response === "True") {
                                    const detailsCard = document.createElement("div");
                                    detailsCard.classList.add("movie-details-card");
                                    detailsCard.innerHTML = `
                                     <div class="details-poster">
                                     ${data.Poster && data.Poster !== "N/A"
                                            ? `<img src="${data.Poster}" alt="${data.Title} poster"
                                            onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'), {
                                            className: 'no-poster',
                                            textContent: 'Poster unavailable'
                                        }))">`
                                            : `<div class="no-poster">No poster available</div>`
                                        }
                                    </div>
                                    <div class="details-content">
                                    <h2>${data.Title}</h2>
                                    <div class="movie-meta">
                                    <span>${data.Year}</span>
                                    <span>${data.Runtime !== "N/A" ? data.Runtime : "Runtime unavailable"}</span>
                                    <span>${data.Rated !== "N/A" ? data.Rated : "Not rated"}</span>
                                    </div>
                                    <p class="rating">
                                    ⭐ IMDb Rating:
                                    <strong>${data.imdbRating !== "N/A" ? data.imdbRating + "/10" : "Not available"}</strong>
                                    </p>
                                    <h3>Overview</h3>
                                    <p class="plot">${data.Plot !== "N/A" ? data.Plot : "No plot available."}</p>
                                    <p><strong>Genre:</strong> ${data.Genre}</p>
                                    <p><strong>Actors:</strong> ${data.Actors}</p>
                                    <p><strong>Director:</strong> ${data.Director}</p>
                                    </div>
                                    `;
                                    movieDetails.appendChild(detailsCard);
                                    messageElement.textContent = `Details for "${data.Title}".`;    
                                }
                            });
                    });
                    movieResults.appendChild(movieCard);
                });
            } else {
                messageElement.textContent = data.Error || "No movies found.";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            messageElement.textContent =
                "Something went wrong. Please try again.";
        });
});


backButton.addEventListener("click", () => {
    backButton.hidden = true;
    movieDetails.innerHTML = "";
    messageElement.textContent = "";

    movieResults.style.display = "grid";
});







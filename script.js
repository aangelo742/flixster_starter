//constant variables
const keyMOVIEDB = "9d2ba48d06eb00bf14da15dd9e415e76";

//query selectors
let movie_form = document.querySelector("form");
let search_bar = document.getElementById('search_bar');
let movie_container = document.getElementById('movie_container');
let now_playing = document.getElementById("now_playing");

more_button = document.getElementById('more_button');

//global variables
let pageNumber = 1;
let totalPages;
let searchValue;
console.log("page is equal to: ", pageNumber);
let currentMovies = true;
let searchedMovies = false;

movie_form.addEventListener("submit", resetPage);
movie_form.addEventListener("submit", getSearchedMovies);
more_button.addEventListener("click", loadMoreMovies);

async function getCurrentMovies(evt) {
    currentMovies = true;
    searchedMovies = false;

    let apiURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + keyMOVIEDB + "&language=en-US&page=" + pageNumber;

    let response = await fetch(apiURL);

    responseData = await response.json();

    loadMovies(responseData);
}

function resetPage(){
    console.log("INSIDE RESET PAGE FUNCTION. PAGE NUMBER VALUE (OLD): ", pageNumber);
    pageNumber = 1;
    console.log("INSIDE RESET PAGE FUNCTION. PAGE NUMBER VALUE: ", pageNumber);
}

async function getSearchedMovies(evt) {
    
    console.log("Inside of the getSearchedMovies function");

    currentMovies = false;
    searchedMovies = true;

    evt.preventDefault();
    if(pageNumber == 1) {
        searchValue = evt.target.search_bar.value;
    }
    
    let apiURL = "https://api.themoviedb.org/3/search/movie?api_key=" + keyMOVIEDB + "&language=en-US&query=" + searchValue + "&page=" + pageNumber + "&include_adult=false";
    console.log("string search: ", searchValue);
    if(!searchValue) {
        console.log("nada");
        return;
    }

    now_playing.innerHTML = "Now showing movies containing: " + searchValue;

    while (movie_container.firstChild) {
        movie_container.removeChild(movie_container.firstChild);
    }

    let response = await fetch(apiURL);

    responseData = await response.json();
    
    loadMovies(responseData);

}

async function getMoreSearchedMovies(evt) {
    console.log("Inside of the getMoreSearched function");

    let apiURL = "https://api.themoviedb.org/3/search/movie?api_key=" + keyMOVIEDB + "&language=en-US&query=" + searchValue + "&page=" + pageNumber + "&include_adult=false";
    
    let response = await fetch(apiURL);

    responseData = await response.json();

    loadMovies(responseData);
}

function loadMoreMovies(){
    console.log(totalPages);
    pageNumber++;
    console.log(pageNumber);
    if(currentMovies){
        getCurrentMovies();
        console.log("current movies: ", currentMovies);
    } else if(searchedMovies) {
        getMoreSearchedMovies();
        console.log("searched movies: ", searchedMovies);
    }
 

}



function loadMovies(jsonData) {
    totalPages = `${jsonData.total_pages}`;
    totalPages = parseInt(totalPages);
    for(let i = 0; i < jsonData.results.length; i++) {
        let tempDiv = document.createElement('div');
        tempDiv.classList.add('movie-div');
        tempDiv.classList.add('box');

        let tempImage = document.createElement('img');
        tempImage.classList.add('poster-image');
        tempImage.src = "https://image.tmdb.org/t/p/w780" + `${jsonData.results[i].poster_path}`;

        let tempP = document.createElement('p');
        tempP.classList.add('movie-title');
        tempP.innerHTML = `${jsonData.results[i].title}`;

        tempDiv.append(tempImage);
        tempDiv.append(tempP);

        movie_container.appendChild(tempDiv);
    }
}



window.onload = function () {
    getCurrentMovies();
}
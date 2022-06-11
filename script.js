//constant variables
const keyMOVIEDB = "9d2ba48d06eb00bf14da15dd9e415e76";

//query selectors
let movie_form = document.querySelector("form");
let search_bar = document.getElementById('search_bar');
let movie_container = document.getElementById('movie_container');
let movie_wrapper = document.getElementById('movie_wrapper')
let now_playing = document.getElementById("now_playing");
let more_button = document.getElementById('more_button');
let top_button = document.getElementById('top_button');
let clear_button = document.getElementById('clear_button');

//information panel query selectors
let information_panel = document.getElementById('information_panel');
let information_title = document.getElementById('information_title');
let information_rating = document.getElementById('information_rating');
let information_body = document.getElementById('information_body');
let information_close = document.getElementById('information_close');
let information_image = document.getElementById('information_image');
let information_release_date = document.getElementById('information_release_date');

//global variables
let pageNumber = 1;
let totalPages;
let searchValue;
console.log("page is equal to: ", pageNumber);
let currentMovies = true;
let searchedMovies = false;
let lastLocation;

movie_form.addEventListener("submit", resetPage);
movie_form.addEventListener("submit", getSearchedMovies);
more_button.addEventListener("click", loadMoreMovies);
top_button.addEventListener("click", backToTop);
clear_button.addEventListener("click", refreshPage);
information_close.addEventListener("click", function(){
    information_panel.classList.add("hidden");
    movie_wrapper.classList.remove('hidden');
    more_button.classList.remove('hidden');
    top_button.classList.remove('hidden');
    document.documentElement.scrollTop = document.body.scrollTop = lastLocation;
    console.log(document.documentElement.scrollTop);

})

function refreshPage() {
    window.location.reload();
}

async function getCurrentMovies(evt) {
    search_bar.value = '';
    currentMovies = true;
    searchedMovies = false;

    let apiURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + keyMOVIEDB + "&language=en-US&page=" + pageNumber;
    console.log(apiURL);
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

    clear_button.classList.remove("hidden");

    currentMovies = false;
    searchedMovies = true;

    evt.preventDefault();
    if(pageNumber == 1) {
        searchValue = evt.target.search_bar.value;
    }
    
    let apiURL = "https://api.themoviedb.org/3/search/movie?api_key=" + keyMOVIEDB + "&language=en-US&query=" + searchValue + "&page=" + pageNumber + "&include_adult=false";
    console.log(apiURL);
    console.log("string search: ", searchValue);
    if(!searchValue) {
        console.log("nada");
        return;
    }

    now_playing.innerHTML = "Now Displaying: Movies Containing " + searchValue;

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
    if(pageNumber == totalPages) {
        more_button.classList.add('hidden');
    }
}

function backToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
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
        tempImage.alt = `Movie poster for ${jsonData.results[i].title}`;
        if(tempImage.src.includes("null")) {
            tempImage.src = "images/poster-not-available.jpg";
            console.log(tempImage.src);
        }

        tempDiv.onclick = function(event) {
            information_panel.classList.remove('hidden');

            information_title.innerHTML = `${jsonData.results[i].title}`;
            information_rating.innerHTML = `Rating: ${jsonData.results[i].vote_average}`;
            information_body.innerHTML = `${jsonData.results[i].overview}`;
            information_image.src = tempImage.src;
            information_image.alt = tempImage.alt;
            information_release_date.innerHTML = `${jsonData.results[i].release_date}`;
            lastLocation = document.documentElement.scrollTop;
            console.log(lastLocation);

            movie_wrapper.classList.add('hidden');
            more_button.classList.add('hidden');
            top_button.classList.add('hidden');
        }      

        let ratingStar = document.createElement('img');
        ratingStar.classList.add('star-icon');
        ratingStar.src = "images/star-icon.png";

        let tempP = document.createElement('p');
        tempP.classList.add('movie-title');
        tempP.innerHTML = `${jsonData.results[i].title}`;

        let ratingNum = ` ${jsonData.results[i].vote_average}`;
        let voteCount = `${jsonData.results[i].vote_count}`;

        if(ratingNum == 0 && voteCount == 0){
            ratingNum = " No votes found";
        }

        tempDiv.append(tempImage);
        tempDiv.append(ratingStar);
        tempDiv.append(ratingNum);
        tempDiv.append(tempP);
        

        movie_container.appendChild(tempDiv);
    }
}

window.onload = function () {
    getCurrentMovies();
}
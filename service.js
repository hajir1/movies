const submit = document.getElementById("submit");
const carouselWrapper = document.getElementById("carousel-wrapper");
const overlay = document.getElementById("overlay");
let loading = false;
let currentId = null;

const getData = () => {
  submit.addEventListener("click", () => {
    const search = document.getElementById("search").value;
    const yearInput = document.getElementById("yearInput").value;
    loading = true;

    const getDataMovies = async (cb) => {
      if (loading) {
        carouselWrapper.innerHTML = `<h1>Loading...</h1>`;
      }

      try {
        if (yearInput === "") {
          const response = await fetch(
            `http://omdbapi.com?apikey=7071dd1&s=${search}`
          );
          const data = await response.json();
          loading = false;
          cb(data);
        } else {
          const response = await fetch(
            `http://omdbapi.com?apikey=7071dd1&s=${search}&y=${yearInput}`
          );
          const data = await response.json();
          loading = false;
          cb(data);
        }
      } catch (error) {
        console.error(error);
        loading = false;
      }
    };

    getDataMovies((data) => {
      if (data.Search && data.Search.length > 0) {
        carouselWrapper.innerHTML = "";
        data.Search.forEach((item) => {
          carouselWrapper.innerHTML += `
            <div class="item" onclick="off('${item.imdbID}')">
              <p class="title">${item.Title}</p>
              <div class="content">
                <img src="${item.Poster}" alt="" />
                <p>Tahun Rilis: ${item.Year}</p>
                <p>Type: ${item.Type}</p>
              </div>
            </div>`;
        });
      } else {
        carouselWrapper.innerHTML = "<h1>No results found</h1>";
      }
    });
  });
};
getData();

const getDataById = async (id) => {
  if (currentId !== id) {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=7071dd1&i=${id}`
    );

    const data = await response.json();
    currentId = id;
    overlay.innerHTML = `<div class="container">
      <h1>${data.Title}</h1>
      <div class="content">
        <img src=${data.Poster} alt="" />
        <div class="middle">
          <p>rilis pada : ${data.Released}</p>
          <p>genre film : ${data.Genre}</p>
          <p>director : ${data.Director}</p>
          <p>writer : ${data.Writer}</p>
          <p>actors : ${data.Actors}</p>
          <p>Plot : ${data.Plot}</p>
          <p>bahasa : ${data.Language}</p>
          <p>negara : ${data.Country}</p>
          <p>awards : ${data.Awards}</p>
          <p>rating : ${data.imdbRating}</p>
        </div>
      </div>
    </div>`;
  }
};

const on = () => {
  overlay.style.display = "none";
};

const off = (id) => {
  if (currentId !== id) {
    getDataById(id);
  }
  overlay.style.display = "flex";
};

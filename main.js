const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movie = []
let filteredMovie = []
const MOVIES_PER_PAGE = 12
let status = ''
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const icon = document.querySelector('.icon')
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `<div class="col-sm-3" id="card">
                    <div class="mb-2">
                        <div class ="card">
                            <img src="${POSTER_URL + item.image}"
                                class="card-img-top" alt="Movie Poster" >
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                                    data-target="#movie-modal" data-id=${item.id}>More</button>
                                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                </div>`
  })
  dataPanel.innerHTML = rawHTML
  status = 'card'
}
function renderMovieListMod2(data) {
  let rawHTML = ``
  data.forEach(item => {
    rawHTML += `<div class="col-sm-12">
                    <div class="mb-1">
                        <div class ="list" data-tilt>
                            <div class="row">
                                <h5 class="card-title col-10">${item.title}</h5>
                                <div class="button col-2">
                                <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                                    data-target="#movie-modal" data-id=${item.id}>More</button>
                                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr size="8px" align="center" width="100%">`
  })
  dataPanel.innerHTML = rawHTML
  status = 'list'
}
function renderPaginator(amout) {
  const numberOFPages = Math.ceil(amout / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOFPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML

}
function getMoviesByPage(page) {
  const data = filteredMovie.length ? filteredMovie : movie
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)

}
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalData = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalData.innerText = "Release Date:  " + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" id="movie-fuid">`

  })
}
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  console.log(list)
  const movies = movie.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在電影清單中')
  }
  list.push(movies)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  console.log(localStorage.getItem('favoriteMovies'))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))

  }
})



searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  console.log(keyword)
  filteredMovie = movie.filter(movie => movie.title.toLowerCase().includes(keyword))
  if (filteredMovie.length === 0) {
    return alert(`Cannot find movies with keyword: ${keyword}`)
  }
  renderPaginator(filteredMovie.length)
  if (status === 'card') {
    renderMovieList(getMoviesByPage(1))
  } else if (status === 'list') {
    renderMovieListMod2(getMoviesByPage(1))
  }

})
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  if (status === 'card') {
    renderMovieList(getMoviesByPage(page))
  } else if (status === 'list') {
    renderMovieListMod2(getMoviesByPage(page))
  }
})
icon.addEventListener('click', function onIconClick(event) {
  console.log(event.target.parentElement)
  if (event.target.parentElement.matches('.card') || event.target.parentElement.matches('.fa-th')) {
    renderMovieList(getMoviesByPage(1))
  } else if (event.target.parentElement.matches('.list') || event.target.parentElement.matches('.fa-bar')) {
    renderMovieListMod2(getMoviesByPage(1))
  }

})
axios
  .get(`https://movie-list.alphacamp.io/api/v1/movies/`)
  .then((response) => {
    movie.push(...response.data.results)
    renderPaginator(movie.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))
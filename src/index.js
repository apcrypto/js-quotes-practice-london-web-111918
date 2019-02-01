const baseURL = 'http://localhost:3000/quotes'
const quoteList = document.querySelector('#quote-list')
const formEl = document.querySelector('#new-quote-form')
const quoteInputEl = document.querySelector('#new-quote')
const authorInputEl = document.querySelector('#author')
const submitBtn = document.querySelector('.btn-primary')
// let deleteBtns

const state = {
  quotes: []
}

// gets quote data from the db and puts it in state
const getQuotes = () => {
  return fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(quotes => {
      state.quotes = quotes
      console.log("data in state")
      // debugger
      renderAllQuotes()
    })
}

// itterates over quotes and like/delete buttons and invokes quote HTML and click handlers
const renderAllQuotes = () => {
  quoteList.innerHTML = ""
  state.quotes.forEach(quote => quoteInfo(quote))

  likeBtns = document.querySelectorAll('.btn-success')
  likeBtns.forEach(likeBtn => likeBtn.addEventListener('click', likeClickHandler))

  deleteBtns = document.querySelectorAll('.btn-danger')
  deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', deleteClickHandler))
}

// quote html
const quoteInfo = (quote) => {
  quoteList.innerHTML += `
  <li class='quote-card'>
     <blockquote class="blockquote">
       <p class="mb-0">${quote.quote}</p>
       <footer class="blockquote-footer">${quote.author}</footer>
       <br>
       <button data-id="${quote.id}" class='btn-success'>Likes: ${quote.likes}</button>
       <button data-id="${quote.id}" class='btn-danger'>Delete</button>
     </blockquote>
   </li>
   `
}

const deleteClickHandler = (event) => {
  const id = event.target.dataset.id
  const quote = state.quotes.find(quote => quote.id = id)
  deleteQuote(quote)
}

const likeClickHandler = (event) => {
  const id = event.target.dataset.id
  const quote = state.quotes.find(quote => quote.id == id)
  quote.likes++
  likeQuote(quote)
}

formEl.addEventListener('submit', (event) => {
	event.preventDefault()
	const quote = quoteInputEl.value
  const author = authorInputEl.value
  const likes = 0
  const formData = { quote, author, likes };
  createNewQuote(formData)
		formEl.reset()
})


// api stuff
const deleteQuote = (quote) => {
  return fetch(`http://localhost:3000/quotes/${quote.id}`,{
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quote)
  }).then(res => getQuotes())
}

const likeQuote = (quote) => {
  return fetch(`http://localhost:3000/quotes/${quote.id}`,{
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quote)
  }).then(res => getQuotes())
}

const createNewQuote = (formData) => {
  return fetch(`http://localhost:3000/quotes/`,{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
  }).then(res => getQuotes())
}

getQuotes()

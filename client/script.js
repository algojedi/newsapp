const info = document.getElementById('info')
const main = document.getElementById('main')
const numOfArticlesToDisplay = 7

const state = {
    cardFlipped: false,
    isLoading: false,
    // variables to track whether re-fetching is needed
    ca: false,
    au: false,
    us: false,
    in: false,
    gb: false
}

const flipCard = (element) => {
    const country = element.getAttribute('name')
    const parentElement = document.getElementById(country)
    console.log('parent element, ', parentElement)
    parentElement.classList.toggle('flipped')
    const cardName = parentElement.getAttribute('name')
    console.log('name given by flip card: ', cardName)
    getArticles(cardName)
}

const getArticles = (name) => {
    if (state[name]) {
        console.log('not reloading ', state[name])
        return 
    } 
    state[name] = true // indicates country info has been fetched
    console.log('name being passed to url: ', name)
    const url = `/main?id=${name}`

    const xhr = new XMLHttpRequest()
    console.log('about to make http req')
    xhr.open('GET', url, true)

    xhr.onprogress = function () {
        // info.innerHTML = '<p>...loading</p>'
        state.isLoading = true

    }
    xhr.onerror = function () {
        state.isLoading = false
        console.log('apparently there was a network error')
    }
    xhr.onload = function () {
        state.isLoading = false
        if (this.status == 200) {
            // console.log(this.responseText)
            console.log('made http req')
            const result = JSON.parse(this.responseText)
            const topArticles = result.filter((el, i) => {
                return i < numOfArticlesToDisplay
            })
            console.log({ topArticles })
            dispalyArticles(topArticles, name)
        }
    }
    xhr.send()
}

const dispalyArticles = (articles, name) => {
    if (!articles) return
    let toDisplay = ''
    articles.forEach((article) => {
        // console.log(article.urlToImage)
        toDisplay += ` 
        <div class="article"> 
            <div class='img-wrapper'>
                <img class="article-photo" src=${article.urlToImage}>
            </div>
            <a class='article-link' href=${article.url} target="_blank">
                <h2 class='article-title'>${article.title}</h2>
            </a> 
            <p class='article-desc'>${article.description}</p>
            <hr class='article-separator'>
        </div>
        `
    })
    // const cdaArticles = document.getElementById('cda-articles')
    const elementToFill = findElement(name)
    if (!elementToFill) return // TODO: assign error html to an element that displays errors
    elementToFill.innerHTML = toDisplay
    // cdaArticles.innerHTML = toDisplay
}

const findElement = (name) => {
    switch (name) {
        case 'ca':
            return document.getElementById('can-articles')
        case 'us':
            return document.getElementById('us-articles')
        case 'gb':
            return document.getElementById('uk-articles')
        case 'au':
            return document.getElementById('au-articles')
        case 'in':
            return document.getElementById('in-articles')
        default:
            return null
    }
}

// country codes: au, ca, us, gb, in

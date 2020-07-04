const info = document.getElementById('info')
const main = document.getElementById('main')
const numOfArticlesToDisplay = 7

const state = {
    hour: 40, // will be immediately updated upon news fetch
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
    parentElement.classList.toggle('flipped')
    const cardName = parentElement.getAttribute('name')
    getArticles(cardName)
}

const getArticles = (name) => {
    const currentHour = new Date().getHours()
    const hourChanged = Math.abs(currentHour - state.hour) > 0
    if (state[name] && !hourChanged) {
        // update news once an hour
        console.log('not reloading ', state[name])
        return 
    }
    state.hour = new Date().getHours() // update hour of last refresh

    state[name] = true // indicates country info has been fetched
    const url = `/main?id=${name}`

    const xhr = new XMLHttpRequest()
    console.log('about to make http req')
    xhr.open('GET', url, true)

    xhr.onprogress = function () {
        state.isLoading = true

    }
    xhr.onerror = function () {
        state.isLoading = false
        console.log('There was a network error')
    }
    xhr.onload = function () {
        state.isLoading = false
        if (this.status == 200) {
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
        toDisplay += ` 
        <div class="article"> 
            <div class='img-wrapper'>
                <div class='img-wrapper-inside'>
                    <img class="article-photo" alt="news article photo" src=${article.urlToImage}>
                </div>
            </div>
            <a class='article-link' href=${article.url} target="_blank">
                <h2 class='article-title'>${article.title}</h2>
            </a> 
            <p class='article-desc'>${article.description}</p>
            <hr class='article-separator'>
        </div>
        `
    })
    const elementToFill = findElement(name)
    if (!elementToFill) return // TODO: assign error html to an element that displays errors
    elementToFill.innerHTML = toDisplay
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

// gsap
const timeline = gsap.timeline({ defaults: { duration: .75 }})
timeline
      .from( '.header', { y: '-100%', ease: 'bounce' } )
      .from('.card_side--front', { opacity: 0, stagger: 0.25 })

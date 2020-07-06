// slight delay before showing animations
const body = document.getElementsByTagName('body')[0]
setTimeout(() => {
    body.style.opacity = 1
}, 400);

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
    gb: false,
    fr: false,
    de: false,
}


const flipCard = (element) => {

    if (element.tagName === 'IMG') {
        tlBack.timeScale(2)
        tlBack.delay(0)
        tlBack.reverse()
    }
    // add a delay to appreciate animation
    setTimeout(() => {
        const country = element.getAttribute('name')
        const parentElement = document.getElementById(country)
        parentElement.classList.toggle('flipped')
        const cardName = parentElement.getAttribute('name')
        getArticles(cardName)
    }, 500)
}

const getArticles = (name) => {
    const currentHour = new Date().getHours()
    const hourChanged = Math.abs(currentHour - state.hour) > 0
    if (state[name] && !hourChanged) {
        // update news once an hour
        return
    }
    state.hour = new Date().getHours() // update hour of last refresh

    state[name] = true // indicates country info has been fetched
    const url = `/main?id=${name}`
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)

    xhr.onprogress = function () {
        state.isLoading = true
        dispalyArticles(null, name)
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
            dispalyArticles(topArticles, name)
        }
    }
    xhr.send()
}

const dispalyArticles = (articles, name) => {
    const elementToFill = findElement(name)
    if (!elementToFill) return // TODO: assign error html to an element that displays errors
    if (!articles) {
        // articles have not yet loaded
        elementToFill.innerHTML = '<h3>...loading</h3>'
        return
    } 
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
        case 'fr':
            return document.getElementById('fr-articles')
        case 'de':
            return document.getElementById('de-articles')
        default:
            return null
    }
}

// ---------------  gsap
// tlFront for the front icons and tlBack for the back articles
const tlFront = gsap.timeline({ defaults: { duration: 1 } })
tlFront
    .from('.header', { y: '-100%', ease: 'bounce' })
    .from('.card_side--front', { opacity: 0, stagger: 0.15 }, '<.5')

tlBack = gsap.timeline({ defaults: { duration: 1 } })
tlBack.from('.card_side--back_articles', { opacity: 0, y: '-100%' })

const frontElements = document.querySelectorAll('.card_side--front')
frontElements.forEach((el) => {
    el.addEventListener('click', () => {
        // timeline.reversed() ? timeline.play() : timeline.reverse()
        tlBack.delay(1.5).timeScale(0.5).play(0.1)
    })
})

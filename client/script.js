const info = document.getElementById('info')
const main = document.getElementById('main')
const numOfArticlesToDisplay = 7

const state = {
    cardFlipped: false,
    isLoading: false,
}

const url = 'http://localhost:3001/main?id=ca'
const btnClicked = () => {
    console.log('clicked btn')
    info.innerHTML = 'john lennon'
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/main?id=au', true)

    xhr.onprogress = function () {
        info.innerHTML = '<p>...loading</p>'
    }
    xhr.onerror = function () {
        info.innerHTML = '<h4>What a shame.. there was an error of sorts</h4>'
    }
    xhr.onload = function () {
        if (this.status == 200) {
            console.log(this.responseText)
            displayResults(this.responseText)
        }
    }

    xhr.send()
}

// results is an array of article objects
const displayResults = (results) => {
    results.forEach((element) => {})
}

// ----------------- functionality for the cards in projects section
const cardClicked = (element) => {
    element.classList.toggle('flipped')
    console.log(element)
    console.log(element.getAttribute('name'))
    const cardName = element.getAttribute('name')
    getArticles(cardName)
}

const getArticles = (name) => {
    const url = `/main?id=${name}`
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)

    xhr.onprogress = function () {
        // info.innerHTML = '<p>...loading</p>'
        state.isLoading = true
    }
    xhr.onerror = function () {
        // info.innerHTML = '<h4>What a shame.. there was an error of sorts</h4>'
        state.isLoading = false
        return null
    }
    xhr.onload = function () {
        state.isLoading = false
        if (this.status == 200) {
            // console.log(this.responseText)
            const result = JSON.parse(this.responseText)
            const topArticles = result.filter((el, i) => {
                return i < numOfArticlesToDisplay
            })
            console.log(topArticles)
            dispalyArticles(topArticles, name)
        }
    }
    xhr.send()
}

const dispalyArticles = (articles, name) => {
    if (!articles) return
    let toDisplay = ''
    articles.forEach((article) => {
        console.log(article.urlToImage)
        toDisplay += ` 
        <div class="article"> 
            <img class="article-photo" src=${article.urlToImage}>
            <h2 class='article-title'>${article.title}</h2>
            <p class='article-date'>${article.publishedAt.slice(0, 10)}</p>
            <p class='article-desc'>${article.description}</p>
            <a class='article-btn-link' href=${article.url} target="_blank">Link to article</a> 
            <hr>
        </div>
        `
    })
    // const cdaArticles = document.getElementById('cda-articles')
    const elementToFill = findElement(name)
    if (!elementToFill) return // TODO: assign error html to an element that displays errors
    elementToFill.innerHTML = toDisplay
    // cdaArticles.innerHTML = toDisplay
}

const findElement = name => {
    switch (name) {
        case 'ca':
            return document.getElementById('can-articles') 
        case 'us':
            return document.getElementById('us-articles') 
        case 'uk':
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

const info = document.getElementById('info')
const main = document.getElementById('main')

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
const cardClicked = async (element) => {
    element.classList.toggle('flipped')
    console.log(element)
    console.log(element.getAttribute('name'))
    const cardName = element.getAttribute('name')
    const articles = await getArticles(cardName)
    console.log('response from getting articles.. ')
    console.log(articles)
    //   main.style.flexDirection = 'column'
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
            const results = filterResults(this.responseText)
        }
    }

    xhr.send()
}

const filterResults = (data) => {
    if (!data) console.log('there was an error filtering results')

    const filtered = data.filter((el) => {})
}

// country codes: au, ca, us, gb, in

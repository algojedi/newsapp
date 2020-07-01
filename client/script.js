const info = document.getElementById('info')

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
    xhr.onload = function(){
        if (this.status == 200) {
            console.log(this.responseText)
            displayResults(this.responseText)
        }

    }

    xhr.send()
}

// results is an array of article objects
const displayResults = (results) => {
    results.forEach(element => {
        
    });
}


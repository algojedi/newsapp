const express = require('express')
const router = express.Router()
const newsapi = require('newsapi')
const api = new newsapi(process.env.API_KEY)

// ----- news sources -----
const globalSrcs = [
    'CNN',
    'Bloomberg',
    'Buzzfeed',
    'Business Insider',
    'Entertainment Weekly',
    'The Verge',
    'Politico',
    'The Washington Post','CBS News','ABC News','CNBC', 'HuffPost', 'Fox News'
]
// const usSources = [...globalSrcs, 'The Washington Post','CBS News','ABC News','CNBC', 'HuffPost', 'Fox News']
const ukSources = [...globalSrcs, 'BBC News', 'Telegraph.co.uk','Daily Mail','Mirror Online']
const indiaSources = [...globalSrcs, 'The Times of India', 'The Tribune India', 'Hindustan Times']
const caSources = [...globalSrcs, 'CBC News', 'Ctvnews.ca',]
const auSources = [...globalSrcs, 'News.com.au', 'ABC News (AU)']
// const saSources = [...globalSrcs, 'News24'] // S Africa



router.get('/', async (req, res, next) => {
    let { id } = req.query
    console.log('the param is: ', id)
    if (!id) return res.status(422).send('parameter is required')

    try {
        const response = await api.v2.topHeadlines({
            // sources: 'bbc-news,the-verge',
            // sources: newsSources,
            // q: 'bitcoin',
            // category: 'business',
            language: 'en',
            country: id,
        })
          console.log(response.articles)
        const display = response.articles.filter((article) => {
            switch (id) {
                case 'us':
                    return true // no filtering of US articles
                case 'ca':
                    return caSources.includes(article.source.name)
                case 'au':
                    return auSources.includes(article.source.name)
                case 'gb':
                    return ukSources.includes(article.source.name)
                case 'in':
                    return indiaSources.includes(article.source.name)
                default:
                    throw new Error('invalid country code')
            }
        })
        res.json(display)
    } catch (err) {
        console.log(err)
        res.status(400).send(err.message)
    }
})

module.exports = router

// responses.articles array of objects:
// [ { source: { id: null, name: 'The Yucatan Times' },
//     author: 'Yucatan Times',
//     title:
//      'Penumbral Lunar Eclipse over the Yucatan July 4 - The Yucatan Times',
//     description:
//      '“A penumbral eclipse of the Moon will be recorded in the Yucatan Peninsula a, whose partiality will begin next Saturday, July 4, and will end at dawn on Sunday, 5th”, reported the Yucat…',
//     url:
//      'https://www.theyucatantimes.com/2020/06/penumbral-lunar-eclipse-over-the-yucatan-july-4/',
//     urlToImage:
//      'https://www.theyucatantimes.com/wp-content/uploads/2020/06/penumbral.jpg',
//     publishedAt: '2020-06-30T16:19:27Z',
//     content:
//      '“A penumbral eclipse of the Moon will be recorded in the Yucatan Peninsula a, whose partiality will begin next Saturday, July 4, and will end at dawn on Sunday, 5th”, reported the Yucatecan astronome… [+3340 chars]' },
//   { source: { id: null, name: 'Ctvnews.ca' },
//     author: null,
//     title:
//      'Air Canada ending service to 8 cities, suspending 30 regional routes - CTV News',
//     description:
//      'Air Canada is indefinitely suspending dozens of domestic flight routes as the airline struggles to fill seats during the COVID-19 pandemic.',
//     url:
//      'https://www.ctvnews.ca/business/air-canada-ending-service-to-8-cities-suspending-30-regional-routes-1.5005756',
//     urlToImage:
//      'https://www.ctvnews.ca/polopoly_fs/1.4923612.1590173240!/httpImage/image.jpg_gen/derivatives/landscape_620/image.jpg',

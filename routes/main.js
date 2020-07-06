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
    'The Washington Post',
    'CBS News',
    'ABC News',
    'CNBC',
    'HuffPost',
    'Fox News',
]
// const usSources = [...globalSrcs, 'The Washington Post','CBS News','ABC News','CNBC', 'HuffPost', 'Fox News']
const ukSources = [
    ...globalSrcs,
    'BBC News',
    'Telegraph.co.uk',
    'Daily Mail',
    'Mirror Online',
]
const indiaSources = [
    ...globalSrcs,
    'The Times of India',
    'The Tribune India',
    'Hindustan Times',
]
const caSources = [...globalSrcs, 'CBC News', 'Ctvnews.ca']
const auSources = [...globalSrcs, 'News.com.au', 'ABC News (AU)']
// const deSources = [...globalSrcs, 'CBC News', 'Ctvnews.ca',]
// const frSources = [...globalSrcs, 'News.com.au', 'ABC News (AU)']
// const saSources = [...globalSrcs, 'News24'] // S Africa

router.get('/', async (req, res, next) => {
    let { id } = req.query
    if (!id) return res.status(422).send('parameter is required')

    try {
        const response = await api.v2.topHeadlines({
            language: 'en',
            country: id,
        })
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
                case 'de':
                    return true
                case 'fr':
                    return true
                default:
                    throw new Error('invalid country code')
            }
        })
        res.send(display)
    } catch (err) {
        console.log(err)
        res.status(400).send(err.message)
    }
})

module.exports = router

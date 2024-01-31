const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost:27017/urlShortener')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

app.get('/', async (req, res) =>{
    try {
        const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
    } catch (error) {
        next(error)
    }

})

app.post('/shortUrls', async (req, res) =>{
    try {
        await ShortUrl.create({ full: req.body.fullUrl})
        res.redirect('/')
    } catch (error) {
        next(error)
    }
})

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
        if(shortUrl == null) return res.sendStatus(404)
        shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
    } catch (error) {
        next(error)
    }
})


app.listen(process.env.PORT || 5000);
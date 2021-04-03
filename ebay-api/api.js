const axios = require('axios').default
const cheerio = require('cheerio')

//https://www.ebay.it/sch/i.html?_nkw=Nvidia+rtx+3060&_sop=10
const config = require('../config.json')
const endpoints = require('./endpoints.json')

axios.defaults.baseURL = endpoints.BASE_URL
axios.defaults.headers['User-Agent'] = config['User-Agent']


module.exports.searchNewlyAdded = async (query) => {
    const { data } = await axios.get('/sch/i.html', { params: { _nkw: query, _sop: 10 } })
    const $ = cheerio.load(data)

    var results = $('.srp-results > li')
    var items = []
    results.each((index, e) => {
        let title = $(e).find('h3').text()
        if ($(e).find('.s-item__title').has('span')) {
            title = title.replace('Nuova inserzione', '')
        }
        items.push(title)
    })

    console.log(items[0])
    //let item = $('#srp-river-results h3').first().text().replace()
    //console.log($('#srp-river-results h3').first().text())
    //console.log(data)
}
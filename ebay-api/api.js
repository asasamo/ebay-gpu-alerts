const axios = require('axios').default
const cheerio = require('cheerio')

//https://www.ebay.it/sch/i.html?_nkw=Nvidia+rtx+3060&_sop=10
const config = require('../config.json')
const endpoints = require('./endpoints.json')


const emojiRegexp = new RegExp(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)
const shippingRegexp = new RegExp(/\+EUR\s[0-9]{1,3}\,[0-9]{2}/g)

axios.defaults.baseURL = endpoints.BASE_URL
axios.defaults.headers['User-Agent'] = config['User-Agent']


module.exports.searchNewlyAdded = async (query) => {
    const { data } = await axios.get('/sch/i.html', { params: { _nkw: query, _sop: 10 } })
    const $ = cheerio.load(data)

    var results = $('.srp-results > li')
    var items = []
    results.each((i, e) => {
        var title = $(e).find('.s-item__title').has('span') ? $(e).find('h3').text().replace('Nuova inserzione', '') : $(e).find('h3').text()
        var imageUrl = $(e).find('img').attr('src').replace('s-l225', 's-l500') //Risoluzione maggiore
        var itemId = $(e).find('a').first().attr('href').split('?')[0].split('/').pop()
        var itemType = $(e).find('div .s-item__detail--primary span span div').hasClass('s-item__buy-it-now-icon-it') | $(e).find('div .s-item__detail--primary span span div').hasClass('s-item__best-offer-icon-it') ? 'purchaseNow' : 'bid/other'

        var price = parseFloat($(e).find('.s-item__price').last().text().match(/[0-9]*\.*[0-9]{0,3}\,[0-9]{2}/g)[0].replace('.', '').replace(',', '.'))
        var itemLocation = $(e).find('.s-item__location').text().split(':').pop().trim() || 'Italia'
        var shippingCost = 0
        if ($(e).find('.s-item__logisticsCost').text().match(shippingRegexp)) {
            shippingCost = parseFloat($(e).find('.s-item__logisticsCost').text().match(/[0-9]*\,[0-9]{2}/g)[0].replace(',', '.'))
        }
        var itemConditions = $(e).find('.SECONDARY_INFO').text() || ''
        items.push({
            itemId: itemId,
            url: `${endpoints.BASE_URL}${endpoints.item}/${itemId}`,
            query: query.replaceAll(' ', '-'),
            title: title.replaceAll(emojiRegexp, '').trim(),
            image: imageUrl,
            type: itemType,
            conditions: itemConditions,
            price: price,
            shippingCost: shippingCost,
            location: itemLocation
        })
    })
    return items
}
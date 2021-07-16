const vega = require('vega')
const sharp = require('sharp')

var graphModel = require('./models/stacked_chart.json')

//module.exports.render = async (data) => {

//graphModel.data = data
const view = new vega.View(vega.parse(graphModel), { renderer: 'none' })

view.toSVG()
    .then(async function (svg) {

        await sharp(Buffer.from(svg))
            .toFormat('png')
            .toFile('./graph/tmp/fileName.png')

    }).catch(function (err) {
        console.error(err)
    })
//}
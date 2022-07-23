
const fetch = require('node-fetch')
const Planet = require('./models/planet')
const Validator = require('validatorjs')

const rules = {
    page: 'integer',
    search: 'string'
}

const getPlanets = async (event) => {

    const queryParameter = event.queryStringParameters

    if (queryParameter) {
        const validation = new Validator(queryParameter, rules)
        if (!validation.passes()) {
            const errors = validation.errors.errors
            return {
                statusCode: 400,
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify({
                    errors
                })

            }
        }
    }

    let url = 'https://swapi.py4e.com/api/planets'

    let parameter = []

    if (queryParameter) {

        if (queryParameter.page) {
            parameter.push(`page=${queryParameter.page}`)
        }
        if (queryParameter.search) {
            parameter.push(`search=${queryParameter.search}`)
        }

        if (parameter.length > 0) {
            url = `${url}?${parameter.join('&')}`
        }
    }

    const response = await fetch(url)
    
    const status = response.status
    
    const data = await response.json()
    
    let planets = []
    
    if (status === 200) {
        planets = data.results.map(planet => {
            return new Planet(planet)
        })
    }

    const {siguiente, anterior} = getNextAndPrevious(event, data)

    return {
        statusCode: status,
        headers: {
            'Content-type': "application/json"
        },
        body: JSON.stringify({
            cantidad: data.count,
            siguiente,
            anterior,
            payload: planets
        })
    }
}

const getNextAndPrevious = (event, data) => {
    let {next: siguiente, previous: anterior} = data
    let urlReturn = event.headers.host+event.rawPath
    if (siguiente) {
        //obtenemos los parametros de la url devuelta
        const dataUrl = new URL(data.next)
        siguiente = urlReturn+dataUrl.search
    }
    if (anterior) {
        const dataUrl = new URL(data.previous)
        anterior = urlReturn+dataUrl.search
    }
    
    return {siguiente, anterior}

}

module.exports = {
    getPlanets
}
const {getPlanet} = require('./../getPlanet')

const APIGatewayRequest = require('./../utils/eventGenerator')

test('response 400 if the id is not passed', async () => {
    const event = APIGatewayRequest({pathParametersObject: {}})

    const result = await getPlanet(event)

    expect(result.statusCode).toBe(400)
})

test('response 400 if the id is not a number', async () => {
    const event = APIGatewayRequest({pathParametersObject: {id: 'a'}})

    const result = await getPlanet(event)

    expect(result.statusCode).toBe(400)
})

test('response 404 if the id is not exist', async () => {
    const event = APIGatewayRequest({pathParametersObject: {id: 5000}})

    const result = await getPlanet(event)

    expect(result.statusCode).toBe(404)
})

test('response 200 if the id exist, content-type: application/json ', async () => {
    const event = APIGatewayRequest({pathParametersObject: {id: 2}})

    const result = await getPlanet(event)

    const resultParse = JSON.parse(result.body)

    expect(result.statusCode).toBe(200)

    expect(result.headers['Content-type']).toBe('application/json')

    expect(resultParse.payload).toEqual(
        {
            nombre: expect.any(String),
            periodo_rotacion: expect.any(String),
            periodo_orbital: expect.any(String),
            diametro: expect.any(String),
            clima: expect.any(String),
            gravedad: expect.any(String),
            terreno: expect.any(String),
            superficie_agua: expect.any(String),
            poblacion: expect.any(String),
            residentes: expect.any(Array),
            peliculas: expect.any(Array),
            creado: expect.any(String),
            editado: expect.any(String),
        }
    )

})
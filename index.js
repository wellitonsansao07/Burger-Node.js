const express = require('express')
const app = express()
const uuid = require('uuid')
const port = 3002
app.use(express.json())

const ordered = []

const check_if_order_exists = (request, response, next) => {
    const { id } = request.params

    const index = ordered.findIndex(order => order.id === id)

    if (index < 0) { return response.status(404).json({ error: 'the order does not exist' }) }

    request.this_is_id = id
    request.this_is_index = index

    next()
}

const request_method_and_url = (request, response, next) => {
    console.log(`O metodo da requisição é ${request.method} e a URL da requisição é ${request.path}`)
    next()
}

app.post('/order', request_method_and_url, (request, response) => {
    const { order, clientName, price } = request.body

    const requests = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    ordered.push(requests)

    return response.status(201).json(requests)
})

app.get('/order', request_method_and_url, (request, response) => {
    return response.json(ordered)

})

app.put('/order/:id', check_if_order_exists, request_method_and_url, (request, response) => {
    const { order, clientName, price } = request.body

    const id = request.this_is_id
    const index = request.this_is_index

    const new_order = { id, order, clientName, price, status: "Em preparação" }

    ordered[index] = new_order

    return response.json(new_order)
})

app.delete('/order/:id', check_if_order_exists, request_method_and_url, (request, response) => {
    const index = request.this_is_index

    ordered.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', check_if_order_exists, request_method_and_url, (request, response) => {
    const index = request.this_is_index

    return response.json(ordered[index])
})

app.patch('/order/:id', check_if_order_exists, request_method_and_url, (request, response) => {
    const index = request.this_is_index

    ordered[index].status = "Pronto"

    return response.json(ordered[index])
})


app.listen(port, () => {
    console.log(`🍔 server run in port ${port}`)
})
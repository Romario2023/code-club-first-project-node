
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()

app.use(express.json())



const orderClient = []


//midlewares

const checkUserId = (request, response, next) => {

    const { id } = request.params

    const index = orderClient.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "user not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}


const server = (request, response, next) => {

    const method = request.method

    const url = request.url

    console.log(`${method}${url}`)

    next()
}



//Servidor
app.get('/order', server, (request, response) => {

    return response.json(orderClient)
})


//Lista dos pedidos
app.post('/order', server, (request, response) => {
    const { order, nameClient, price, status } = request.body

    const orders = { id: uuid.v4(), order, nameClient, price, status }

    orderClient.push(orders)

    return response.json(orders)
})


//Atualizando os pedidos
app.put('/order/:id', server, checkUserId, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex

    const { order, nameClient, price, status } = request.body

    const updateOrder = { id, order, nameClient, price, status }

    orderClient[index] = updateOrder


    return response.status(202).json(updateOrder)

})

//Deletando pedidos
app.delete('/order/:id', server, checkUserId, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex

    orderClient.splice(index, 1)

    return response.status(204).json(orderClient)

})


//Pedidos especificos
app.get('/order/:id', server, checkUserId, (request, response) => {
    const id = request.orderId
    const index = orderClient.filter(order => order.id === id)

    return response.json(index)

})


app.patch('/order/:id', server, checkUserId, (request, response) => {
    const { id } = request.orderId


    const { name, status } = request.body

    return response.json({ id, name, status })
})




//Porta do meu servidor
app.listen(3000), () => {
console.log(`My server is on port ${port}`)
}


const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()


exports.putProductHandler = async (event, context) => {

    let response
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`PutProduct only accept POST method, you tried: ${event.httpMethod}`)
        }

        const item = await putProduct(event)
        //await publishSns(item)

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Inserted Product:' + JSON.stringify(item)
        }

    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err.message)
        }

    }
    return response

}

const putProduct = async (event) => {
    let response
    try {
        const body = JSON.parse(event.body)
        const id = body.id
        if (!id) {
            throw new Error('Product id is required')
        }
        const name = body.name
        if (!name) {
            throw new Error('Product name is required')
        }   
        const quantity = body.quantity
        if (!quantity) {
            throw new Error('Product quantity is required')
        }

        var params = {
            TableName: process.env.PRODUCT_TABLE,
            Item: { id: id, name: name, quantity: quantity },
            ReturnValues: 'ALL_OLD'
        }

        response = await docClient.put(params).promise()
        response = params.Item
    } catch (err) {
        throw err
    }
    return response
}



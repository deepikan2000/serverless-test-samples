const AWSXRay = require('aws-xray-sdk-core')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getAllProductsHandler = async (event, context) => {

    let response
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllProducts only accept GET method, you tried: ${event.httpMethod}`)
        }

        const items = await getAllProducts()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Product List: ' + JSON.stringify( items)

        }

    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }


    }
    return response

}


const getAllProducts = async () => {
    let response
    try {
        var params = {
            TableName: process.env.PRODUCT_TABLE
        }
        response = await docClient.scan(params).promise()
    } catch (err) {
        throw err
    }
    return response
}

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getProductByIdHandler = async (event, context) => {

  let response, id
  try {
    if (event.httpMethod !== 'GET') {
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }

    id = event.pathParameters.id
    if (!id || id.trim() === '')
      throw new Error('Product id is required')

    const item = await getProductById(id)
    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Product Details: ' + JSON.stringify(item)
    }


  } catch (err) {

    response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(err)
    }
    console.log('Catch ' + JSON.stringify(err.message))

  }
  return response

}


const getProductById = async (id) => {
  let response
  try {
    var params = {
      TableName: process.env.PRODUCT_TABLE,
      Key: { id: id }
    }
    response = await docClient.get(params).promise()
    if (!response.id || response.id==undefined)
      throw new Error(`Product with id ${id} not found`)
  } catch (err) {
    throw err
  }
  return response
}

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.deleteProductByIdHandler = async (event, context) => {

  let response, id
  try {
    if (event.httpMethod !== 'DELETE') {
      throw new Error(`deleteproduct only accept DELETE method, you tried: ${event.httpMethod}`)
    }

    id = event.pathParameters.id
    if(!id || id.trim() === '' )
    {
      throw new Error('Product id is required')
    }
    const item = await deleteProductById(id)

    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Deleted Product: ' + JSON.stringify( item)
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


const deleteProductById = async (id) => {
  let response
  try {
    var params = {
      TableName: process.env.PRODUCT_TABLE,
      Key: { id: id },
      ReturnValues: 'ALL_OLD'
    }

    response = await docClient.delete(params).promise()
  } catch (err) {
    throw err
  }
  return response
}
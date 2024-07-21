   // A simple request-based authorizer example to demonstrate how to use request 
    // parameters to allow or deny a request. In this example, a request is  
    // authorized if the client-supplied HeaderAuth1 header, QueryString1
    // query parameter, and stage variable of StageVar1 all match
    // specified values of 'headerValue1', 'queryValue1', and 'stageValue1',
    // respectively.
    
    exports.requestAuthorizerHandler = async(event, context, callback) => {
      console.log('Received event:', JSON.stringify(event, null, 2));
      
      // Retrieve request parameters from the Lambda function input:
      var headers = event.headers;
      console.log('headers: ' + JSON.stringify(headers));
      /* var queryStringParameters = event.queryStringParameters;
      var pathParameters = event.pathParameters;
      var stageVariables = event.stageVariables; */
          
      // Parse the input for the parameter values
      var tmp = event.methodArn.split(':');
      console.log('tmp: ' + JSON.stringify(tmp));
      var apiGatewayArnTmp = tmp[5].split('/');
      console.log('apiGatewayArnTmp: ' + JSON.stringify(apiGatewayArnTmp));
      var awsAccountId = tmp[4];
      var region = tmp[3];
      var restApiId = apiGatewayArnTmp[0];
      var stage = apiGatewayArnTmp[1];
      var method = apiGatewayArnTmp[2];
      var resource = '/'; // root resource
      if (apiGatewayArnTmp[3]) {
          resource += apiGatewayArnTmp[3];
      }
          
      // Perform authorization to return the Allow policy for correct parameters and 
      // the 'Unauthorized' error, otherwise.
      var authResponse = {};
      var condition = {};
      condition.IpAddress = {};
       
      if (headers.Authorization === "secretToken") {
        console.log('In if')
          callback(null, generateAllow('me', event.methodArn));
      }  else {
        console.log('Unauthorized Access')
        callback(null,generateDeny('me',event.methodArn));
      }
  }
       
  // Help function to generate an IAM policy
  var generatePolicy = function(principalId, effect, resource) {
      // Required output:
      var authResponse = {};
      authResponse.principalId = principalId;
      if (effect && resource) {
          var policyDocument = {};
          policyDocument.Version = '2012-10-17'; // default version
          policyDocument.Statement = [];
          var statementOne = {};
          statementOne.Action = 'execute-api:Invoke'; // default action
          statementOne.Effect = effect;
          statementOne.Resource = resource;
          policyDocument.Statement[0] = statementOne;
          authResponse.policyDocument = policyDocument;
      }
      
      // Optional output with custom properties of the String, Number or Boolean type.
     /*  authResponse.context = {
          "stringKey": "stringval",
          "numberKey": 123,
          "booleanKey": true
      }; */
      console.log("authResponse: " + JSON.stringify(authResponse));
      return authResponse;
  }
       
  var generateAllow = function(principalId, resource) {
      return generatePolicy(principalId, 'Allow', resource);
  }
       
  var generateDeny = function(principalId, resource) {
      return generatePolicy(principalId, 'Deny', resource);
  }
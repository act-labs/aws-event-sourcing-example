'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.example = async event => {
  for (const record of event.Records){
    console.log(record.eventID)
    console.log(record.eventName)
    console.log('DynamoDB Record: %j', record.dynamodb)

    const sequenceNumber = record.dynamodb["NewImage"]["id"]["N"].padStart(10, "0")
    const microservice = record.dynamodb["NewImage"]["microservice"]["S"]
    const payload = record.dynamodb["NewImage"]["payload"]["S"]
    const params = {
      TableName: process.env.EVENTS_TABLE,
      Item: {
        microservice,
        sequenceNumber,
        payload
      }
    }
    await dynamoDb.put(params).promise()
  }
  return `Successfully processed ${event.Records.length} records.`;
}

module.exports.addCommand = async event => {
  const data = JSON.parse(event.body);
  if (typeof data.type !== 'string') {
    console.error('Validation Failed')
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t add command.',
    }
  }

  const params = {
    TableName: process.env.COMMANDS_TABLE,
    Key: {
      microservice: data.type
    },
    UpdateExpression:"set id = if_not_exists(id, :initial) + :inc, payload=:payload",
    ExpressionAttributeValues:{':inc': 1, ':initial' : 0, ":payload": event.body}, 
    ReturnValues: "NONE"
  }

  // write the todo to the database
  await dynamoDb.update(params).promise()

  return {
    statusCode: 200
  }
}

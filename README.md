# Event sourcing using DynamoDB streams 

Initial steps necessary to implement event sourcing using serverless framework and AWS lambdas. [See blog post](https://act-labs.github.io/posts/aws-event-sourcing/) for details .

## Usage

1. Deploy using serverless

```sh
sls deploy
```
2. Send commands using HTTP endpoint

```sh
curl -XPOST https://XXXXX.execute-api.us-east-1.amazonaws.com/dev/command -d '{"type":"microserviceName", "command":"commandName", "id":17, "timestamp":11178, "user":"userId"}'

```
3. Check EVENTS_TABLE DynamoDB table is populated with new events.
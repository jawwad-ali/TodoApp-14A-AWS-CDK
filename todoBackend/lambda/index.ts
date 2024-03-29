import { EventBridgeEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { randomBytes } from 'crypto';

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME as string;

exports.handler = async (event: EventBridgeEvent<string, any>, context: Context) => {
    try {
        if (event["detail-type"] === "addTodo") { 

            console.log("detail===>", JSON.stringify(event.detail, null, 2));

            const params = {
                TableName: TABLE_NAME,
                Item: {
                    id: randomBytes(4).toString("hex"),
                    ...event.detail,
                },
            };
            await dynamoClient.put(params).promise();
        }
        else if (event["detail-type"] === "deleteTodo") {

            console.log(JSON.stringify(event.detail, null, 2))

            const params = {
                TableName: TABLE_NAME,
                Key: { id: event.detail.id }
            }
            await dynamoClient.delete(params).promise();
        }
    }
    catch (err) {
        console.log("err", err)
    }
} 
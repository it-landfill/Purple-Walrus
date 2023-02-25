import AWS = require("aws-sdk");
import { DynamoDbPersistenceAdapter } from "ask-sdk-dynamodb-persistence-adapter";
export declare module util {
    function getLocalDynamoDBClient(options: any): AWS.DynamoDB;
    function getPersistenceAdapter(tableName: any, createTable: any, dynamoDBClient?: any): DynamoDbPersistenceAdapter;
}

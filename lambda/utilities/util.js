"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = void 0;
const AWS = require("aws-sdk");
const Alexa = require("ask-sdk-core");
const ask_sdk_dynamodb_persistence_adapter_1 = require("ask-sdk-dynamodb-persistence-adapter");
const s3SigV4Client = new AWS.S3({ signatureVersion: "v4", region: process.env.S3_PERSISTENCE_REGION });
var util;
(function (util) {
    function getS3PreSignedUrl(s3ObjectKey) {
        const bucketName = process.env.S3_PERSISTENCE_BUCKET;
        const s3PreSignedUrl = s3SigV4Client.getSignedUrl("getObject", {
            Bucket: bucketName,
            Key: s3ObjectKey,
            Expires: 60 * 1 // the Expires is capped for 1 minute
        });
        console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
        return s3PreSignedUrl;
    }
    function getLocalDynamoDBClient(options) {
        //configuration for creating a DynamoDB client that will connect to the local instance
        AWS.config.update({
            region: "local",
            // @ts-ignore
            endpoint: "http://localhost:" + options.port,
            accessKeyId: "fake",
            secretAccessKey: "fake"
        });
        return new AWS.DynamoDB();
    }
    util.getLocalDynamoDBClient = getLocalDynamoDBClient;
    function getPersistenceAdapter(tableName, createTable, dynamoDBClient) {
        let options = {
            tableName: tableName,
            createTable: createTable,
            partitionKeyGenerator: (requestEnvelope) => {
                const userId = Alexa.getUserId(requestEnvelope);
                return userId.substr(userId.lastIndexOf(".") + 1);
            }
        };
        //if a DynamoDB client is specified, this adapter will use it. e.g. the one that will connect to our local instance
        if (dynamoDBClient) {
            // @ts-ignore
            options.dynamoDBClient = dynamoDBClient;
        }
        return new ask_sdk_dynamodb_persistence_adapter_1.DynamoDbPersistenceAdapter(options);
    }
    util.getPersistenceAdapter = getPersistenceAdapter;
})(util = exports.util || (exports.util = {}));

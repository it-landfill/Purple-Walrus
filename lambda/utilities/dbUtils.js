"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbUtils = void 0;
const Alexa = require("ask-sdk-core");
const ask_sdk_dynamodb_persistence_adapter_1 = require("ask-sdk-dynamodb-persistence-adapter");
const AWS = require("aws-sdk");
var dbUtils;
(function (dbUtils) {
    /**
     * Creates a DynamoDB client that will connect to the local instance
     *
     * @export
     * @param {{"port": number}} options - the port number of the local instance of DynamoDB
     * @return {*}  {AWS.DynamoDB}
     */
    function getLocalDynamoDBClient(options) {
        //configuration for creating a DynamoDB client that will connect to the local instance
        const awsConfig = {
            region: "local",
            endpoint: "http://localhost:" + options.port,
            accessKeyId: "fake",
            secretAccessKey: "fake"
        };
        AWS.config.update(awsConfig);
        return new AWS.DynamoDB();
    }
    dbUtils.getLocalDynamoDBClient = getLocalDynamoDBClient;
    /**
     * Creates a DynamoDB persistence adapter
     *
     * @export
     * @param {string} tableName
     * @param {boolean} createTable
     * @param {AWS.DynamoDB} [dynamoDBClient]
     * @return {*}  {DynamoDbPersistenceAdapter}
     */
    function getPersistenceAdapter(tableName, createTable, dynamoDBClient) {
        let options = {
            tableName: tableName,
            createTable: createTable,
            partitionKeyGenerator: (requestEnvelope) => {
                const userId = Alexa.getUserId(requestEnvelope);
                return userId.substr(userId.lastIndexOf(".") + 1);
            },
            //if a DynamoDB client is specified, this adapter will use it. e.g. the one that will connect to our local instance
            dynamoDBClient: dynamoDBClient
                ? dynamoDBClient
                : undefined
        };
        return new ask_sdk_dynamodb_persistence_adapter_1.DynamoDbPersistenceAdapter(options);
    }
    dbUtils.getPersistenceAdapter = getPersistenceAdapter;
})(dbUtils = exports.dbUtils || (exports.dbUtils = {}));

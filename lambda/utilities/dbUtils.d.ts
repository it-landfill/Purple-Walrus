import { DynamoDbPersistenceAdapter } from "ask-sdk-dynamodb-persistence-adapter";
import AWS = require("aws-sdk");
export declare module dbUtils {
    function getPersistenceDataTemplate(): {
        [key: string]: string | string[] | undefined;
    };
    /**
     * Creates a DynamoDB client that will connect to the local instance
     *
     * @export
     * @param {{"port": number}} options - the port number of the local instance of DynamoDB
     * @return {*}  {AWS.DynamoDB}
     */
    function getLocalDynamoDBClient(options: {
        port: number;
    }): AWS.DynamoDB;
    /**
     * Creates a DynamoDB persistence adapter
     *
     * @export
     * @param {string} tableName
     * @param {boolean} createTable
     * @param {AWS.DynamoDB} [dynamoDBClient]
     * @return {*}  {DynamoDbPersistenceAdapter}
     */
    function getPersistenceAdapter(tableName: string, createTable: boolean, dynamoDBClient?: AWS.DynamoDB): DynamoDbPersistenceAdapter;
}

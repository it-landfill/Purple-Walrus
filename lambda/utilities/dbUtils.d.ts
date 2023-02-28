import { DynamoDbPersistenceAdapter } from "ask-sdk-dynamodb-persistence-adapter";
export declare module dbUtils {
    function getPersistenceDataTemplate(): {
        [key: string]: string | string[] | undefined;
    };
    /**
     * Returns a DynamoDB persistence adapter.
     * If the environment variable DYNAMODB_PERSISTENCE_TABLE_NAME is not set and DYNAMODB_LOCAL is true, it means that the skill is running locally,
     * generates a custom AWS.DynamoDB and use the default table name
     *
     * @export
     * @return {*}  {DynamoDbPersistenceAdapter}
     */
    function getPersistenceAdapter(): DynamoDbPersistenceAdapter;
    /**
     * Gets data from DynamoDB.
     * Since DynamoDB on AWS does not allow to create new tables, we will save data as a JSON string in a single field using the new table name as the key.
     *
     * @export
     * @param {string} tableName The table name to use as the key
     * @return {*}  {(object | undefined)} The data retrieved from DynamoDB
     */
    function getData(tableName: string): object | undefined;
    function setData(tableName: string, data: object): void;
}

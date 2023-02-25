import Alexa = require("ask-sdk-core");
import {DynamoDbPersistenceAdapter} from "ask-sdk-dynamodb-persistence-adapter";
import AWS = require("aws-sdk");

export module dbUtils {
	export function getPersistenceDataTemplate(): {
		[key: string]: string | string[] | undefined,
	} {
		return {
			materie: undefined,
		};
	}

	/**
	 * Creates a DynamoDB client that will connect to the local instance
	 *
	 * @export
	 * @param {{"port": number}} options - the port number of the local instance of DynamoDB
	 * @return {*}  {AWS.DynamoDB}
	 */
	export function getLocalDynamoDBClient(options : {
		port: number
	}): AWS.DynamoDB {
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

	/**
	 * Creates a DynamoDB persistence adapter
	 *
	 * @export
	 * @param {string} tableName
	 * @param {boolean} createTable
	 * @param {AWS.DynamoDB} [dynamoDBClient]
	 * @return {*}  {DynamoDbPersistenceAdapter}
	 */
	export function getPersistenceAdapter(tableName : string, createTable : boolean, dynamoDBClient? : AWS.DynamoDB): DynamoDbPersistenceAdapter {
		let options = {
			tableName: tableName,
			createTable: createTable,
			partitionKeyGenerator: (requestEnvelope : any) => {
				const userId = Alexa.getUserId(requestEnvelope);
				return userId.substr(userId.lastIndexOf(".") + 1);
			},
			//if a DynamoDB client is specified, this adapter will use it. e.g. the one that will connect to our local instance
			dynamoDBClient: dynamoDBClient
				? dynamoDBClient
				: undefined
		};

		return new DynamoDbPersistenceAdapter(options);
	}
}

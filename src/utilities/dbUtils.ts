import Alexa = require("ask-sdk-core");
import {DynamoDbPersistenceAdapter} from "ask-sdk-dynamodb-persistence-adapter";
import AWS = require("aws-sdk");
import {CustomLogger} from "../utilities/customLogger";

export module dbUtils {
	export function getPersistenceDataTemplate(): {
		[key: string]: string | string[] | undefined;
	} {
		return {materie: undefined};
	}

	/**
	 * Returns the table name to use for the DynamoDB persistence adapter.
	 * If the environment variable DYNAMODB_PERSISTENCE_TABLE_NAME is not set or DYNAMODB_LOCAL is true, it means that the skill is running locally,
	 *
	 * @return {*}  {string}
	 */
	function getTableName(): string {
		let tableName = process.env.DYNAMODB_PERSISTENCE_TABLE_NAME;
		if (process.env.DYNAMODB_LOCAL === "true" || tableName === undefined) 
			tableName = "PurpleWalrus";
		return tableName;
	}

	/**
	 * Creates a DynamoDB client that will connect to the instance
	 *
	 * @export
	 * @return {*}  {AWS.DynamoDB}
	 */
	function getDynamoDBClient(): AWS.DynamoDB {
		// If the environment variable DYNAMODB_LOCAL is set to true, use a local instance of DynamoDB
		if (process.env.DYNAMODB_LOCAL === "true") {
			//configuration for creating a DynamoDB client that will connect to the local instance
			const awsConfig = {
				region: "local",
				endpoint: "http://localhost:8000",
				accessKeyId: "fake",
				secretAccessKey: "fake"
			};
			AWS.config.update(awsConfig);
		} else {
			//configuration for creating a DynamoDB client that will connect to the remote instance
			const awsConfig = {
				apiVersion: "latest",
				region: process.env.DYNAMODB_PERSISTENCE_REGION
			};
			AWS.config.update(awsConfig);
		}

		return new AWS.DynamoDB();
	}

	/**
	 * Returns a DynamoDB persistence adapter.
	 * If the environment variable DYNAMODB_PERSISTENCE_TABLE_NAME is not set and DYNAMODB_LOCAL is true, it means that the skill is running locally,
	 * generates a custom AWS.DynamoDB and use the default table name
	 *
	 * @export
	 * @return {*}  {DynamoDbPersistenceAdapter}
	 */
	export function getPersistenceAdapter(): DynamoDbPersistenceAdapter {
		// Generate base persistence adapter options
		let options: {
			tableName: string;
			createTable: boolean;
			dynamoDBClient: AWS.DynamoDB;
			partitionKeyGenerator: (requestEnvelope : any) => string;
		} = {
			partitionKeyGenerator: (requestEnvelope : any) => {
				const userId = Alexa.getUserId(requestEnvelope);
				return userId.substr(userId.lastIndexOf(".") + 1);
			},
			tableName: getTableName(),
			createTable: false,
			dynamoDBClient: getDynamoDBClient()
		};

		if (process.env.DYNAMODB_LOCAL === "true") {
			// If the environment variable DYNAMODB_LOCAL is set to true, use a local instance of DynamoDB
			options.createTable = true;
		}

		return new DynamoDbPersistenceAdapter(options);
	}


	/**
	 * Gets data from DynamoDB.
	 * Since DynamoDB on AWS does not allow to create new tables, we will save data as a JSON string in a single field using the new table name as the key.
	 *
	 * @export
	 * @param {string} tableName The table name to use as the key
	 * @return {*}  {(object | undefined)} The data retrieved from DynamoDB
	 */
	export function getData(tableName : string): object | undefined {
		const client = getDynamoDBClient();

		var params = {
			Key: {
				id: {
					S: tableName
				}
			},
			TableName: getTableName()
		};

		CustomLogger.verbose("Getting data from DynamoDB: " + JSON.stringify(params));

		client.getItem(params, function (err, data) {
			if (err) {
				CustomLogger.warn("Error while getting data from DynamoDB: " + JSON.stringify(err));
				console.warn(err, err.stack); // an error occurred
				return;
			} else {
				if (data.Item === undefined) {
					CustomLogger.warn("No data found in DynamoDB");
					return;
				}

				let item = AWS.DynamoDB.Converter.unmarshall(data.Item);

				CustomLogger.info("Data retrieved from DynamoDB: " + JSON.stringify(item));
				return item;
			}
		});
		return ;
	}

	export function setData(tableName : string, data : object) {
		const client = getDynamoDBClient();

		CustomLogger.verbose("Saving data to DynamoDB: " + JSON.stringify(data));

		let formattedData = {
			id: tableName,
			attributes: data
		};

		CustomLogger.verbose("Formatting data to DynamoDB: " + JSON.stringify(formattedData));

		var params = {
			Item: AWS.DynamoDB.Converter.marshall(formattedData),
			TableName: getTableName()
		};

		CustomLogger.verbose("Setting data to DynamoDB: " + JSON.stringify(params));

		client.putItem(params, function (err, data) {
			if (err) {
				CustomLogger.warn("Error while setting data to DynamoDB: " + JSON.stringify(err));
				console.warn(err, err.stack); // an error occurred
			} else {
				CustomLogger.info("Data saved to DynamoDB: " + JSON.stringify(data));
			}
		});
	}
}

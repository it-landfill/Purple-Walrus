import AWS = require("aws-sdk");
import Alexa = require("ask-sdk-core");
import {DynamoDbPersistenceAdapter} from "ask-sdk-dynamodb-persistence-adapter";

const s3SigV4Client = new AWS.S3({signatureVersion: "v4", region: process.env.S3_PERSISTENCE_REGION});

export module util {
	function getS3PreSignedUrl(s3ObjectKey : any) {
		const bucketName = process.env.S3_PERSISTENCE_BUCKET;
		const s3PreSignedUrl = s3SigV4Client.getSignedUrl("getObject", {
			Bucket: bucketName,
			Key: s3ObjectKey,
			Expires: 60 * 1 // the Expires is capped for 1 minute
		});
		console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
		return s3PreSignedUrl;
	}

	export function getLocalDynamoDBClient(options : any) {
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

	export function getPersistenceAdapter(tableName : any, createTable : any, dynamoDBClient? : any) {
		let options = {
			tableName: tableName,
			createTable: createTable,
			partitionKeyGenerator: (requestEnvelope : any) => {
				const userId = Alexa.getUserId(requestEnvelope);
				return userId.substr(userId.lastIndexOf(".") + 1);
			}
		};
		//if a DynamoDB client is specified, this adapter will use it. e.g. the one that will connect to our local instance
		if (dynamoDBClient) {
			// @ts-ignore
			options.dynamoDBClient = dynamoDBClient;
		}

		return new DynamoDbPersistenceAdapter(options);
	}
}

import AWS = require("aws-sdk");

const s3SigV4Client = new AWS.S3({signatureVersion: "v4", region: process.env.S3_PERSISTENCE_REGION});

export module Utils {
	export function formatDateForSpeach(date : Date): string {
		const dow = [
			"Domenica",
			"Lunedì",
			"Martedì",
			"Mercoledì",
			"Giovedì",
			"Venerdì",
			"Sabato"
		];
		const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
		const isTomorrow = date.getDate() === new Date().getDate() + 1 && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
		let outString = "";
		if (isToday) 
			outString = "Oggi";
		else if (isTomorrow) 
			outString = "Domani";
		else 
			outString = dow[date.getUTCDay()] + '<say-as interpret-as="date" format="dm">' + date.getDate() + "-" + (
				date.getMonth() + 1
			) + "</say-as>";
		return outString;
	}
}

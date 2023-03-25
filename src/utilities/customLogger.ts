export module CustomLogger {
	const localhost: boolean = process.env.DYNAMODB_LOCAL === "true";

	function toString(msg : any): string {
		switch (typeof msg) {
			case "string":
				return msg;
			case "number":
			case "boolean":
				return msg.toString();
			case "object":
				return JSON.stringify(msg);
			default:
				console.warn("Unable to convert to string type: " + typeof msg + ". Trying to log " + msg);
				return "?_?";
		}
	}

	function logToFile(msg : string) {
		const fs = require("fs");
		const path = require("path");

		const logPath = path.join(__dirname, "..", "..", "logs");
		if (!fs.existsSync(logPath)){
			fs.mkdirSync(logPath);
		}

		fs.appendFileSync(path.join(logPath, new Date().toISOString().split("T")[0] + "_purple-walrus.log"), msg);
	}

	export function info(msg : any) {
		console.log("\x1B[90m[PW]\x1B[1;32m[INFO]\x1B[0m\t" + toString(msg));
		if (localhost) {
			logToFile("[" + new Date().toISOString() + "][PW][INFO]\t" + toString(msg) + "\n");
		}
	}
	export function error(msg : any) {
		console.error("\x1B[90m[PW]\x1B[1;31m[ERROR]\x1B[0m\t" + toString(msg));
		if (localhost) {
			logToFile("[" + new Date().toISOString() + "][PW][ERROR]\t" + toString(msg) + "\n");
		}
	}
	export function warn(msg : any) {;
		console.warn("\x1B[90m[PW]\x1B[1;33m[WARN]\x1B[0m\t" + toString(msg));
		if (localhost) {
			logToFile("[" + new Date().toISOString() + "][PW][WARN]\t" + toString(msg) + "\n");
		}
	}
	export function log(msg : any) {
		console.log("\x1B[90m[PW]\x1B[1;36m[DEBUG]\x1B[0m\t" + toString(msg));
		if (localhost) {
			logToFile("[" + new Date().toISOString() + "][PW][DEBUG]\t" + toString(msg) + "\n");
		}
	}
	export function verbose(msg : any) {
		console.log("\x1B[90m[PW]\x1B[1;34m[VERBOSE]\t" + toString(msg) + "\x1B[0m");
		if (localhost) {
			logToFile("[" + new Date().toISOString() + "][PW][VERBOSE]\t" + toString(msg) + "\n");
		}
	}
}

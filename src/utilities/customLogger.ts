export module CustomLogger {
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

	export function info(msg : any) {
		console.log("\x1B[90m[PW]\x1B[1;32m[INFO]\x1B[0m\t" + toString(msg));
	}
	export function error(msg : any) {
		console.error("\x1B[90m[PW]\x1B[1;31m[ERROR]\x1B[0m\t" + toString(msg));
	}
	export function warn(msg : any) {
		console.warn("\x1B[90m[PW]\x1B[1;33m[WARN]\x1B[0m\t" + toString(msg));
	}
	export function log(msg : any) {
		console.log("\x1B[90m[PW]\x1B[1;36m[DEBUG]\x1B[0m\t" + toString(msg));
	}
	export function verbose(msg : any) {
		console.log("\x1B[90m[PW]\x1B[1;34m[VERBOSE]\x1B[0m\t" + toString(msg));
	}
}

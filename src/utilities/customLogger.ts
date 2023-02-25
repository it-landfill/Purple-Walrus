export module CustomLogger {
	export function info(msg : string) {
		console.log("\x1B[90m[PW]\x1B[1;32m[INFO]\x1B[0m\t" + msg);
	}
	export function error(msg : string) {
		console.error("\x1B[90m[PW]\x1B[1;31m[ERROR]\x1B[0m\t" + msg);
	}
	export function warn(msg : string) {
		console.warn("\x1B[90m[PW]\x1B[1;33m[WARN]\x1B[0m\t" + msg);
	}
	export function log(msg : string) {
		console.log("\x1B[90m[PW]\x1B[1;36m[DEBUG]\x1B[0m\t" + msg);
	}
	export function verbose(msg : string) {
		console.log("\x1B[90m[PW]\x1B[1;34m[VERBOSE]\x1B[0m\t" + msg);
	}
}

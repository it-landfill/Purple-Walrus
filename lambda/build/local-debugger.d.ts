declare const net: any;
declare const fs: any;
declare const localDebugger: any;
declare const httpHeaderDelimeter = "\r\n";
declare const httpBodyDelimeter = "\r\n\r\n";
declare const defaultHandlerName = "handler";
declare const host = "localhost";
declare const defaultPort = 0;
/**
 * Resolves the skill invoker class dependency from the user provided
 * skill entry file.
 */
declare const skillInvoker: any;
declare const portNumber: number;
declare const lambdaHandlerName: any;
/**
 * Validates user specified port number is in legal range [0, 65535].
 * Defaults to 0.
 */
declare function getAndValidatePortNumber(): number;
/**
 * Gets the lambda handler name.
 * Defaults to "handler".
 */
declare function getLambdaHandlerName(): any;
/**
 * Validates that the skill entry file exists on the path specified.
 * This is a required field.
 */
declare function getAndValidateSkillInvokerFile(): any;
/**
 * Helper function to fetch the value for a given argument
 * @param {argumentName} argumentName name of the argument for which the value needs to be fetched
 * @param {defaultValue} defaultValue default value of the argument that is returned if the value doesn't exist
 */
declare function getArgument(argumentName: any, defaultValue?: any): any;

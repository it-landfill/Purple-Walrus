// This request interceptor will bind a translation function 't' to the handlerInput
export const SaveAttributesResponseInterceptor = {
	async process(handlerInput : any, response : any) {
		if (!response) 
			return; // avoid intercepting calls that have no outgoing response due to errors
		
		const {attributesManager, requestEnvelope} = handlerInput;

		console.log("Saving to persistent storage:" + JSON.stringify(requestEnvelope));
		attributesManager.setPersistentAttributes(requestEnvelope);
		await attributesManager.savePersistentAttributes();
	}
};

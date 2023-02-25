const Alexa2 = require("ask-sdk-core");
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require("i18next");
// i18n strings for all supported locales
const languageStrings = require("../utilities/languageStrings");

// This request interceptor will bind a translation function 't' to the handlerInput
export const LocalisationRequestInterceptor = {
	process(handlerInput : any) {
		i18n.init({
			lng: Alexa2.getLocale(handlerInput.requestEnvelope),
			resources: languageStrings
		}).then((t : any) => {
			handlerInput.t = (...args : any[]) => t(...args);
		});
	}
};

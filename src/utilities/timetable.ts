import {DbUtils} from "./dbUtils";
import {CustomLogger} from "./customLogger";
import axios from "axios";
import { SlotUtils } from "./slotUtils";

export module Timetable {
	/**
	 * This represents a single course
	 */
	export type ClassElement = {
		code: string;
		name: string;
		year: string;
		curriculum: string;
		mod1?: string; //mod1 and mod2 are optional and are present only if the course has multiple modules
		mod2?: string; //mod1 and mod2 are optional and are present only if the course has multiple modules
	};

	/**
	 * This is the dictionary of all the courses available with the course code as key
	 */
	export type ClassDictionary = {
		[key: string]: ClassElement;
	};

	/**
	 * This represents a single course entry used by dynamic entity resolution
	 */
	export type ClassEntity = {
		id: string;
		name: {
			value: string;
		};
	};

	/**
	 * This represents info on a specific class fetched from the university calendar
	 */
	export type ClassDetails = {
		codice: string;
		docente: string;
		start: string;
		end: string;
		title: string;
		aula: {
			indirizzo: string;
			piano: string;
			edificio: string;
		};
	};

	/**
	 * Queries the university calendar and returns the list of all the courses matching the specified criterias
	 * @param year Example: "2"
	 * @param curricula Example: "A58-000"
	 * @param start
	 * @param end
	 * @param insegnamenti
	 * @returns {Promise<object[]>} The timetable
	 */
	export async function getTimetable(year : string, curricula : string, start : Date, end : Date, insegnamenti? : string[]): Promise<ClassDetails[]> {
		// Query parameters
		let params = {
			start: start.toISOString().split("T")[0],
			end: end.toISOString().split("T")[0],
			curricula: curricula,
			anno: year
		};

		// Config for axios request
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json",
			headers: {},
			params: params
		};

		// If the user has specified some courses, filter the query with them Note that here we are also resolving multiple modules for the same course
		if (insegnamenti && insegnamenti.length > 0) {
			// Get the list of all the courses
			const allClasses = await getClassesList();
			if (allClasses === undefined) {
				CustomLogger.error("Error while fetching classes list");
				return [];
			}

			// We can't add this parameter to params object doe to some sanification problems so we will directly append it to the url
			config.url += "?";

			// For each course code, append it to the url and, if it has multiple modules, also append the other modules.
			for (let insegnamento of insegnamenti) {
				const classElement = allClasses[insegnamento];
				config.url += "&insegnamenti=" + insegnamento;
				if (classElement === undefined) 
					continue;
				if (classElement.mod1) {
					config.url += "&insegnamenti=" + classElement.mod1;
				}
				if (classElement.mod2) {
					config.url += "&insegnamenti=" + classElement.mod2;
				}
			}
		}

		CustomLogger.verbose("Fetching timetable with config: " + JSON.stringify(config));

		// Query the university calendar
		let response = await axios(config);
		if (response.status == 200) {
			// Everything went well, clean the results and return them
			let json = response.data;
			return cleanResults(json);
		} else {
			CustomLogger.error("Error while fetching timetable using config: " + response.config);
			return [];
		}
	}

	/**
	 * Queries the university calendar and returns the list of all the courses matching the specified criterias
	 *
	 * @export
	 * @param {string[]} classes The list of course ids to fetch
	 * @param {Date} [start] The start date of the timetable (if omitted it will be today)
	 * @param {Date} [end] The end date of the timetable (if omitted it will be one week from now)
	 * @return {*}  {(Promise < ClassDetails[] | undefined >)} The timetable
	 */
	export async function getTimetableFromClassList(classes : string[], start? : Date, end? : Date): Promise < ClassDetails[] | undefined > {
		// Since the university calendar only allows to query by year and curriculum, we need to divide the classes by year and curriculum.
		let queryQueue: {
			[key: string]: {
				// Year
				[key: string]: string[]; // Curriculum
			};
		} = {};

		const classesList = await getClassesList();

		// If classes fetch went wrong, return undefined
		if (classesList === undefined) {
			CustomLogger.error("Error while fetching classes list");
			return;
		}

		// Divide classes by year and curriculum
		for (let key of classes) {
			if (!(key in classesList)) {
				CustomLogger.warn("Class " + key + " is not in class list");
				continue;
			}

			const classObj: ClassElement = classesList[key];
			// If the class year is not in the query queue, add it
			if (!(classObj.year in queryQueue)) 
				queryQueue[classObj.year] = {};
			
			// If the class curriculum is not in the query queue, add it
			if (!(classObj.curriculum in queryQueue[classObj.year])) 
				queryQueue[classObj.year][classObj.curriculum] = [];
			
			// Add the course code to the query queue
			queryQueue[classObj.year][classObj.curriculum].push(classObj.code);
		}

		// Fill start and end if they are not defined
		if (start === undefined) 
			start = new Date();
		if (end === undefined) {
			end = new Date();
			end.setDate(end.getDate() + 7);
		}

		// For each year and curriculum, fetch the timetable
		let timetable: ClassDetails[] = [];
		for (let year in queryQueue) {
			for (let curriculum in queryQueue[year]) {
				let classes = queryQueue[year][curriculum];
				timetable = timetable.concat(await getTimetable(year, curriculum, start, end, classes));
			}
		}

		return timetable;
	}

	/**
	 * Given a json object, it convers it to a ClassDetails object
	 *
	 * @param {*} el The json object
	 * @return {*}  {ClassDetails} The ClassDetails object
	 */
	function parseElement(el : any): ClassDetails {
		// If the element has no aule, add an empty one
		if (el["aule"].length < 0) {
			CustomLogger.warn("No aule found for element: " + el["cod_modulo"]);
			el["aule"] = [{}];
		}

		// Build the ClassDetails object
		return {
			codice: el["cod_modulo"],
			docente: el["docente"],
			start: el["start"],
			end: el["end"],
			title: el["title"],
			aula: {
				indirizzo: el["aule"][0]["des_indirizzo"],
				piano: el["aule"][0]["des_piano"],
				edificio: el["aule"][0]["des_edificio"]
			}
		};
	}

	/**
	 * Given a json object, apply parseElement to each element and return the result
	 *
	 * @param {object[]} json The json object
	 * @return {*}  {ClassDetails[]} The ClassDetails object
	 */
	function cleanResults(json : object[]): ClassDetails[]{
		let jsonOut = json.map(parseElement);
		return jsonOut;
	}

	/**
	 * Returns the available curricula.
	 *
	 * @return {*}  {(Promise < object[] | undefined >)}
	 */
	async function getAvailableCurricula(): Promise < object[] | undefined > {
		// Axios config
		var config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@available_curricula",
			headers: {}
		};

		let response = await axios(config);

		if (response.status == 200) {
			let result = response.data;
			CustomLogger.verbose("Available curricula fetched successfully." + JSON.stringify(result));
			return result;
		} else {
			CustomLogger.error("Error while fetching timetable using config: " + response.config);
			return undefined;
		}
	}

	/**
	 * Fetches the available classes for the current year from the unviersity website for the specified year and curricula.
	 *
	 * @param {string} year The year of the classes to fetch
	 * @param {string} curriculum The curriculum of the classes to fetch
	 * @return {*}  {Promise < ClassDictionary >}
	 */
	async function fetchClassesFromTimetable(year : string, curriculum : string): Promise<ClassDictionary> {
		let classes: ClassDictionary = {};
		// Same as classes but indexed by class name
		let classesSet: ClassDictionary = {};

		let start = new Date();
		let end: Date;

		if (start.getMonth() >= 8) {
			// We are in a new school year. End date must be next year
			end = new Date(start.getFullYear() + 1, 8, 1);
		} else {
			// We are in the same school year. End date must be this year
			end = new Date(start.getFullYear(), 8, 1);
		}

		// Axios config
		var config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json",
			headers: {},
			params: {
				start: start.toISOString().split("T")[0],
				end: end.toISOString().split("T")[0],
				curricula: curriculum,
				anno: year
			}
		};

		let response = await axios(config);
		if (response.status == 200) {
			let result = response.data;

			// For each class in the result, add it to the classes dictionary
			for (let el of result) {
				if (el["extCode"] in classes) 
					continue;
				
				// Clean the class name, removing the module number and trimming it
				const cleanRes = SlotUtils.cleanClassName(el["title"]);

				// Create the class object
				let classObj: ClassElement = {
					code: el["extCode"],
					name: cleanRes[0],
					year: year,
					curriculum: curriculum
				};

				// Add the class to the classes dictionary
				classes[el["extCode"]] = classObj;

				// If cleanRes[0] in classesSet then it is a module 1 or 2 since we have already found a class with same name
				if (cleanRes[0] in classesSet) {
					// Get the other module
					const otherModule = classesSet[cleanRes[0]];
					switch (cleanRes[1]) {
						case "1":
							// This is module 1, so we add the other module as module 2
							classObj.mod2 = otherModule.code;
							otherModule.mod1 = classObj.code;
							break;
						case "2":
							// This is module 2, so we add the other module as module 1
							classObj.mod1 = otherModule.code;
							otherModule.mod2 = classObj.code;
							break;
						default:
							CustomLogger.warn(
								"Class " + JSON.stringify(classObj) + " has a duplicate " + JSON.stringify(otherModule) + " but is no module 1 or 2."
							);
					}
				} else {
					// If !cleanRes[0] in classesSet than we have never seen this class, so we add it to classesSet
					classesSet[cleanRes[0]] = classObj;
				}
			}
		} else {
			CustomLogger.error("Error while fetching timetable using config: " + response.config);
		}

		return classes;
	}

	/**
	 * Returns the available classes for the current year for all school years and curricula.
	 *
	 * @return {*}  {(Promise < | {
	 * 		[key: string]: object;
	 * 	} | undefined >)}
	 */
	async function getAvailableClasses(): Promise < ClassDictionary | undefined > {
		const curricula = await getAvailableCurricula();

		if (curricula === undefined) 
			return;
		
		let classes: ClassDictionary = {};

		// For each curriculum, fetch the classes for the first and second year
		for (let curriculum of curricula) {
			if ("value" in curriculum) {
				// Fetch the classes for the first year
				const cla1 = await fetchClassesFromTimetable("1", curriculum.value as string);
				// Fetch the classes for the second year
				const cla2 = await fetchClassesFromTimetable("2", curriculum.value as string);
				// Concatenate the objects
				const cla = {
					...cla1,
					...cla2
				};

				// Add the classes to the classes dictionary
				for (let key in cla) {
					if (!classes.hasOwnProperty(key)) {
						classes[key] = cla[key];
					}
				}
			}
		}

		return classes;
	}

	/**
	 * Returns the available classes for the current year.
	 * The classes are either loadaed from the database or fetched from the university website if not present or to old.
	 *
	 * @export
	 * @return {*}  {(Promise < object | undefined >)}
	 */
	export async function getClassesList(): Promise < ClassDictionary | undefined > {
		const updateDays = 30;

		let classesList: | {
			[key: string]: any;
		} | undefined = await DbUtils.getData("classes");

		// Check if classes exist and has a lastUpdated field
		if (classesList === undefined || !("lastUpdated" in classesList)) {
			const classes = await getAvailableClasses();
			if (classes === undefined) 
				return;
			DbUtils.setData("classes", {
				classes: classes,
				lastUpdated: new Date().toISOString()
			});
			return classes;
		}

		// Check if the update is older than updateDays days
		let lastUpdated = new Date(classesList["lastUpdated"] as string);
		let now = new Date();
		let diff = Math.abs(now.getTime() - lastUpdated.getTime());
		let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
		// If it is older, fetch the classes again
		if (diffDays > updateDays) {
			const classes = await getAvailableClasses();
			if (classes === undefined) 
				return;
			DbUtils.setData("classes", {
				classes: classes,
				lastUpdated: new Date().toISOString()
			});
			return classes;
		}

		// If we reached here, the class database is valid and updated. return it.
		return classesList["classes"] as ClassDictionary;
	}

	/**
	 * Generates the dynamic class entries for entity resolution.
	 * The entries are generated from the classes list and will be passed to alexa on skill launch (on launchIntent).
	 *
	 * @export
	 * @return {*}  {(Promise < {
	 * 		id: string;
	 * 		name: {
	 * 			value: string
	 * 		}
	 * 	}[] | undefined >)}
	 */
	export async function generateDynamicClassEntries(): Promise < ClassEntity[] | undefined > {
		const classList = await getClassesList();

		if (classList) {
			let vals = [];

			// Loop classes and add them to the list
			for (let key in classList) {
				const classObj = classList[key];
				if (classObj.mod1) 
					continue; // Can I use .filter before looping?
				// Create ClassEntity object and add it to the list
				vals.push({
					id: key,
					name: {
						value: classObj.name
					}
				});
			}

			return vals;
		}

		return;
	}
}

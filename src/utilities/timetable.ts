import {DbUtils} from "./dbUtils";
import {CustomLogger} from "./customLogger";
import axios from "axios";

export module Timetable {
	export type ClassElement = {
		code: string;
		name: string;
		year: string;
		curriculum: string;
		mod1?: string;
		mod2?: string;
	};

	type ClassDictionary = {
		[key: string]: ClassElement;
	};

	type ClassEntity = {
		id: string;
		name: {
			value: string;
		};
	};

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
	 * Returns the timetable for the given parameters
	 * @param year Example: "2"
	 * @param curricula Example: "A58-000"
	 * @param start
	 * @param end
	 * @param insegnamenti
	 * @returns {Promise<object[]>} The timetable
	 */
	export async function getTimetable(year : string, curricula : string, start : Date, end : Date, insegnamenti? : string[]): Promise<ClassDetails[]> {
		let params: {
			start: string;
			end: string;
			curricula: string;
			anno: string;
		} = {
			start: start.toISOString().split("T")[0],
			end: end.toISOString().split("T")[0],
			curricula: curricula,
			anno: year
		};

		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json",
			headers: {},
			params: params
		};

		if (insegnamenti && insegnamenti.length > 0) {
			const allClasses = await getClassesList();
			if (allClasses === undefined) {
				CustomLogger.error("Error while fetching classes list");
				return [];
			}

			config.url += "?";

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

		let response = await axios(config);
		if (response.status == 200) {
			let json = response.data;
			return cleanResults(json);
		} else {
			CustomLogger.error("Error while fetching timetable using config: " + response.config);
			return [];
		}
	}

	export async function getTimetableFromClassList(classes : string[], start? : Date, end? : Date): Promise < ClassDetails[] | undefined > {
		let queryQueue: {
			[key: string]: {
				[key: string]: string[];
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
			if (!(classObj.year in queryQueue)) 
				queryQueue[classObj.year] = {};
			if (!(classObj.curriculum in queryQueue[classObj.year])) 
				queryQueue[classObj.year][classObj.curriculum] = [];
			
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

	function parseElement(el : any): ClassDetails {
		if (el["aule"].length < 0) {
			CustomLogger.warn("No aule found for element: " + el["cod_modulo"]);
			el["aule"] = [{}];
		}
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

			for (let el of result) {
				if (el["extCode"] in classes) 
					continue;
				
				const cleanRes = cleanClassName(el["title"]);

				let classObj: ClassElement = {
					code: el["extCode"],
					name: cleanRes[0],
					year: year,
					curriculum: curriculum
				};
				classes[el["extCode"]] = classObj;

				// If cleanRes[0] in classesSet then it is a module 1 or 2 since we have already found a class with same name
				if (cleanRes[0] in classesSet) {
					const otherModule = classesSet[cleanRes[0]];
					switch (cleanRes[1]) {
						case "1":
							classObj.mod2 = otherModule.code;
							otherModule.mod1 = classObj.code;
							break;
						case "2":
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
		for (let curriculum of curricula) {
			if ("value" in curriculum) {
				const cla1 = await fetchClassesFromTimetable("1", curriculum.value as string);
				const cla2 = await fetchClassesFromTimetable("2", curriculum.value as string);
				const cla = {
					...cla1,
					...cla2
				};

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
	 * Resolves a class ID to a class element.
	 *
	 * @param {ClassDictionary} classes The classes list
	 * @param {string} classID The class ID to resolve
	 * @return {*}  {(ClassElement | undefined)} The class element or undefined if not found
	 */
	function resolveClassID(classes : ClassDictionary, classID : string): ClassElement | undefined {
		if (!(classID in classes)) {
			CustomLogger.warn("Class " + classID + " not found in classes list.");
			return;
		}

		return classes[classID];
	}

	/**
	 * Resolves a list of class IDs to a list of class elements.
	 *
	 * @export
	 * @param {string[]} classIDList The list of class IDs to resolve
	 * @return {*}  {Promise<ClassElement[]>} The list of class elements
	 */
	export async function resolveClassIDList(classIDList : string[]): Promise<ClassElement[]> {
		const classes = await getClassesList();

		if (classes === undefined) {
			CustomLogger.warn("Classes list is undefined.");
			return [];
		}

		return classIDList.map((el) => resolveClassID(classes, el)).filter((el) => el !== undefined)as ClassElement[];
	}

	/**
	 * Formats a class name to a more readable format.
	 * Example: "LABORATORIO DI MAKING / (2) Modulo 2" -> "Laboratorio di Making"
	 * Example: "LABORATORIO DI MAKING" -> "Laboratorio di Making"
	 *
	 * @export
	 * @param {string} name The class name to format
	 * @return {*}  {string} The formatted class name
	 */
	export function cleanClassName(name : string): string[]{
		const regex = /(.+)(?: \/ \((\d)\) Modulo \d)/;
		const match = regex.exec(name);
		let cleanName = (match !== null ? match[1] : name).trim().toLowerCase();
		cleanName = cleanName[0].toUpperCase() + cleanName.slice(1);

		return [
			cleanName, match !== null ? match[2] : "0"
		];
	}

	/**
	 * Generates the dynamic class entries for the class picker.
	 * The entries are generated from the classes list and will be used on skill launch.
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

			for (let key in classList) {
				const classObj = classList[key];
				if (classObj.mod1) 
					continue; // Can I use .filter before looping?
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

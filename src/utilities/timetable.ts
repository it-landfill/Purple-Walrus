import {dbUtils} from "./dbUtils";
import {CustomLogger} from "./customLogger";

export module timetable {
	/**
	 * Returns the timetable for the given parameters
	 * @param year Hardcode for now ("2")
	 * @param curricula Hardcode for now ("A58-000")
	 * @param start
	 * @param end
	 * @param insegnamenti
	 * @returns
	 */
	export async function getTimetable(year : string, curricula : string, start : Date, end : Date, insegnamenti? : string[]): Promise<object[]> {
		let params: {
			start: string;
			end: string;
			curricula: string;
			anno: string;
			insegnamenti?: string;
		} = {
			start: start.toISOString().split("T")[0],
			end: end.toISOString().split("T")[0],
			curricula: curricula,
			anno: year
		};

		let address = `https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?start=${params.start}&end=${params.end}&curricula=${params.curricula}&anno=${params.anno}`;

		if (insegnamenti && insegnamenti.length > 0) {
			address += `&insegnamenti=${insegnamenti.join("&insegnamenti=")}`;
		}

		const requestOptions: RequestInit = {
			method: "GET",
			redirect: "follow"
		};

		let response = await fetch(address, requestOptions);
		if (response.ok) {
			let json = await response.json();
			return cleanResults(json);
		} else {
			CustomLogger.error("Error while fetching timetable using url: " + address);
			return [];
		}
	}

	function filterElement(el : any): {
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
	} {
		if(el["aule"].length < 0) {
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

	function cleanResults(json : object[]): object[]{
		let jsonOut = json.map(filterElement);
		return jsonOut;
	}

	/**
	 * Returns the available curricula.
	 *
	 * @return {*}  {(Promise < object[] | undefined >)}
	 */
	async function getAvailableCurricula(): Promise < object[] | undefined > {
		let response = await fetch("https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@available_curricula", {
			method: "GET",
			redirect: "follow"
		});
		if (response.ok) {
			let result = await response.json();
			CustomLogger.verbose("Available curricula fetched successfully." + JSON.stringify(result));
			return result;
		} else {
			CustomLogger.error("Error while fetching available curricula.");
			return undefined;
		}
	}

	/**
	 * Fetches the available classes for the current year from the unviersity website for the specified year and curricula.
	 *
	 * @param {string} year The year of the classes to fetch
	 * @param {string} curriculum The curriculum of the classes to fetch
	 * @return {*}  {Promise < {
	 * 		[key: string]: object;
	 * 	} >}
	 */
	async function fetchClassesFromTimetable(year : string, curriculum : string): Promise < {
		[key: string]: object;
	} > {
		let classes: {
			[key: string]: object;
		} = {};

		let start = new Date();
		let end: Date;

		if (start.getMonth() >= 8) {
			// We are in a new school year. End date must be next year
			end = new Date(start.getFullYear() + 1, 8, 1);
		} else {
			// We are in the same school year. End date must be this year
			end = new Date(start.getFullYear(), 8, 1);
		}

		let address = `https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?start=${start.toISOString().split("T")[0]}&end=${end.toISOString().split(
			"T"
		)[0]}&curricula=${curriculum}&anno=${year}`;

		const requestOptions: RequestInit = {
			method: "GET",
			redirect: "follow"
		};

		let response = await fetch(address, requestOptions);
		if (response.ok) {
			let result = await response.json();

			for (let el of result) {
				if (el["extCode"] in classes) 
					continue;
				
				classes[el["extCode"]] = {
					code: el["extCode"],
					name: el["title"],
					year: year,
					curriculum: curriculum
				};
			}
		} else {
			CustomLogger.error("Error while fetching timetable using url: " + address);
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
	async function getAvailableClasses(): Promise < | {
		[key: string]: object;
	} | undefined > {
		const curricula = await getAvailableCurricula();

		if (curricula === undefined) 
			return;
		
		let classes: {
			[key: string]: object;
		} = {};
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
	export async function getClassesList(): Promise < object | undefined > {
		const updateDays = 30;

		let classesList = await dbUtils.getData("classes");

		// Check if clsses exist and has a lastUpdated field
		if (classesList === undefined || !("lastUpdated" in classesList)) {
			const classes = await getAvailableClasses();
			if (classes === undefined) 
				return;
			dbUtils.setData("classes", {
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
			dbUtils.setData("classes", {
				classes: classes,
				lastUpdated: new Date().toISOString()
			});
			return classes;
		}

		// If we reached here, the class database is valid and updated. return it.
		return classesList;
	}
}

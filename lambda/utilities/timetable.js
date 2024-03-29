"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timetable = void 0;
const dbUtils_1 = require("./dbUtils");
const customLogger_1 = require("./customLogger");
const axios_1 = require("axios");
const slotUtils_1 = require("./slotUtils");
var Timetable;
(function (Timetable) {
    /**
     * Queries the university calendar and returns the list of all the courses matching the specified criterias
     * @param year Example: "2"
     * @param curricula Example: "A58-000"
     * @param start
     * @param end
     * @param insegnamenti
     * @returns {Promise<object[]>} The timetable
     */
    async function getTimetable(year, curricula, start, end, insegnamenti) {
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
                customLogger_1.CustomLogger.error("Error while fetching classes list");
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
        customLogger_1.CustomLogger.verbose("Fetching timetable with config: " + JSON.stringify(config));
        // Query the university calendar
        let response = await (0, axios_1.default)(config);
        if (response.status == 200) {
            // Everything went well, clean the results and return them
            let json = response.data;
            return cleanResults(json);
        }
        else {
            customLogger_1.CustomLogger.error("Error while fetching timetable using config: " + response.config);
            return [];
        }
    }
    Timetable.getTimetable = getTimetable;
    /**
     * Queries the university calendar and returns the list of all the courses matching the specified criterias
     *
     * @export
     * @param {string[]} classes The list of course ids to fetch
     * @param {Date} [start] The start date of the timetable (if omitted it will be today)
     * @param {Date} [end] The end date of the timetable (if omitted it will be one week from now)
     * @return {*}  {(Promise < ClassDetails[] | undefined >)} The timetable
     */
    async function getTimetableFromClassList(classes, start, end) {
        // Since the university calendar only allows to query by year and curriculum, we need to divide the classes by year and curriculum.
        let queryQueue = {};
        const classesList = await getClassesList();
        // If classes fetch went wrong, return undefined
        if (classesList === undefined) {
            customLogger_1.CustomLogger.error("Error while fetching classes list");
            return;
        }
        // Divide classes by year and curriculum
        for (let key of classes) {
            if (!(key in classesList)) {
                customLogger_1.CustomLogger.warn("Class " + key + " is not in class list");
                continue;
            }
            const classObj = classesList[key];
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
        let timetable = [];
        for (let year in queryQueue) {
            for (let curriculum in queryQueue[year]) {
                let classes = queryQueue[year][curriculum];
                timetable = timetable.concat(await getTimetable(year, curriculum, start, end, classes));
            }
        }
        return sortTimetable(timetable);
    }
    Timetable.getTimetableFromClassList = getTimetableFromClassList;
    /**
     * Given a json object, it convers it to a ClassDetails object
     *
     * @param {*} el The json object
     * @return {*}  {ClassDetails} The ClassDetails object
     */
    function parseElement(el) {
        // If the element has no aule, add an empty one
        if (el["aule"].length < 0) {
            customLogger_1.CustomLogger.warn("No aule found for element: " + el["cod_modulo"]);
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
    function cleanResults(json) {
        let jsonOut = json.map(parseElement);
        return jsonOut;
    }
    /**
     * Returns the available curricula.
     *
     * @return {*}  {(Promise < object[] | undefined >)}
     */
    async function getAvailableCurricula() {
        // Axios config
        var config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@available_curricula",
            headers: {}
        };
        let response = await (0, axios_1.default)(config);
        if (response.status == 200) {
            let result = response.data;
            customLogger_1.CustomLogger.verbose("Available curricula fetched successfully." + JSON.stringify(result));
            return result;
        }
        else {
            customLogger_1.CustomLogger.error("Error while fetching timetable using config: " + response.config);
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
    async function fetchClassesFromTimetable(year, curriculum) {
        let classes = {};
        // Same as classes but indexed by class name
        let classesSet = {};
        let start = new Date();
        let end;
        if (start.getMonth() >= 8) {
            // We are in a new school year. End date must be next year
            end = new Date(start.getFullYear() + 1, 8, 1);
        }
        else {
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
        let response = await (0, axios_1.default)(config);
        if (response.status == 200) {
            let result = response.data;
            // For each class in the result, add it to the classes dictionary
            for (let el of result) {
                if (el["extCode"] in classes)
                    continue;
                // Clean the class name, removing the module number and trimming it
                const cleanRes = slotUtils_1.SlotUtils.cleanClassName(el["title"]);
                // Create the class object
                let classObj = {
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
                            customLogger_1.CustomLogger.warn("Class " + JSON.stringify(classObj) + " has a duplicate " + JSON.stringify(otherModule) + " but is no module 1 or 2.");
                    }
                }
                else {
                    // If !cleanRes[0] in classesSet than we have never seen this class, so we add it to classesSet
                    classesSet[cleanRes[0]] = classObj;
                }
            }
        }
        else {
            customLogger_1.CustomLogger.error("Error while fetching timetable using config: " + response.config);
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
    async function getAvailableClasses() {
        const curricula = await getAvailableCurricula();
        if (curricula === undefined)
            return;
        let classes = {};
        // For each curriculum, fetch the classes for the first and second year
        for (let curriculum of curricula) {
            if ("value" in curriculum) {
                // Fetch the classes for the first year
                const cla1 = await fetchClassesFromTimetable("1", curriculum.value);
                // Fetch the classes for the second year
                const cla2 = await fetchClassesFromTimetable("2", curriculum.value);
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
    async function getClassesList() {
        const updateDays = 30;
        let classesList = await dbUtils_1.DbUtils.getData("classes");
        // Check if classes exist and has a lastUpdated field
        if (classesList === undefined || !("lastUpdated" in classesList)) {
            const classes = await getAvailableClasses();
            if (classes === undefined)
                return;
            dbUtils_1.DbUtils.setData("classes", {
                classes: classes,
                lastUpdated: new Date().toISOString()
            });
            return classes;
        }
        // Check if the update is older than updateDays days
        let lastUpdated = new Date(classesList["lastUpdated"]);
        let now = new Date();
        let diff = Math.abs(now.getTime() - lastUpdated.getTime());
        let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        // If it is older, fetch the classes again
        if (diffDays > updateDays) {
            const classes = await getAvailableClasses();
            if (classes === undefined)
                return;
            dbUtils_1.DbUtils.setData("classes", {
                classes: classes,
                lastUpdated: new Date().toISOString()
            });
            return classes;
        }
        // If we reached here, the class database is valid and updated. return it.
        return classesList["classes"];
    }
    Timetable.getClassesList = getClassesList;
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
    async function generateDynamicClassEntries() {
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
    Timetable.generateDynamicClassEntries = generateDynamicClassEntries;
    function sortTimetable(classList) {
        let timetable = [];
        // Loop the classes and add them to the timetable
        for (let classObj of classList) {
            // If the date already exists, add the class to the existing date, otherwise create a new date
            const date = classObj.start.split("T")[0];
            let dateObj = timetable.find((obj) => obj.date === date);
            if (dateObj === undefined) {
                dateObj = {
                    date: date,
                    classes: []
                };
                timetable.push(dateObj);
            }
            dateObj.classes.push(classObj);
        }
        // Sort the classes by start time in each timetable
        for (let dateObj of timetable) {
            dateObj.classes.sort((a, b) => {
                const aStart = new Date(a.start);
                const bStart = new Date(b.start);
                return aStart.getTime() - bStart.getTime();
            });
        }
        // Sort the timetables by date
        timetable.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        return timetable;
    }
})(Timetable = exports.Timetable || (exports.Timetable = {}));

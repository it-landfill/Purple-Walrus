"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetable = void 0;
const dbUtils_1 = require("./dbUtils");
const customLogger_1 = require("./customLogger");
const axios_1 = require("axios");
var timetable;
(function (timetable) {
    /**
     * Returns the timetable for the given parameters
     * @param year Example: "2"
     * @param curricula Example: "A58-000"
     * @param start
     * @param end
     * @param insegnamenti
     * @returns {Promise<object[]>} The timetable
     */
    async function getTimetable(year, curricula, start, end, insegnamenti) {
        let params = {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
            curricula: curricula,
            anno: year
        };
        if (insegnamenti && insegnamenti.length > 0) {
            params.insegnamenti = insegnamenti.join("&insegnamenti=");
        }
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json",
            headers: {},
            params: params
        };
        customLogger_1.CustomLogger.verbose("Fetching timetable with config: " + JSON.stringify(config));
        //  if (insegnamenti && insegnamenti.length > 0) {  	config.params.insegnamenti = insegnamenti.join("&insegnamenti=")}; }
        let response = await (0, axios_1.default)(config);
        if (response.status == 200) {
            let json = response.data;
            return cleanResults(json);
        }
        else {
            customLogger_1.CustomLogger.error("Error while fetching timetable using config: " + response.config);
            return [];
        }
    }
    timetable.getTimetable = getTimetable;
    function filterElement(el) {
        if (el["aule"].length < 0) {
            customLogger_1.CustomLogger.warn("No aule found for element: " + el["cod_modulo"]);
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
    function cleanResults(json) {
        let jsonOut = json.map(filterElement);
        return jsonOut;
    }
    /**
     * Returns the available curricula.
     *
     * @return {*}  {(Promise < object[] | undefined >)}
     */
    async function getAvailableCurricula() {
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
        for (let curriculum of curricula) {
            if ("value" in curriculum) {
                const cla1 = await fetchClassesFromTimetable("1", curriculum.value);
                const cla2 = await fetchClassesFromTimetable("2", curriculum.value);
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
    async function getClassesList() {
        const updateDays = 30;
        let classesList = await dbUtils_1.dbUtils.getData("classes");
        // Check if classes exist and has a lastUpdated field
        if (classesList === undefined || !("lastUpdated" in classesList)) {
            const classes = await getAvailableClasses();
            if (classes === undefined)
                return;
            dbUtils_1.dbUtils.setData("classes", {
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
        if (diffDays > updateDays) {
            const classes = await getAvailableClasses();
            if (classes === undefined)
                return;
            dbUtils_1.dbUtils.setData("classes", {
                classes: classes,
                lastUpdated: new Date().toISOString()
            });
            return classes;
        }
        // If we reached here, the class database is valid and updated. return it.
        return classesList["classes"];
    }
    timetable.getClassesList = getClassesList;
    /**
     * Resolves a class ID to a class element.
     *
     * @param {ClassDictionary} classes The classes list
     * @param {string} classID The class ID to resolve
     * @return {*}  {(ClassElement | undefined)} The class element or undefined if not found
     */
    function resolveClassID(classes, classID) {
        if (!(classID in classes)) {
            customLogger_1.CustomLogger.warn("Class " + classID + " not found in classes list.");
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
    async function resolveClassIDList(classIDList) {
        const classes = await getClassesList();
        if (classes === undefined) {
            customLogger_1.CustomLogger.warn("Classes list is undefined.");
            return [];
        }
        return classIDList.map((el) => resolveClassID(classes, el)).filter((el) => el !== undefined);
    }
    timetable.resolveClassIDList = resolveClassIDList;
})(timetable = exports.timetable || (exports.timetable = {}));

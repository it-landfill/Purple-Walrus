export declare module Timetable {
    /**
     * This represents a single course
     */
    type ClassElement = {
        code: string;
        name: string;
        year: string;
        curriculum: string;
        mod1?: string;
        mod2?: string;
    };
    /**
     * This is the dictionary of all the courses available with the course code as key
     */
    type ClassDictionary = {
        [key: string]: ClassElement;
    };
    /**
     * This represents a single course entry used by dynamic entity resolution
     */
    type ClassEntity = {
        id: string;
        name: {
            value: string;
        };
    };
    /**
     * This represents info on a specific class fetched from the university calendar
     */
    type ClassDetails = {
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
     * THis represents a timetable split by days
     */
    type TimetableEntry = {
        date: string;
        classes: ClassDetails[];
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
    function getTimetable(year: string, curricula: string, start: Date, end: Date, insegnamenti?: string[]): Promise<ClassDetails[]>;
    /**
     * Queries the university calendar and returns the list of all the courses matching the specified criterias
     *
     * @export
     * @param {string[]} classes The list of course ids to fetch
     * @param {Date} [start] The start date of the timetable (if omitted it will be today)
     * @param {Date} [end] The end date of the timetable (if omitted it will be one week from now)
     * @return {*}  {(Promise < ClassDetails[] | undefined >)} The timetable
     */
    function getTimetableFromClassList(classes: string[], start?: Date, end?: Date): Promise<TimetableEntry[] | undefined>;
    /**
     * Returns the available classes for the current year.
     * The classes are either loadaed from the database or fetched from the university website if not present or to old.
     *
     * @export
     * @return {*}  {(Promise < object | undefined >)}
     */
    function getClassesList(): Promise<ClassDictionary | undefined>;
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
    function generateDynamicClassEntries(): Promise<ClassEntity[] | undefined>;
}

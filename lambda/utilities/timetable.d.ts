export declare module timetable {
    /**
     * Returns the timetable for the given parameters
     * @param year Hardcode for now ("2")
     * @param curricula Hardcode for now ("A58-000")
     * @param start
     * @param end
     * @param insegnamenti
     * @returns
     */
    function getTimetable(year: string, curricula: string, start: Date, end: Date, insegnamenti?: string[]): Promise<object[]>;
    /**
     * Returns the available classes for the current year.
     * The classes are either loadaed from the database or fetched from the university website if not present or to old.
     *
     * @export
     * @return {*}  {(Promise < object | undefined >)}
     */
    function getClassesList(): Promise<object | undefined>;
}

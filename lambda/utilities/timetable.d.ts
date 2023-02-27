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
}

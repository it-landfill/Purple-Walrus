export declare module timetable {
    /**
     * Returns the timetable for the given parameters
     * @param year
     * @param curricula
     * @param start
     * @param end
     * @param insegnamenti
     * @returns
     */
    function getTimetable(year: string, curricula: string, start: Date, end: Date, insegnamenti?: string[]): Promise<object[]>;
}

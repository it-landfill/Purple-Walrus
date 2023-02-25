"use strict";
// var requestOptions = { 	method: "GET", 	redirect: "follow" }; fetch(
// "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?start=2023-01-01&end=2023-03-01&curricula=A58-000&anno=2&insegnamen"
// + 			"ti=2022-000-343114--I", 	requestOptions ).then((response) => response.text()).then((result) => console.log(result)).catch((error) =>
// console.log("error", error));
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetable = void 0;
var timetable;
(function (timetable) {
    /**
     * Returns the timetable for the given parameters
     * @param year
     * @param curricula
     * @param start
     * @param end
     * @param insegnamenti
     * @returns
     */
    async function getTimetable(year, curricula, start, end, insegnamenti) {
        let params = {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
            curricula: curricula,
            anno: year
        };
        let address = `https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?start=${params.start}&end=${params.end}&curricula=${params.curricula}&anno=${params.anno}`;
        if (insegnamenti && insegnamenti.length > 0) {
            address += `&insegnamenti=${insegnamenti.join("&insegnamenti=")}`;
        }
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        let response = await fetch(address, requestOptions);
        if (response.ok) {
            let json = await response.json();
            return cleanResults(json);
        }
        else {
            console.error("Error while fetching timetable using url: " + address);
            return [];
        }
    }
    timetable.getTimetable = getTimetable;
    function filterElement(el) {
        if (el["aule"].length < 0) {
            console.warn("No aule found for element: " + el["cod_modulo"]);
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
})(timetable = exports.timetable || (exports.timetable = {}));
timetable.getTimetable("2", "A58-000", new Date("2023-02-01"), new Date("2023-03-01"), ["2022-000-343114--I"]).then((result) => console.log(result));

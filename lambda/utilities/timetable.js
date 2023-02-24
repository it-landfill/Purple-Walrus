"use strict";
// var requestOptions = { 	method: "GET", 	redirect: "follow" }; fetch(
// "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?start=2023-01-01&end=2023-03-01&curricula=A58-000&anno=2&insegnamen"
// + 			"ti=2022-000-343114--I", 	requestOptions ).then((response) => response.text()).then((result) => console.log(result)).catch((error) =>
// console.log("error", error));
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetable = void 0;
var timetable;
(function (timetable) {
    async function getTimetable() {
        const address = "https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json?start=2023-01-01&end=2023-03-01&curricula=A58-000&anno=2&insegnamen" +
            "ti=2022-000-343114--I";
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        let response = await fetch(address, requestOptions);
        let json = await response.json();
        return cleanResults(json);
    }
    timetable.getTimetable = getTimetable;
    function filterElement(el) {
        return {
            "code": el["cod_modulo"],
            "docente": el["docente"],
            "start": el["start"],
            "end": el["end"]
        };
    }
    function cleanResults(json) {
        let jsonOut = json.map(filterElement);
        return jsonOut;
    }
})(timetable = exports.timetable || (exports.timetable = {}));
timetable.getTimetable().then((result) => console.log(result));

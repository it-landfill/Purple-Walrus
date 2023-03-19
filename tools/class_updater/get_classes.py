import json
from datetime import datetime
from pathlib import Path

import requests


def sanitize_path(in_path):
	path = in_path.replace(" ", "_")
	path = path.replace("/", "-")
	path = path.replace("\\", "-")
	path = path.replace(":", "-")
	path = path.replace("\n", "-")
	path = path.replace("-_-", "-")
	path = path.replace("_-_", "-")

	return path


def getCurricula():
	curriculaResponse = requests.get(
		"https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@available_curricula"
	).json()

	return {
		curriculum["value"]: curriculum["label"]
		for curriculum in curriculaResponse
	}


def getClassesForYear(curricula, year):

	classes = {}

	start_date = datetime.now()
	if start_date.month >= 8:
		end_date = datetime(start_date.year, 12, 31)
	else:
		end_date = datetime(start_date.year, 8, 1)

	for key in curricula:
		payload = {
			"start": start_date.strftime("%Y-%m-%d"),
			"end": end_date.strftime("%Y-%m-%d"),
			"anno": year,
			"curricula": key,
		}
		classesResponse = requests.get(
			"https://corsi.unibo.it/magistrale/informatica/orario-lezioni/@@orario_reale_json",
			params=payload,
		)

		if classesResponse.status_code != 200:
			print("Error while getting classes for year " + year +
				  " and curriculum " + key)
			return None

		for classJson in classesResponse.json():
			if classJson["cod_modulo"] not in classes:
				classes[classJson["cod_modulo"]] = {
					"title": classJson["title"],
					"ext_code": classJson["extCode"],
					"year": year,
					"curriculum": key,
				}
	return classes


def populate_lessons():
	base_git_url = "https://raw.githubusercontent.com/ale-ben/OrariUniBo/master/out/"

	curricula = getCurricula()

	classes1 = getClassesForYear(curricula, "1")

	classes2 = getClassesForYear(curricula, "2")

	return classes1 | classes2

	


if __name__ == "__main__":
	print(populate_lessons())

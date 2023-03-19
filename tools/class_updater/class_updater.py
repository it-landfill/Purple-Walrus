import json
from pathlib import Path

from get_classes import populate_lessons

def update_type(interaction_model, type_name, new_values):
	for i, el in enumerate(interaction_model["interactionModel"]["languageModel"]["types"]):
		if el["name"] == type_name:
			interaction_model["interactionModel"]["languageModel"]["types"][i]["values"] = new_values
			return interaction_model

def format_class(classes):
	return [
		{
			"id": classes[cl]["ext_code"],
			"name": {
				"value": classes[cl]["title"],
			}
		} for cl in classes
	]			

def update_version(interaction_model):
	interaction_model["version"] = str(int(interaction_model["version"]) + 1)
	return interaction_model

def main():
	# Load the interaction model and parse it
	interaction_model_path = Path.cwd().joinpath("..").joinpath("..").joinpath("skill-package").joinpath("interactionModels").joinpath("custom").joinpath("it-IT.json")
	interaction_model = json.load(interaction_model_path.open())

	# Get the classes
	classes = populate_lessons()

	# Update the interaction model
	interaction_model = update_type(interaction_model, "ClassNames", format_class(classes))

	# Update the interaction model version
	interaction_model = update_version(interaction_model)
	print(interaction_model)

	# Save the interaction model
	json.dump(interaction_model, interaction_model_path.open("w"), indent=4)

if __name__ == "__main__":
	main()
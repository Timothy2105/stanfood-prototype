import json
import os
from collections import Counter
import re

# Configuration for name replacements
NAME_REPLACEMENTS = {
    "Allergy Friendly Bbq Sauce" : "BBQ Sauce",
    "Allergy-Friendly Bbq Sauce" : "BBQ Sauce",
    "Buttermilk Sauce" : "Buttermilk",
    "Carrot Extractives" : "Carrot",
    "Carrot" : "Carrot",
    "Canola/Olive Oil Blend" : "Canola/Olive Oil",
    "Canola Or Soybean Oil" : "Canola or Soybean Oil",
    "Cheese Sauce" : "Cheese",
    "Chipotle Aioli Sauce" : "Chipotle Aioli",
    "Chipotle Pepper In Adobo Sauce" : "Adobo Sauce",
    "Curry Powder" : "Curry",
    "Curry Sauce" : "Curry",
    "Cumin Seeds" : "Cumin",
    "Dehydrated Garlic" : "Garlic",
    "Dehydrated Mashed Potato Pearls" : "Mashed Potato",
    "Expeller Pressed Canola Oil" : "Canola Oil",
    "Breaded Okra Fried In Canola Oil" : "Breaded Okra",
    "Garlic Powder" : "Garlic",
    "Guajillo Chili Powder" : "Guajillo Chili",
    "Lemon Juice" : "Lemon",
    "Lime Juice" : "Lime",
    "Liquid Sugar" : "Sugar",
    "Onion Powder" : "Onion",
    "Overnight Oats" : "Oats",
    "Pesto Sauce" : "Pesto",
    "Please refer to dining hall chef or manager for ingredient and allergen information" : "SPECIAL",
    "Rosemary Extract" : "Rosemary",
    "Seasonal Assortment Of Fresh Vegetables" : "Fresh Vegetables",
    "Tomato Paste" : "Tomato",
    "Turmeric Extractives" : "Turmeric",
    "Yeast Extract" : "Yeast",
}

# Configuration for exclusions
EXCLUSIONS = {
    'ingredients': [
        'Acetic Acid', 'Achiote Paste', 'Aluminum Sulfate', 'Amaranth', 
        'Ammonium Sulfate', 'Amylase', 'Annatto Extract', 'Artificial Flavors', 
        'Ascorbic Acid', 'Baking Powder', 'Bamboo Fiber', 'Bay Leaf', 'Black Pepper', 
        'Blackstrap Molasses', 'Calcium Phosphate', 'Calcium Propionate', 
        'Calcium Silicate', 'Calcium Sulfate', 'Cellulose From Bamboo', 'Citric Acid',
        'Clove Spice', 'Condiments', 'Cultured Dextrose', 'Datem', 'Dextrose', 
        'Diglycerides', 'Disodium Dihydrogen Pyrophosphate', 'Enzymes', 
        'Evaporated Cane Juice', 'Fajita Seasoning', 'Furikake Seasoning',
        'Garnish', 'Gellan Gum', 'Guar Gum', 'Guar Gum Rice Bran Extract', 'Gum Arabic',
        'Herbs', 'Herbs De Provence', 'High Oleic Safflower Oil', 'L-Cysteine',
        'Leavings', 'Malt Powder', 'Maltodextrin', 'Methylcellulose',
        'Microcrystalline Cellulose', 'Mono-Diglycerides', 'Monocalcium Phosphate',
        'Monoglycerides', 'Natural Flavors', 'Nisin', 'Pea Protein Isolate', 'Saffron',
        'Sage Extract', 'Sage Oil', 'Salt', 'Sea Salt', 'Semolina', 'Sheep Casing', 
        'Sodium Acid Pyrophosphate', 'Sodium Aluminum Phosphate', 'Sodium Bicarbonate',
        'Sodium Erythorbate', 'Sodium Nitrite', 'Sodium Phosphate', 'Sodium Silicoaluminate',
        'Sodium Stearoyl Lactylate', 'Sorbitan Monostearate', 'Spice Rub', 'Spices', 
        'Stir-Fry Sauce', 'Succinic Acid', 'Sugar', 'Sumac Powder', 'Sweet & Spicy Sauce',
        'Swiss Chard', 'Szechuan Sauce', 'Tamari Sauce', 'Tetrasodium Pyrophosphate',
        'Transglutaminase', 'Vegetable Glycerine', 'White Sauce', 'Xanthan Gum',
        'Chinese 5-Spice Powder', 'Potassium Citrate',
        ],
    'allergens': [],
    'dishes': [],
    'locations': [],
    'meal_times': [],
    'dates': []
}

def get_data_directory():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(current_dir, '..', '..', 'stanfood_app', 'assets', 'data'))

def load_combined_dishes():
    data_dir = get_data_directory()
    json_path = os.path.join(data_dir, 'combined_dishes.json')
    with open(json_path, 'r') as file:
        return json.load(file)

def save_filter_json(data, filename):
    data_dir = get_data_directory()
    output_path = os.path.join(data_dir, filename)
    with open(output_path, 'w') as file:
        json.dump(data, file, indent=2)

def clean_and_replace_name(name):
    # Remove everything after the first opening parenthesis or bracket
    cleaned = re.split(r'[\(\[]', name)[0]
    # Remove leading/trailing whitespace and commas
    cleaned = cleaned.strip().strip(',')
    # Apply replacements
    return NAME_REPLACEMENTS.get(cleaned, cleaned)

def create_filter_files(dishes):
    allergens = Counter()
    dates = Counter()
    dish_names = Counter()
    ingredients = Counter()
    locations = Counter()
    meal_times = Counter()

    unique_locations = set()
    unique_meal_times = set()
    
    # Count occurrences
    for dish in dishes:
        if dish['name']:  # Only process the dish if it has a non-empty name
            clean_name = clean_and_replace_name(dish['name'])
            dish_names[clean_name] += 1
            
            allergens.update(dish['allergens'])
            
            if dish['date']:
                dates[dish['date']] += 1
            
            for ing in dish['ingredients']:
                clean_ing = clean_and_replace_name(ing)
                if clean_ing:
                    ingredients[clean_ing] += 1
            
            if dish['location']:
                locations[dish['location']] += 1
                unique_locations.add(dish['location'])
            
            if dish['meal_time']:
                meal_times[dish['meal_time']] += 1
                unique_meal_times.add(dish['meal_time'])
        else:
            if dish['location']:
                unique_locations.add(dish['location'])
            if dish['meal_time']:
                unique_meal_times.add(dish['meal_time'])


    # Include all locations and meal types with 0 if no data
    for location in unique_locations:
        if location not in locations:
            locations[location] = 0
    
    for meal_time in unique_meal_times:
        if meal_time not in meal_times:
            meal_times[meal_time] = 0

    filters = {
        'allergens': allergens,
        'dates': dates,
        'dishes': dish_names,
        'ingredients': ingredients,
        'locations': locations,
        'meal_times': meal_times
    }

    for filter_name, counter in filters.items():
        filter_data = [
            {"name": item, "count": count}
            for item, count in sorted(counter.items())
            if item and item not in EXCLUSIONS.get(filter_name, [])
        ]
        save_filter_json(filter_data, f'{filter_name}_filter.json')

if __name__ == '__main__':
    combined_dishes = load_combined_dishes()
    create_filter_files(combined_dishes)
    print(f"Filter JSON files have been created successfully in {get_data_directory()}")
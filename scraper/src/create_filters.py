import json
import os
from collections import Counter

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

def create_filter_files(dishes):
    allergens = Counter()
    dates = Counter()
    dish_names = Counter()
    ingredients = Counter()
    locations = Counter()
    meal_times = Counter()

    # Initialize values with 0
    for dish in dishes:
        allergens.update({allergen: 0 for allergen in dish['allergens']})
        dates[dish['date']] = 0
        locations[dish['location']] = 0
        meal_times[dish['meal_time']] = 0
        if dish['name']:
            dish_names[dish['name']] = 0
        ingredients.update({ingredient: 0 for ingredient in dish['ingredients']})

    # Count dishes
    for dish in dishes:
        if dish['name']:
            allergens.update(dish['allergens'])
            dates[dish['date']] += 1
            dish_names[dish['name']] += 1
            ingredients.update(dish['ingredients'])
            locations[dish['location']] += 1
            meal_times[dish['meal_time']] += 1

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
            {"filter": item, "count": count}
            for item, count in sorted(counter.items()) if item
        ]
        save_filter_json(filter_data, f'{filter_name}_filter.json')

if __name__ == '__main__':
    combined_dishes = load_combined_dishes()
    create_filter_files(combined_dishes)
    print(f"Filter JSON files have been created successfully in {get_data_directory()}")
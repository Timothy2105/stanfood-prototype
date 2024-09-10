import csv
import json
import os
import re
from datetime import datetime
import unicodedata

def normalize_text(text):
    # Normalize Unicode characters
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')
    
    # Replace smart quotes with straight quotes
    text = text.replace('\u201c', '"').replace('\u201d', '"')
    text = text.replace('\u2018', "'").replace('\u2019', "'")
    
    # Replace ñ with n
    text = text.replace('ñ', 'n').replace('Ñ', 'N')
    
    return text

def title_case(text):
    def capitalize_word(word):
        if "/" in word:
            return "/".join(part.capitalize() for part in word.split("/"))
        elif "-" in word:
            return "-".join(part.capitalize() for part in word.split("-"))
        elif "'" in word:
            return "'".join(part.capitalize() for part in word.split("'"))
        else:
            return word.capitalize()

    # Split the text into words, preserving spaces and special characters
    words = re.findall(r'\S+|\s+', text)
    
    # Capitalize each word (account for parentheses and quotation marks)
    result = []
    in_parentheses = False
    after_quote = False
    for word in words:
        if '(' in word: 
            in_parentheses = True
            word = '(' + capitalize_word(word[1:])
        elif ')' in word:
            in_parentheses = False
            word = capitalize_word(word[:-1]) + ')'
        elif '"' in word or "'" in word:
            # Capitalize the part after the quotation mark
            parts = re.split(r'(["\'])', word)
            word = ''.join(capitalize_word(part) if i % 2 == 0 or after_quote else part for i, part in enumerate(parts))
            after_quote = word.endswith('"') or word.endswith("'")
        elif in_parentheses or word.strip() or after_quote:
            word = capitalize_word(word)
            after_quote = False
        result.append(word)
    
    return ''.join(result)

def split_joined_words(text):
    # List of misspelled word pairs
    word_pairs = [
        ('Cumin', 'seed'),
        ('Olive', 'oil'),
        ('Vegetable', 'oil'),
        ('Soy', 'sauce'),
        ('Garlic', 'powder'),
        ('Onion', 'powder'),
    ]
    
    for first, second in word_pairs:
        pattern = f'({first}{second})'
        replacement = f'{first} {second}'
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    return text

def replace_ingredient_words(ingredient):
    replacements = {
        "Mindful Chick'N" : "Chicken",
        "Artificial Flavor" : "Artificial Flavors",
        "Bell Pepper" : "Bell Peppers",
        "Cumin Seed" : "Cumin Seeds",
        "Flaxseed" : "Flax Seeds",
        "Green Onion" : "Green Onions",
        "Mustard Seed" : "Mustard Seeds",
        "Natural Flavor" : "Natural Flavors",
        "Natural Flavorings" : "Natural Flavors",
        "Olive Canola Oil" : "Canola Olive Oil",
        "Onion" : "Onions",
        "Palm Fruit Oil" : "Palm Oil",
        "Radishes" : "Radish",
        "Red Pepper Flake" : "Red Pepper Flakes",
        "Strawberry" : "Strawberries",
        "Tomato" : "Tomatoes",
        "Tortilla" : "Tortillas",
        "Onions Powder" : "Onion Powder",
        "Pineapple" : "Pineapples",
    }
    
    for old, new in replacements.items():
        ingredient = re.sub(r'\b' + re.escape(old) + r'\b', new, ingredient, flags=re.IGNORECASE)
    
    return ingredient

def normalize_ingredient(ingredient):
    special_message = "Please refer to dining hall chef or manager for ingredient and allergen information"
    if ingredient.strip() == special_message:
        return ingredient
    
    # Account for missing parenthesis
    if ingredient.strip().lower().startswith("and/or condiments)"):
        return "Condiments"
    
    # Normalize text
    ingredient = normalize_text(ingredient)
    
    # Split incorrectly joined words
    ingredient = split_joined_words(ingredient)
    
    # Replace specific ingredient words
    ingredient = replace_ingredient_words(ingredient)
    
    return title_case(ingredient)

def parse_filename(filename):
    # Extract location, date, and meal time from filename
    pattern = r'(.+)_(\d{1,2}-\d{1,2}-\d{4})_(.+)\.csv'
    match = re.match(pattern, filename)
    if match:
        location, date_str, meal_time = match.groups()
        try:
            # Reformat to MM-DD-YYYY
            date = datetime.strptime(date_str, "%m-%d-%Y").strftime("%m-%d-%Y")
        except ValueError:
            print(f"Invalid date format in filename: {filename}")
            date = None
        return normalize_text(location.replace('_', ' ')), date, normalize_text(meal_time)
    return None, None, None

def split_ingredients(ingredient_list):
    ingredients = []
    current_ingredient = []
    bracket_count = 0
    parenthesis_count = 0

    for char in ingredient_list:
        if char == ',' and bracket_count == 0 and parenthesis_count == 0:
            if current_ingredient:
                ingredients.append(''.join(current_ingredient).strip())
                current_ingredient = []
        else:
            if char == '[':
                bracket_count += 1
            elif char == ']':
                bracket_count = max(0, bracket_count - 1)
            elif char == '(':
                parenthesis_count += 1
            elif char == ')':
                parenthesis_count = max(0, parenthesis_count - 1)
            current_ingredient.append(char)

    if current_ingredient:
        ingredients.append(''.join(current_ingredient).strip())

    return ingredients

def process_csv(file_path):
    filename = os.path.basename(file_path)
    location, date, meal_time = parse_filename(filename)
    
    dishes = []

    try:
        with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            
            # Read header
            header = next(reader, None)
            if not header:
                print(f"Warning: Empty file or missing header in {file_path}")
                # Create a placeholder dish for empty files
                dishes.append({
                    "name": "",
                    "ingredients": [],
                    "allergens": [],
                    "meal_time": meal_time,
                    "date": date,
                    "location": location
                })
                return dishes

            row_count = 0
            for row in reader:
                row_count += 1
                # Ensure at least 3 columns
                if len(row) < 3:
                    print(f"Warning: Row with insufficient data in {file_path}: {row}")
                    continue

                dish_name, ingredient_list, allergen_list = map(normalize_text, row[:3])
                
                dish_name = dish_name.strip()
                
                # Processing ingredients
                ingredients = [normalize_ingredient(i.strip()) for i in split_ingredients(ingredient_list) if i.strip()]
                
                # Processing allergens
                allergens = [normalize_ingredient(a.strip()) for a in re.split(r',\s*', allergen_list) if a.strip()]
                
                dishes.append({
                    "name": dish_name,
                    "ingredients": ingredients,
                    "allergens": allergens,
                    "meal_time": meal_time,
                    "date": date,
                    "location": location
                })

            if row_count == 0:
                print(f"Warning: No data rows found in {file_path}")
                # Create placeholder dish
                dishes.append({
                    "name": "",
                    "ingredients": [],
                    "allergens": [],
                    "meal_time": meal_time,
                    "date": date,
                    "location": location
                })

    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")
        return None

    return dishes

def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=2)

def main():
    # Get the current script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Navigate up to the root of the project (where scraper and stanfood_app are)
    project_root = os.path.dirname(os.path.dirname(script_dir))
    
    # Set the base directory for CSV files
    base_dir = os.path.join(script_dir, '..', 'data')
    
    # Set the output file path
    output_file = os.path.join(project_root, 'stanfood_app', 'assets', 'data', 'combined_dishes.json')

    all_dishes = []

    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.csv'):
                file_path = os.path.join(root, file)
                dishes = process_csv(file_path)
                
                if dishes is not None:
                    all_dishes.extend(dishes)

    if not all_dishes:
        print("Warning: No data was processed. Check your CSV files and their locations.")
    else:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Save the JSON file
        with open(output_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(all_dishes, jsonfile, indent=2)
        
        print(f"Combined JSON file has been generated at: {output_file}")
        print(f"Total number of dishes processed: {len(all_dishes)}")

if __name__ == "__main__":
    main()
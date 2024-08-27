from datetime import datetime, timedelta
from pytz import timezone
from selenium.webdriver.common.by import By 

import os
import csv

dining_hall_list = [
    'Arrillaga', 'Branner', 'EVGR', 'FlorenceMoore', 
    'GerhardCasper', 'Lakeside', 'Ricker', 'Stern', 'Wilbur'
]

dining_hall_alias = {
    'Arrillaga': 'Arrillaga Family Dining Commons',
    'Branner': 'Branner Dining',
    'EVGR': 'EVGR Dining',
    'FlorenceMoore': 'Florence Moore Dining',
    'GerhardCasper': 'Gerhard Casper Dining',
    'Lakeside': 'Lakeside Dining',
    'Ricker': 'Ricker Dining',
    'Stern': 'Stern Dining',
    'Wilbur': 'Wilbur Dining'
}

meal_type_list = ['Breakfast', 'Lunch', 'Dinner', 'Brunch']

# Timezone for accurate timing
pst_timezone = timezone('America/Los_Angeles')

def generate_date_array():
    """
    Generate an array of dates for the next 7 days in m/d/yyyy format
    """
    pst_now = datetime.now(pst_timezone)
    return [(pst_now + timedelta(days=i)).strftime('%m/%d/%Y').lstrip("0").replace("/0", "/") for i in range(7)]

dates_list = generate_date_array()

def cleanup_old_data():
    """
    Remove directories for dates older than the current date
    """
    pst_now = datetime.now(pst_timezone).date()

    data_directory = os.path.join('..', 'data')
    deleted_any = False  # Flag to check if any directories were deleted

    for date_folder in os.listdir(data_directory):
        try:
            # Convert folder name to datetime object
            folder_date = datetime.strptime(date_folder, '%m-%d-%Y').date()
            if folder_date < pst_now:
                folder_path = os.path.join(data_directory, date_folder)
                if os.path.isdir(folder_path):
                    print(f"Found old directory: {folder_path}")
                    for root, dirs, files in os.walk(folder_path, topdown=False):
                        for name in files:
                            file_path = os.path.join(root, name)
                            os.remove(file_path)
                            print(f"Deleted file: {file_path}")
                        for name in dirs:
                            dir_path = os.path.join(root, name)
                            os.rmdir(dir_path)
                            print(f"Deleted directory: {dir_path}")
                    os.rmdir(folder_path)
                    print(f"Deleted directory: {folder_path}")
                    deleted_any = True
        except ValueError:
            print(f"Skipping invalid folder name: {date_folder}")
            continue

    if not deleted_any:
        print("No old directories found to delete.")
    else:
        print("Cleanup complete. All old data has been removed.")

def parse_food_icon(file):
    """
    Extract the icon identifier from the file path
    """
    return (file.split("/")[-1]).split(".")[0]

def add_icons_to_allergens(allergens, icons):
    """
    Add dietary information to the allergens list based on the icons
    """
    for icon in icons:
        if icon == "GF":
            allergens.append("gluten-free")
        elif icon == "VGN":
            allergens.append("vegan")
        elif icon == "V":
            allergens.append("vegetarian")
        elif icon == "H":
            allergens.append("halal")
        elif icon == "K":
            allergens.append("kosher")
    return allergens

def extract_food_info(item):
    """
    Extract food details from a menu item element
    """
    name = item.find_element(By.CLASS_NAME, 'clsLabel_Name').text
    ingredients = item.find_element(By.CLASS_NAME, 'clsLabel_Ingredients').text.replace("Ingredients: ", "")
    allergens = item.find_element(By.CLASS_NAME, 'clsLabel_Allergens').text.replace("Allergens: ", "").split(", ")
    icons = item.find_elements(By.CLASS_NAME, 'clsLabel_IconImage')
    icon_srcs = [parse_food_icon(icon.get_attribute('src')) for icon in icons]

    allergens_with_icons = add_icons_to_allergens(allergens, icon_srcs)

    food_info = {
        'name': name,
        'ingredients': ingredients,
        'allergens': allergens_with_icons,
    }

    return food_info

def save_info(driver, selected_date, selected_dining_hall, selected_meal_type):
    """
    Save menu information to a CSV file based on date, hall, and meal
    """
    food_items = driver.find_elements(By.XPATH, '//div[starts-with(@class, "clsMenuItem")]')
    food_info_list = []
    for item in food_items:
        food_info_list.append(extract_food_info(item))
    
    # In case further processing required
    menu_info = {
        'diningHall': dining_hall_alias[selected_dining_hall],
        'day': selected_date,
        'meal': selected_meal_type,
        'foodInfo': food_info_list,
    }

    # Prepare the directory structure
    date_folder = os.path.join('..', 'data', selected_date.replace('/', '-'))
    meal_folder = os.path.join(date_folder, selected_meal_type)
    os.makedirs(meal_folder, exist_ok=True)

    # Create CSV filename and route file
    csv_filename = f"{dining_hall_alias[selected_dining_hall]}_{selected_date.replace('/', '-')}_{selected_meal_type}.csv"
    csv_path = os.path.join(meal_folder, csv_filename)
    
    # Save data to the CSV file
    with open(csv_path, 'w', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['Name', ' Ingredients', ' Allergens'])
        for food_info in food_info_list:
            allergens_formatted = ', '.join(food_info['allergens']).lstrip(', ').strip()
            writer.writerow([food_info['name'], food_info['ingredients'], allergens_formatted])
    
    print(f"Saved data to {csv_path}")
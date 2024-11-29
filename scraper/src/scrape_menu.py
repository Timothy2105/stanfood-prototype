from selenium import webdriver
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC 

import json
from datetime import datetime
from pytz import timezone
from dining_info import *

def find_dropdown(id_name):
    """
    Locate and return the dropdown element based on provided id_name
    """
    dropdown_id = f'MainContent_lst{id_name}'
    return WebDriverWait(driver, 5, 100).until(
        EC.presence_of_element_located((By.ID, dropdown_id))
    )

def select_in_dropdown(id_name):
    """
    Retrieve the currently selected value from the dropdown
    """
    item_id = f'#MainContent_lst{id_name} option[selected="selected"]'
    return WebDriverWait(driver, 5, 100).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, item_id))
    ).get_attribute('value')

# Setup timezones for PST
pst_timezone = timezone('America/Los_Angeles')
pst_now = datetime.now(pst_timezone)

# Set up Chrome options
chrome_options = webdriver.ChromeOptions()
# Uncomment the next line to run in headless mode
# chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-extensions')

# Set up WebDriver
# chromedriver_path = '../chromedriver.exe'  # path for Windows
chromedriver_path = '../chromedriver'
service = Service(executable_path=chromedriver_path)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open Stanford Dining Menu page
url = 'https://rdeapps.stanford.edu/dininghallmenu/'
driver.get(url)

# Cleanup old data
cleanup_old_data()

# Initialize page with dummy settings
dummy_date = pst_now.strftime('%m/%d/%Y').lstrip("0").replace("/0", "/")
dummy_hall = "Arrillaga"
dummy_meal = "Breakfast"

Select(driver.find_element(By.ID, 'MainContent_lstDay')).select_by_value(dummy_date)
Select(driver.find_element(By.ID, 'MainContent_lstLocations')).select_by_value(dummy_hall)
Select(driver.find_element(By.ID, 'MainContent_lstMealType')).select_by_value(dummy_meal)

# Iterate through dates, halls, and meals
for date in dates_list:
    Select(find_dropdown('Day')).select_by_value(date)
    selected_date = select_in_dropdown('Day')
    print("Fetching data for:", selected_date)

    for hall in dining_hall_list:
        Select(find_dropdown('Locations')).select_by_value(hall)
        selected_dining_hall = select_in_dropdown('Locations')
        print("Selected dining hall:", dining_hall_alias[selected_dining_hall])

        for meal in meal_type_list:
            Select(find_dropdown('MealType')).select_by_value(meal)
            selected_meal_type = select_in_dropdown('MealType')
            print("Selected meal type:", selected_meal_type)

            # Extract and save the menu information to CSV file
            save_info(driver, selected_date, selected_dining_hall, selected_meal_type)

driver.quit()
print("Menu scraping completed successfully")
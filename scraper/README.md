# Stanfood Scraper Program

This is a web scraper for the Stanfood app prototype, designed to extract data from the Stanfood R&DE website.

## Setup Instructions

1. **Check Your Chrome Version**
   - Open Google Chrome.
   - Click on the three vertical dots in the top-right corner of the browser.
   - Go to **Help** > **About Google Chrome**.
   - Note down the version number displayed

2. **Download the Correct ChromeDriver**
   - Visit [ChromeDriver Downloads](https://developer.chrome.com/docs/chromedriver/downloads).
   - Find the ChromeDriver version that matches your Chrome version.
   - **Note:** If you cannot find the exact ChromeDriver version for your Chrome version because it's too recent or not listed, download the latest available version closest to your current Chrome version.
   - Download the appropriate ChromeDriver for your operating system (Windows, macOS, Linux).

3. **Place ChromeDriver in the Scraper Folder**
   - Move the downloaded `chromedriver` executable into the `scraper` folder. 
   - Ensure that it is not placed inside the `src` folder.

4. **Run the Scraper**
   - Open a new terminal or command prompt.
   - Navigate to the `scraper/src` directory:
     ```bash
     cd path/to/stanfood-prototype/scraper/src
     ```
   - Run the scraper script using Python:
     ```bash
     python3 scrape_menu.py
     ```
   - The scraper will execute and the data will be populated into its own directory within `scraper/src`.

5. **Access Your Data**
   - The extracted data will be available in the `scraper/data` directory.

## Notes
- Ensure that you have Python 3 installed on your system.
- The scraper requires the `selenium` package. Install it using pip if needed:
  ```bash
  pip install selenium

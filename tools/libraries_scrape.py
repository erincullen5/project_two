## Import Dependencies
from urllib.request import urlopen
import requests
from splinter import Browser
from bs4 import BeautifulSoup

## Initialize Chrome Driver

executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
browser = Browser('chrome', **executable_path, headless=False)
# browser.wait_time = 5

## Visit target url(s) to scrape

url = 'https://www.lib-web.org/united-states/public-libraries/wyoming/'
browser.visit(url)

## prettify page_html with urllib.requests and soup

# html = urlopen('http://www.gymsandfitnessclubs.com/locations/cities/New-York_NY_gyms-fitness-clubs_page-1.htm')
# soup = BeautifulSoup(html, 'html.parser')
# print(soup.prettify())

filename = "wyoming_library.csv"
f = open(filename, "w")

headers = "title, link \n"

f.write(headers)

def library_scrape():
# Iterate through all pages
    for x in range(1,60):
    # HTML object

        html = browser.html
    # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')
    # Retrieve all elements that contain gym information
    # gyms = soup.find_all('ul', class_='multiple_column_wide top_bg')
        libraries = soup.find('ul', class_ = 'liblist').findAll('li')

# Iterate through each gym listed
# counter = 0
# while counter < 35:
        for library in libraries:
    # Use Beautiful Soup's find() method to navigate and retrieve attributes
            a_tag = library.find('a')
            href = a_tag['href']
            title = a_tag['title']
            # address1 = library.find('a', 'target_' = 'blank_')
            # address2 = library.find('span', class_ = 'address2')
            print('-----------')
            print(title)
            print(href)
            # print(address1)
            # print(address2.text)
            # print('http://www.gymsandfitnessclubs.com/locations/cities/Chicago_IL_gyms-fitness-clubs_page-1.htm' + href)
            f.write(title +","+href+"\n")
        # browser.click_link_by_partial_text('Next')
        # counter += 1

        browser.click_link_by_partial_text('Next')

# Click the 'Next' button on each page


# # Click the 'Next' button on each page



for _ in range(10):
    library_scrape()



f.close()

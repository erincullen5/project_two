## Import Dependencies
from urllib.request import urlopen
import requests
from splinter import Browser
from bs4 import BeautifulSoup

## Initialize Chrome Driver

executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
browser = Browser('chrome', **executable_path, headless=False)
browser.wait_time = 10

## Visit target url(s) to scrape

url = 'http://www.gymsandfitnessclubs.com/locations/cities/Arlington_TX_gyms-fitness-clubs_page-1.htm'
browser.visit(url)

## prettify page_html with urllib.requests and soup

html = urlopen('http://www.gymsandfitnessclubs.com/locations/cities/New-York_NY_gyms-fitness-clubs_page-1.htm')
# soup = BeautifulSoup(html, 'html.parser')
# print(soup.prettify())

filename = "Arlington_gyms.csv"
f = open(filename, "w")

headers = "gym, address1, address2 \n"

f.write(headers)

def gym_scrape():
# Iterate through all pages
    for x in range(1,23):
    # HTML object

        html = browser.html
    # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(html, 'html.parser')
    # Retrieve all elements that contain gym information
    # gyms = soup.find_all('ul', class_='multiple_column_wide top_bg')
        gyms = soup.findAll('ul', {'class':['multiple_column_wide top_bg', 'multiple_column_wide top_bg_striped']})

# Iterate through each gym listed
# counter = 0
# while counter < 35:
        for gym in gyms:
    # Use Beautiful Soup's find() method to navigate and retrieve attributes
            a_tag = gym.find('a')
            href = a_tag['href']
            title = a_tag['title']
            address1 = gym.find('span', class_ = 'address1')
            address2 = gym.find('span', class_ = 'address2')
            print('-----------')
            print(title)
            print(address1.text)
            print(address2.text)
            # print('http://www.gymsandfitnessclubs.com/locations/cities/Chicago_IL_gyms-fitness-clubs_page-1.htm' + href)
            f.write(title +","+address1.text+"," +address2.text+"\n")
        # browser.click_link_by_partial_text('Next')
        # counter += 1

        browser.click_link_by_partial_text('Next')

# Click the 'Next' button on each page


# # Click the 'Next' button on each page



for _ in range(36):
    gym_scrape()



f.close()

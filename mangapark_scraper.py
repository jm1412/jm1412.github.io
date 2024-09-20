import os
import time
from bs4 import BeautifulSoup
from xml.etree.ElementTree import Element, SubElement, tostring
import requests

def scrape_mangapark(num_pages=5):
    print("running: scrape_mangapark")
    base_url = 'https://mangapark.com/latest'
    output_file = os.path.join(os.path.dirname(__file__), 'mangapark_latest.html')
    xml_output_file = os.path.join(os.path.dirname(__file__), 'manga_updates.xml')
    cache_duration = 30 * 60  # 30 minutes in seconds

    # Check if the output file exists and is not older than 30 minutes
    print("checking if file exists")
    if os.path.exists(output_file) and (time.time() - os.path.getmtime(output_file)) < cache_duration:
        print("file already exists")
        with open(output_file, 'r', encoding='utf-8') as file:
            html_content = file.read()
    else:
        print("downloading new file")
        try:
            for page in range(1, num_pages + 1):
                url = f"{base_url}?page={page}"
                response = requests.get(url, proxies={"http": None, "https": None})
                if response.status_code == 200:
                    with open(output_file, 'a', encoding='utf-8') as file:
                        file.write(response.text)
                else:
                    print(f"Error fetching page: {response.status_code}")
                    return

            with open(output_file, 'r', encoding='utf-8') as file:
                html_content = file.read()

        except Exception as e:
            print(f"Error fetching page: {str(e)}")
            return

    print("parsing")
    soup = BeautifulSoup(html_content, 'html.parser')
    manga_dict = {}
    print("starting to extract")

    manga_items = soup.select('.pl-3')

    for item in manga_items:
        manga_title = item.find('h3').get_text(strip=True)
        chapters = item.select('a.link-hover.link-primary')

        chapter_list = [(chapter.get_text(strip=True), chapter['href']) for chapter in chapters]

        if chapter_list:
            manga_dict[manga_title] = manga_dict.get(manga_title, []) + chapter_list

    root = Element('rss', version='2.0')

    for manga, chapters in manga_dict.items():
        manga_element = SubElement(root, 'manga', title=manga)
        for chapter_title, chapter_link in chapters:
            chapter_element = SubElement(manga_element, 'chapter')
            chapter_element.set('title', chapter_title)
            chapter_element.set('link', f"https://mangapark.com{chapter_link}")

    xml_string = tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    # Save the XML string to a file
    with open(xml_output_file, 'w', encoding='utf-8') as xml_file:
        xml_file.write(xml_string)
    print(f"XML saved to {xml_output_file}")

# Call the function if running as a standalone script
if __name__ == "__main__":
    scrape_mangapark()

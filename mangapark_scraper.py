import os
import time
import json
from bs4 import BeautifulSoup
from xml.etree.ElementTree import Element, SubElement, tostring
import requests

def scrape_mangapark(num_pages=5):
    print("Running: scrape_mangapark")
    base_url = 'https://mangapark.com/latest'
    output_xml_file = 'mangapark_latest.xml'
    output_json_file = 'mangapark_latest.json'
    cache_duration = 30 * 60  # 30 minutes in seconds

    # Check if the XML output file exists and is not older than 30 minutes
    if os.path.exists(output_xml_file) and (time.time() - os.path.getmtime(output_xml_file)) < cache_duration:
        print("XML file already exists and is fresh.")
        with open(output_xml_file, 'r', encoding='utf-8') as file:
            xml_string = file.read()
    else:
        print("Downloading new data")
        html_content = ""
        try:
            for page in range(1, num_pages + 1):
                url = f"{base_url}?page={page}"
                response = requests.get(url)
                if response.status_code == 200:
                    html_content += response.text
                else:
                    print(f"Error fetching page: {response.status_code}")
                    return None
        except Exception as e:
            print(f"Error fetching page: {str(e)}")
            return None

        print("Parsing HTML")
        soup = BeautifulSoup(html_content, 'html.parser')
        manga_dict = {}

        manga_items = soup.select('.pl-3')

        for item in manga_items:
            manga_title = item.find('h3').get_text(strip=True)
            chapters = item.select('a.link-hover.link-primary')

            for chapter in chapters:
                chapter_title = chapter.get_text(strip=True)
                chapter_link = chapter['href']
                
                if manga_title not in manga_dict:
                    manga_dict[manga_title] = []
                manga_dict[manga_title].append({
                    'chapter': chapter_title,
                    'link': f"https://mangapark.com{chapter_link}"
                })

        # Build the XML structure
        root = Element('rss', version="2.0")
        channel = SubElement(root, 'channel')
        
        title_channel = SubElement(channel, 'title')
        title_channel.text = "Baka Updates Manga - Latest Releases"
        
        link_channel = SubElement(channel, 'link')
        link_channel.text = "https://www.mangaupdates.com/"
        
        description_channel = SubElement(channel, 'description')
        description_channel.text = "Providing the latest manga release information"

        for manga, chapters in manga_dict.items():
            for chapter in chapters:
                manga_title_chapter = f"{manga} - {chapter['chapter']}"
                chapter_element = SubElement(channel, 'item')
                
                # Chapter title
                chapter_title_element = SubElement(chapter_element, 'title')
                chapter_title_element.text = manga_title_chapter
                
                # Direct link to the chapter
                chapter_link_element = SubElement(chapter_element, 'link')
                chapter_link_element.text = chapter['link']

        xml_string = tostring(root, encoding='utf-8', method='xml').decode('utf-8')

        # Save to XML file
        with open(output_xml_file, 'w', encoding='utf-8') as file:
            file.write(xml_string)

        print(f"Data saved to {output_xml_file}")

    # Update or create JSON file
    if os.path.exists(output_json_file):
        with open(output_json_file, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
    else:
        existing_data = []

    # Create a new list for the JSON structure
    json_data = []
    for manga, chapters in manga_dict.items():
        for chapter in chapters:
            json_data.append({
                'manga': manga,
                'chapter': chapter['chapter'],
                'link': chapter['link']
            })

    # Remove duplicates based on manga and chapter
    existing_links = {(entry['manga'], entry['chapter']): entry['link'] for entry in existing_data}
    for entry in json_data:
        existing_links[(entry['manga'], entry['chapter'])] = entry['link']

    # Save updated data back to JSON
    updated_data = [{'manga': manga, 'chapter': chapter, 'link': link} for (manga, chapter), link in existing_links.items()]
    with open(output_json_file, 'w', encoding='utf-8') as file:
        json.dump(updated_data, file, ensure_ascii=False, indent=4)

    print(f"Data saved to {output_json_file}")
    return xml_string

if __name__ == "__main__":
    scrape_mangapark()

import os
import time
from bs4 import BeautifulSoup
import requests
import json
from xml.etree.ElementTree import Element, SubElement, tostring

def scrape_mangapark(num_pages=1):
    print("Running: scrape_mangapark")
    base_url = 'https://mangapark.com/latest'
    json_file = 'mangapark_latest.json'
    xml_file = 'mangapark_latest.xml'
    cache_duration = 30 * 60  # 30 minutes in seconds

    new_entries = []
    duplicate_count = 0
    existing_entries = []

    # Load existing JSON data if it exists
    if os.path.exists(json_file):
        with open(json_file, 'r', encoding='utf-8') as file:
            existing_entries = json.load(file)

    # Create a set for existing chapter links to avoid duplicates
    existing_links = {entry['link'] for entry in existing_entries}

    print("Downloading new data")
    for page in range(1, num_pages + 1):
        url = f"{base_url}?page={page}"
        response = requests.get(url)
        if response.status_code == 200:
            html_content = response.text
        else:
            print(f"Error fetching page: {response.status_code}")
            return None

        print("Parsing HTML")
        soup = BeautifulSoup(html_content, 'html.parser')
        manga_items = soup.select('.pl-3')

        for item in manga_items:
            manga_title = item.find('h3').get_text(strip=True)
            chapters = item.select('a.link-hover.link-primary')

            for chapter in chapters:
                chapter_title = chapter.get_text(strip=True)
                chapter_link = f"https://mangapark.com{chapter['href']}"

                # Create a new entry
                new_entry = {'manga': manga_title, 'chapter': chapter_title, 'link': chapter_link}

                # Check for duplicates
                if chapter_link in existing_links:
                    duplicate_count += 1
                    if duplicate_count >= 5:
                        print("Reached maximum duplicate entries. Stopping.")
                        break
                else:
                    new_entries.append(new_entry)

            if duplicate_count >= 5:
                break

        if duplicate_count >= 5:
            break

    # If there are new entries, update the JSON file
    if new_entries:
        # Append new entries at the top
        existing_entries = new_entries + existing_entries
        
        with open(json_file, 'w', encoding='utf-8') as file:
            json.dump(existing_entries, file, indent=4)

        print(f"Updated {json_file} with new entries.")
        create_xml(existing_entries, xml_file)

def create_xml(entries, xml_file):
    print("Creating XML from JSON data")
    
    # Build the XML structure
    root = Element('rss', version="2.0")
    channel = SubElement(root, 'channel')

    title_channel = SubElement(channel, 'title')
    title_channel.text = "Baka Updates Manga - Latest Releases"
    
    link_channel = SubElement(channel, 'link')
    link_channel.text = "https://www.mangaupdates.com/"
    
    description_channel = SubElement(channel, 'description')
    description_channel.text = "Providing the latest manga release information"

    for entry in entries:
        manga_title_chapter = f"{entry['manga']} - {entry['chapter']}"
        chapter_element = SubElement(channel, 'item')  # New item for each chapter
        
        # Chapter title
        chapter_title_element = SubElement(chapter_element, 'title')
        chapter_title_element.text = manga_title_chapter
        
        # Direct link to the chapter
        chapter_link_element = SubElement(chapter_element, 'link')
        chapter_link_element.text = entry['link']

    xml_string = tostring(root, encoding='utf-8', method='xml').decode('utf-8')

    # Save to XML file
    with open(xml_file, 'w', encoding='utf-8') as file:
        file.write(xml_string)

    print(f"Data saved to {xml_file}")

if __name__ == "__main__":
    scrape_mangapark()

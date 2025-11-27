import os
import jsonlines
from tqdm import tqdm

# Path to the extracted WikiExtractor output folder
RAW_WIKI_DIR = "../data/raw/extracted"
OUTPUT_FILE = "../data/processed/wiki_corpus.jsonl"

def process_wiki_folder(raw_dir, output_file):
    files = []
    for root, dirs, filenames in os.walk(raw_dir):
        for f in filenames:
            if f.endswith(".txt"):
                files.append(os.path.join(root, f))

    with jsonlines.open(output_file, mode='w') as writer:
        for file in tqdm(files, desc="Processing Wikipedia files"):
            with open(file, "r", encoding="utf-8") as f:
                title = None
                paragraphs = []
                for line in f:
                    line = line.strip()
                    if line.startswith("<doc id="):   # New article
                        if paragraphs and title:
                            for para in paragraphs:
                                writer.write({
                                    "title": title,
                                    "text": para,
                                    "url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
                                })
                        title = None
                        paragraphs = []
                    elif line:
                        if not title:
                            title = line  # first line = title
                        else:
                            paragraphs.append(line)
                # Last article
                if paragraphs and title:
                    for para in paragraphs:
                        writer.write({
                            "title": title,
                            "text": para,
                            "url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
                        })

if __name__ == "__main__":
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    process_wiki_folder(RAW_WIKI_DIR, OUTPUT_FILE)

import jsonlines
import re

INPUT_FILE = "../data/processed/wiki_corpus.jsonl"
OUTPUT_FILE = "../data/processed/wiki_corpus_clean.jsonl"

def clean_text(text):
    # Remove extra spaces, newlines, weird characters
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

with jsonlines.open(INPUT_FILE) as reader, jsonlines.open(OUTPUT_FILE, mode='w') as writer:
    for item in reader:
        item['text'] = clean_text(item['text'])
        writer.write(item)

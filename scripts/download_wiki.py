from datasets import load_dataset
import jsonlines
import os

OUTPUT_FILE = "../data/processed/wiki_corpus_small.jsonl"
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# Load small subset (1%)
dataset = load_dataset("wikipedia", "20220301.en", split="train[:1%]")

with jsonlines.open(OUTPUT_FILE, mode='w') as writer:
    for item in dataset:
        title = item['title']
        text = item['text']
        if text.strip():
            for para in text.split('\n\n'):
                para = para.strip()
                if para:
                    writer.write({
                        "title": title,
                        "text": para,
                        "url": f"https://en.wikipedia.org/wiki/{title.replace(' ', '_')}"
                    })

print(f"Wikipedia corpus saved to {OUTPUT_FILE}")

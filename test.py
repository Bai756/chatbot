import requests


API_URL = "https://jamsapi.hackclub.dev/openai/chat/completions"  
API_KEY = "TDFIKQ7GJ65DQVHIT7QMY9BBHP4A7BDHFIV2W3JN1DDC2KRXILZ6F7PFEVLXJDXE"

question = "how far is the moon?"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "gpt-3.5-turbo", 
    "messages": [
        {"role": "user", "content": question}
    ],
    "max_tokens": 100,  
    "temperature": 0.7
}

response = requests.post(API_URL, headers=headers, json=payload)

if response.status_code == 200:
    answer = response.json()["choices"][0]["message"]["content"]
    print(answer)
else:
    print("Error:", response.status_code, response.text)

import http.client

conn = http.client.HTTPSConnection("api.textcortex.com")

payload = "{\n  \"max_tokens\": 2048,\n  \"mode\": \"python\",\n  \"model\": \"icortex-1\",\n  \"n\": 1,\n  \"temperature\": 0,\n  \"text\": \"string\"\n}"

headers = {
    'Content-Type': "application/json",
    'Authorization': "Bearer gAAAAABmIjmSaJu_OlqEib36rBXOZMX83VPBXYXdqZxie1GtX65Jm5kPQQdhjHZ8CXvHFBczw0MICEtZg7w602vRjupEFYyNE9yAwUeJWBGUtYWL_8B-bnwresUSnVbedfLZybZzi33_"
    }

conn.request("POST", "/v1/codes", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
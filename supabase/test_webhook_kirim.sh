curl -i -X POST "http://127.0.0.1:54321/functions/v1/autochat-webhook" -H "Content-Type: application/json" -d '{
  "object": "instagram",
  "entry": [
    {
      "id": "12345",
      "messaging": [
        {
          "sender": { "id": "sender_1" },
          "message": { "text": "kirim" }
        }
      ]
    }
  ]
}'

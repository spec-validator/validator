# Demo

## POST OK

    curl -X POST "http://localhost:8000/items" -H  "Content-Type: application/json" -d "{\"title\":\"string\",\"description\":\"string\"}"

## POST NOK

    curl -X POST "http://localhost:8000/items" -H  "Content-Type: application/json" -d "{\"title\":true,\"description\":\"string\"}"

## GET OK

    curl -X GET "http://localhost:8000/items"

    curl -X GET "http://localhost:8000/items/42"

import os
import csv
from dotenv import load_dotenv
from pymongo import MongoClient

env_loaded: bool = load_dotenv()
client = MongoClient(os.environ["MONGODB_URI"])
db = client["finflow"]
collection = db["all_tickers"]


def upload_csv_to_mongodb(csv_file_path):
    documents = []  # List to hold document data
    with open(csv_file_path, mode="r", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            # Assuming 'conid' is the only integer field that needs conversion
            row["conid"] = int(row["conid"]) if "conid" in row and row["conid"].isdigit() else None
            documents.append(row)

    # Perform bulk insert
    if documents:
        collection.insert_many(documents)


def conid_mongodb(search_contract_id: str):
    return collection.find_one({"conid": int(search_contract_id)})


def search_mongodb(search_query: str, fixed_query: str):
    # Use text search for fuzzy, case-insensitive matching. Adjusted to ignore numeric search.
    pipeline = [
        {"$match": {"$text": {"$search": search_query}}},  # Text search for fuzzy matching.
    ]
    if fixed_query != "ALL":
        pipeline.append({"$match": {"type": fixed_query}})

    pipeline.extend(
        [
            {"$sort": {"score": {"$meta": "textScore"}}},  # Sort by relevance.
            {"$limit": 100},
        ]  # Fetch more documents initially to ensure enough unique symbols.
    )

    if fixed_query == "ALL":
        pipeline.extend(
            [
                {
                    "$group": (
                        {
                            "_id": "$symbol",  # Group by symbol to deduplicate.
                            "document": {
                                "$first": "$$ROOT"
                            },  # Keep the first document encountered.
                        }
                    )
                },
                {"$replaceRoot": {"newRoot": "$document"}},  # Flatten the documents.
            ]
        )
    pipeline.extend(
        [
            {"$project": {"_id": 0, "exchangeId": 0}},  # Exclude fields.
            {"$limit": 20},  # Ensure only 20 documents are returned.
        ]
    )

    return [*collection.aggregate(pipeline)]


if __name__ == "__main__":
    pass
    csv_file_path = "/Users/lohyikuang/Documents/auto-trader/all-market_no-derivatives_no-bonds.csv"  # Adjust path as necessary
    upload_csv_to_mongodb(csv_file_path)
    collection.create_index([("description", "text"), ("symbol", "text"), ("conid", "text")])

import os
from anki.collection import Collection
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Open the Anki collection
logger.info("Opening Anki collection...")
collection = Collection(path="./collection.anki2")

# Check for AnkiWeb authentication
username = os.getenv("ANKI_EMAIL")
password = os.getenv("ANKI_PASSWORD")

logger.debug(f"Username found: {'Yes' if username else 'No'}")
logger.debug(f"Password found: {'Yes' if password else 'No'}")

if username and password:
    try:
        logger.info("Attempting to login to AnkiWeb...")
        # Use the official AnkiWeb sync endpoint
        auth = collection.sync_login(
            username, password, endpoint="https://sync.ankiweb.net"
        )
        logger.debug(f"Sync login response: {auth}")

        if auth:
            logger.info("Successfully logged in to AnkiWeb")
            logger.info("Starting collection sync...")
            collection.sync_collection(auth, sync_media=False)
            logger.info("Collection sync completed")
        else:
            logger.error("Failed to authenticate with AnkiWeb - no auth token returned")
    except Exception as e:
        logger.error(f"Error during AnkiWeb sync: {str(e)}", exc_info=True)
        # Continue without sync if it fails
        pass
else:
    logger.warning("AnkiWeb credentials not found in environment variables")

deck_manager = collection.decks

# Dictionary to store well-known words
well_known_words = {}

for deck_dict in deck_manager.all():
    deck_id = deck_dict["id"]
    deck_name = deck_dict["name"]
    print(f"Deck: {deck_name}")

    # Get cards in this deck
    card_ids = deck_manager.cids(deck_id)

    # Skip the default deck
    if deck_id == 1 and deck_name == "Default":
        continue

    print(f"Total cards in deck: {len(card_ids)}")

    # Track known words
    known_words = []
    learning_words = []

    for card_id in card_ids:
        card = collection.get_card(card_id)
        note = card.note()

        # Get card statistics
        interval = card.ivl

        # Extract the front field (usually the word/phrase being learned)
        front_field = note.fields[0]

        # Check if the card is "mature" (interval >= 21 days)
        if interval >= 1:
            known_words.append(
                {
                    "word": front_field,
                    "interval": interval,
                    "ease": card.factor / 1000.0,  # Convert to familiar 2.5 format
                }
            )
        else:
            learning_words.append(
                {
                    "word": front_field,
                    "interval": interval,
                    "ease": card.factor / 1000.0,
                }
            )

    # Store results for this deck
    well_known_words[deck_name] = {"known": known_words, "learning": learning_words}

    # Print summary
    print(f"Words you know well: {len(known_words)}")
    for word_info in sorted(known_words, key=lambda x: x["interval"], reverse=True)[
        :10
    ]:  # Show first 10, sorted by interval
        print(
            f"{word_info['word']} (reviewed {word_info['interval']} days,"
            f"{word_info['ease']:.1f})"
        )

    print(f"Words still learning: {len(learning_words)}")

    print("--------------------------------")

collection.close()

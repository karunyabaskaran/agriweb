import os
import json
import threading
from backend.config import Config
from backend.db.seed_data import get_initial_seed_data

class DatabaseManager:
    """
    Dual-engine Database Manager:
    - Automatically initializes Firebase Firestore if valid credentials / project configuration exist.
    - Seamlessly falls back to a thread-safe persistent JSON database (backend/db/db.json) with
      matching collection/document query semantics, ensuring zero-friction local and cloud execution.
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(DatabaseManager, cls).__new__(cls)
                    cls._instance._init_storage()
        return cls._instance

    def _init_storage(self):
        self.use_firebase = False
        self.firestore_client = None
        self.db_path = Config.DB_FILE
        self.mem_lock = threading.Lock()

        # Check for Firebase credentials
        if Config.FIREBASE_PROJECT_ID or Config.FIREBASE_CREDENTIALS_PATH:
            try:
                import firebase_admin
                from firebase_admin import credentials, firestore
                
                if Config.FIREBASE_CREDENTIALS_PATH and os.path.exists(Config.FIREBASE_CREDENTIALS_PATH):
                    cred = credentials.Certificate(Config.FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred)
                elif Config.FIREBASE_PROJECT_ID:
                    firebase_admin.initialize_app(options={'projectId': Config.FIREBASE_PROJECT_ID})
                
                self.firestore_client = firestore.client()
                self.use_firebase = True
                print("Connected to Firebase Firestore successfully.")
            except Exception as e:
                print(f"Firebase not configured or failed to connect ({e}). Using local persistent JSON store.")
                self.use_firebase = False
        else:
            self.use_firebase = False

        # If local JSON store, ensure directory & file exist
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.db_path) or os.path.getsize(self.db_path) == 0:
            self.reset_to_seed()
        else:
            # Validate JSON integrity
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    json.load(f)
            except Exception:
                self.reset_to_seed()

    def reset_to_seed(self):
        """Seeds the database with realistic sample Indian agro-market data."""
        seed = get_initial_seed_data()
        with self.mem_lock:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(seed, f, indent=2)
        print("Initialized database with seed dataset.")

    def _read_local(self):
        with self.mem_lock:
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                seed = get_initial_seed_data()
                return seed

    def _write_local(self, data):
        with self.mem_lock:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

    def get_all(self, collection_name):
        """Returns all items in a collection."""
        if self.use_firebase and self.firestore_client:
            try:
                docs = self.firestore_client.collection(collection_name).stream()
                return [{**doc.to_dict(), "id": doc.id} for doc in docs]
            except Exception as e:
                print(f"Firestore get_all failed ({e}), falling back to local store.")

        data = self._read_local()
        return data.get(collection_name, [])

    def get_by_id(self, collection_name, item_id):
        """Returns a single item by ID or None."""
        if self.use_firebase and self.firestore_client:
            try:
                doc = self.firestore_client.collection(collection_name).document(str(item_id)).get()
                if doc.exists:
                    return {**doc.to_dict(), "id": doc.id}
                return None
            except Exception as e:
                print(f"Firestore get_by_id failed ({e}), falling back to local store.")

        items = self.get_all(collection_name)
        for item in items:
            if str(item.get("id")) == str(item_id):
                return item
        return None

    def insert(self, collection_name, item):
        """Inserts an item into the collection."""
        if "id" not in item:
            from backend.utils.helpers import new_id
            item["id"] = new_id()

        if self.use_firebase and self.firestore_client:
            try:
                self.firestore_client.collection(collection_name).document(str(item["id"])).set(item)
            except Exception as e:
                print(f"Firestore insert error ({e})")

        data = self._read_local()
        if collection_name not in data:
            data[collection_name] = []
        data[collection_name].append(item)
        self._write_local(data)
        return item

    def update(self, collection_name, item_id, updates):
        """Updates fields of an existing item in the collection."""
        if self.use_firebase and self.firestore_client:
            try:
                self.firestore_client.collection(collection_name).document(str(item_id)).update(updates)
            except Exception as e:
                print(f"Firestore update error ({e})")

        data = self._read_local()
        items = data.get(collection_name, [])
        updated_item = None
        for i, item in enumerate(items):
            if str(item.get("id")) == str(item_id):
                items[i].update(updates)
                updated_item = items[i]
                break
        if updated_item:
            self._write_local(data)
        return updated_item

    def remove(self, collection_name, item_id):
        """Deletes an item from the collection."""
        if self.use_firebase and self.firestore_client:
            try:
                self.firestore_client.collection(collection_name).document(str(item_id)).delete()
            except Exception as e:
                print(f"Firestore delete error ({e})")

        data = self._read_local()
        items = data.get(collection_name, [])
        data[collection_name] = [item for item in items if str(item.get("id")) != str(item_id)]
        self._write_local(data)
        return True

# Export singleton instance
db = DatabaseManager()

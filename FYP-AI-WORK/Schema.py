schema = {
  "tables": {
    "websites": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "user_id": { "type": "bigint", "foreign_key": "users.id" },
        "domain": { "type": "varchar(255)", "not_null": True },
        "created_at": { "type": "datetime", "not_null": True },
        "updated_at": { "type": "datetime", "not_null": True },
        "website_id": { "type": "varchar(36)", "unique": True }
      }
    },
    "visitors": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "visitor_id": { "type": "char(36)", "unique": True },
        "website_id": { "type": "bigint", "foreign_key": "websites.id" },
        "created_at": { "type": "datetime", "not_null": True },
        "updated_at": { "type": "datetime", "not_null": True }
      }
    },
    "sessions": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "website_id": { "type": "bigint", "foreign_key": "websites.id" },
        "visitor_id": { "type": "bigint", "foreign_key": "visitors.id" },
        "session_id": { "type": "char(36)", "unique": True },
        "country": { "type": "varchar(100)", "not_null": True },
        "city": { "type": "varchar(100)", "not_null": True },
        "device": { "type": "varchar(100)", "not_null": True },
        "os": { "type": "varchar(100)", "not_null": True },
        "browser": { "type": "varchar(100)", "not_null": True },
        "created_at": { "type": "datetime", "not_null": True }
      }
    },
    "events": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "session_id": { "type": "bigint", "foreign_key": "sessions.id" },
        "event_name": { "type": "varchar(100)", "not_null": True },
        "page_url": { "type": "text", "not_null": True },
        "created_at": { "type": "datetime", "not_null": True }
      }
    },
    "page_views": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "session_id": { "type": "bigint", "foreign_key": "sessions.id" },
        "page_title": { "type": "text", "not_null": True },
        "page_url": { "type": "text", "not_null": True },
        "referrer": { "type": "text", "nullable": True },
        "created_at": { "type": "datetime", "not_null": True }
      }
    },
    "traffic_sources": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "session_id": { "type": "bigint", "foreign_key": "sessions.id" },
        "source": { "type": "varchar(100)", "not_null": True },
        "medium": { "type": "varchar(50)", "not_null": True },
        "campaign": { "type": "varchar(255)", "not_null": True },
        "created_at": { "type": "datetime", "not_null": True }
      }
    },
    "transactions": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "session_id": { "type": "bigint", "foreign_key": "sessions.id" },
        "transaction_id": { "type": "char(36)", "unique": True },
        "total_amount": { "type": "double", "not_null": True },
        "total_quantity": { "type": "int(11)", "not_null": True },
        "shipping": { "type": "double", "not_null": True },
        "tax": { "type": "double", "not_null": True },
        "currency": { "type": "varchar(10)", "not_null": True },
        "created_at": { "type": "datetime", "not_null": True },
        "updated_at": { "type": "datetime", "not_null": True }
      }
    },
    "items": {
      "columns": {
        "id": { "type": "bigint", "primary_key": True },
        "transaction_id": { "type": "bigint", "foreign_key": "transactions.id" },
        "item_id": { "type": "varchar(255)", "unique": True },
        "item_name": { "type": "varchar(255)", "not_null": True },
        "item_category": { "type": "varchar(255)", "not_null": True },
        "quantity": { "type": "int(11)", "not_null": True },
        "price": { "type": "double", "not_null": True },
        "currency": { "type": "varchar(10)", "not_null": True },
        "created_at": { "type": "datetime", "not_null": True },
        "updated_at": { "type": "datetime", "not_null": True }
      }
    }
  }
}

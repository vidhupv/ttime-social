# ttime-social
## Project Setup
To get started with the project, follow
these steps:
1. **Clone the Repository:**
```sh
git clone <https://github.com/vidhupv/ttime-social.git>
cd ttime-social
```

## API Documentation

### Create a new activity

- **Endpoint**: `/api/activities`
- **Method**: POST
- **Description**: Creates a new activity for a user.

**Request Body:**
```json
{
"userId": 1,
"type": "watching",
"content": "Deadpool and Wolverine"
}
```
**Response Body:**
```json
{
"id": 1,
"userId": 1,
"type": "watching",
"content": "Deadpool and Wolverine",
"timestamp": "2024-05-20T10:00:00Z"
}
```

**Status Codes:**
- 201 Created: Activity successfully created.
- 400 Bad Request: Invalid or missing data in the request body.

### Get all activities

- **Endpoint**: `/api/activities`
- **Method**: GET
- **Description**: Retrieves all activities.

**Response Body:**
```json
[
{
"id": 1,
"userId": 1,
"type": "watching",
"content": "Deadpool and Wolverine",
"timestamp": "2024-05-20T10:00:00Z"
},
{
"id": 2,
"userId": 2,
"type": "reading",
"content": "The Intel Trinity",
"timestamp": "2023-04-20T13:00:00.000Z"
}
]
```

**Status Codes:**
- 200 OK: Activities successfully retrieved.
- 500 Internal Server Error: Unexpected error occurred on the server.

### Get a specific activity

- **Endpoint**: `/api/activities/:id`
- **Method**: GET
- **Description**: Retrieves a specific activity by its ID.

**Parameters:**
- `id` (number, required): The ID of the activity to retrieve.

**Response Body:**
```json
{
"id": 1,
"userId": 1,
"type": "watching",
"content": "Deadpool and Wolverine",
"timestamp": "2024-05-20T10:00:00Z"
}
```

**Status Codes:**
- 200 OK: Activity successfully retrieved.
- 404 Not Found: Activity with the specified ID not found.
- 500 Internal Server Error: Unexpected error occurred on the server.
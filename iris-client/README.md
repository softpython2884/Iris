# IRIS Terminal Client Development Guide

This document provides all the necessary information to develop the standalone terminal client for the IRIS sub-system.

## 1. Project Architecture

The IRIS system is composed of two main parts:

1.  **The Server**: A Next.js application located in the root directory of the project. It serves as the backend, handling API requests, user authentication, database interactions, and Genkit AI flows.
2.  **The Client**: A standalone terminal application located in the `iris-client/` directory. It is built with TypeScript and runs on Node.js. This is the user-facing part of the system.

### Running the Environment

-   **To run the server**: From the root directory, run `npm run dev`. The server will start, typically on `http://127.0.0.1:9002`.
-   **To run the client**: From the `iris-client/` directory, run `npm start`.

## 2. Server API

The client communicates with the server via a REST API. All communication is based on JSON.

### Authentication Flow

1.  The client sends a permanent `accessKey` to the `/api/auth/login` endpoint.
2.  The server validates the key and, if successful, returns a short-lived JSON Web Token (JWT).
3.  For all subsequent requests to protected endpoints, the client must include this token in the `Authorization` header.
    -   **Header Format**: `Authorization: Bearer <your_jwt_token>`

---

### Public Endpoints

These endpoints do not require an authentication token.

#### User Login

-   **URL**: `POST /api/auth/login`
-   **Description**: Authenticates the user using their permanent access key and returns a session token.
-   **Request Body**:
    ```json
    {
      "accessKey": "string"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "operatorId": "string",
      "securityLevel": "string",
      "token": "string" // This is the JWT session token
    }
    ```
-   **Error Responses**:
    -   `401 Unauthorized`: If credentials are invalid.
    -   `503 Service Unavailable`: If the system is in lockdown (LV2 or LV3).

#### Get System Lockdown Status

-   **URL**: `GET /api/system/lockdown`
-   **Description**: Retrieves the current system-wide lockdown level.
-   **Success Response (200 OK)**:
    ```json
    {
      "lockdownLevel": "string" // e.g., "NONE", "LV1", "LV2", "LV3"
    }
    ```

---

### Protected Endpoints

These endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

#### Create New Operator

-   **URL**: `POST /api/auth/signup`
-   **Description**: Creates a new operator profile. **Requires an administrator token (Security Level 7).**
-   **Request Body**:
    ```json
    {
      "operatorId": "string",
      "securityLevel": "string", // e.g., "5" or "3.1"
      "subLevel": "string" // Optional, for levels like 3.1
    }
    ```
-   **Success Response (201 Created)**: The server will generate a new unique access key for the created user.
    ```json
    {
      "accessKey": "string" // The newly generated access key for the new operator
    }
    ```
-   **Error Responses**:
    -   `401 Unauthorized`: If the token is missing or invalid.
    -   `403 Forbidden`: If the user's security level is not 7.
    -   `409 Conflict`: If the `operatorId` already exists.

#### Set System Lockdown Level

-   **URL**: `POST /api/system/lockdown`
-   **Description**: Sets the system-wide lockdown level. **Requires an administrator token (Security Level 7).**
-   **Request Body**:
    ```json
    {
      "level": "string" // Must be one of "NONE", "LV1", "LV2", "LV3"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "message": "System lockdown level set to <level>"
    }
    ```
-   **Error Responses**:
    -   `400 Bad Request`: If the level is invalid.
    -   `401 Unauthorized`: If the token is missing or invalid.
    -   `403 Forbidden`: If the user's security level is not 7.

#### Send a Message

-   **URL**: `POST /api/messages`
-   **Description**: Sends a new encrypted message to another operator.
-   **Request Body**:
    ```json
    {
      "recipientId": "string",
      "encryptedContent": "string", // Content encrypted by the client
      "signature": "string",      // Signature of the content, for verification
      "conversationId": "string", // Optional: to link messages in a conversation
      "prevMessageId": "string"   // Optional: to version a message
    }
    ```
-   **Success Response (201 Created)**:
    ```json
    {
      "message": "Message sent successfully.",
      "messageId": "string",
      "conversationId": "string"
    }
    ```

#### Retrieve Messages

-   **URL**: `GET /api/messages`
-   **Description**: Retrieves all messages for the authenticated user.
-   **Success Response (200 OK)**:
    ```json
    {
      "messages": [
        {
          "id": "string",
          "conversationId": "string",
          "senderId": "string",
          "recipientId": "string",
          "encryptedContent": "string",
          "signature": "string",
          "timestamp": "string",
          "prevMessageId": "string"
        }
      ]
    }
    ```

#### Create Chat Channel
- **URL**: `POST /api/chat`
- **Description**: Creates a new channel for real-time chat.
- **Request Body**:
    ```json
    {
      "name": "string", // The unique name for the channel
      "is_persistent": "boolean" // Optional, defaults to false
    }
    ```
- **Success Response (201 Created)**:
    ```json
    {
      "message": "Channel created successfully.",
      "channelId": "string"
    }
    ```

#### Send Chat Message
- **URL**: `POST /api/chat/{channelId}`
- **Description**: Sends a message to a specific chat channel.
- **Request Body**:
    ```json
    {
      "encryptedContent": "string"
    }
    ```
- **Success Response (201 Created)**:
    ```json
    {
      "message": "Message sent.",
      "messageId": "string"
    }
    ```

#### Retrieve Chat Messages
- **URL**: `GET /api/chat/{channelId}`
- **URL with Polling**: `GET /api/chat/{channelId}?since=<timestamp>`
- **Description**: Retrieves messages from a channel. To get only new messages since the last fetch, include the `since` query parameter with the timestamp of the last received message.
- **Success Response (200 OK)**:
    ```json
    {
      "messages": [
        {
          "id": "string",
          "channel_id": "string",
          "sender_id": "string",
          "encrypted_content": "string",
          "timestamp": "string"
        }
      ]
    }
    ```

---

### Default User for Testing

A default user is pre-configured in the server for development and testing purposes.

-   **Operator ID**: `Operator-7`
-   **Access Key**: `IRIS-Ut9OWLLQWhB#FEc6awCLdLlZrSUh$WGzLHpvvCbY`
-   **Security Level**: `7` (Administrator)

The client should use this key to log in and get a token, which can then be used to create other users and manage the system.

## 3. Client TUI (Text-based User Interface) Design

The client must be a rich, interactive terminal application. The following mockups are the design target. The layout should be responsive to the terminal's size.

### Main Dashboard Layout

This is the primary screen after a successful login.

```
╭────────────────────────────────────────────────────────────────────────────────────────────╮
│  🔒 LOCKDOWN: <GREEN>LV0</GREEN>   │ Tor: <GREEN>ON</GREEN> 185.220.101.1 (NL) │ Host: node-01      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ [BTN:tab_contacts] Contacts  [BTN:tab_db] DB  [BTN:tab_iris] IRIS  [BTN:tab_tools] Tools   │
│ [BTN:tab_bots] Bots  [BTN:tab_settings] Settings  [BTN:tab_admin] Admin  [BTN:quit] Exit  │
├──────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ Status Panel │                MULTI-FUNCTION ZONE           │   Right Multi-Zone            │
│ (top-left)   │ (center big area)                            │  (chat/mail/note selector)    │
│──────────────│                                              │                               │
│ Lockdown:    │  ┌────────────────────────────────────────┐  │  ┌──────────────┐  ┌────────┐ │
│  [LED:GREEN] │  │  Shell (default)                        │  │  │ Chat (list)  │  │ Mail   │ │
│ Tor: [LED:G] │  │  user@host:~$ _                          │  │  │ #ops-room    │  │ Box    │ │
│ CPU: ████░░  │  │  > iris --status                        │  │  │ 18:44 wolf:.. │  │ (2)    │ │
│ RAM: █████░  │  │  …                                      │  │  └──────────────┘  └────────┘ │
│ Uptime: 3d   │  └────────────────────────────────────────┘  │  ┌──────────────┐  ┌────────┐ │
│ [BTN:stats]  │                                              │  │ Notes        │  │ Tasks  │ │
│              │                                              │  │ - TODO: tri   │  │ - 5    │ │
├──────────────┼──────────────────────────────────────────────┴───────────────────────────────┤
│ User: rootwolf  | Group: Operators  | LV: 5  | Local: 18:44:12 | IP: 10.0.0.5                      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SYS MSG: No intrusion detected. Last login: 2025-08-29T18:32:11Z from 185.220.101.1            │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
```

### Example Component: Status Widget

This is an example of a smaller, focused UI component.

```
╭────────────────────────────────╮
│ TOR: <GREEN>CONNECTED</GREEN>   │ IP: 185.220.101.1 (NL)         │
│ SOCKS5: 127.0.0.1:9050          │ Uptime: 3d 02:12               │
│ CPU: ████████░░  62%            │ RAM: ██████░░░  48%            │
╰────────────────────────────────╯
```

**Implementation Notes:**
- The client should be developed using libraries suitable for creating complex TUIs in Node.js, such as `blessed`, `blessed-contrib`, or similar.
- It needs to handle asynchronous operations gracefully (e.g., API calls) without freezing the UI.
- It must parse and display data from the server API within the defined UI components.

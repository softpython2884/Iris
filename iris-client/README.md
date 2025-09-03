# IRIS Terminal Client Development Guide

This document provides all the necessary information to develop the standalone terminal client for the IRIS sub-system.

## 1. Project Architecture

The IRIS system is composed of two main parts:

1.  **The Server**: A Next.js application located in the root directory of the project. It serves as the backend, handling API requests, user authentication, database interactions (currently simulated), and Genkit AI flows.
2.  **The Client**: A standalone terminal application located in the `iris-client/` directory. It is built with TypeScript and runs on Node.js. This is the user-facing part of the system.

### Running the Environment

-   **To run the server**: From the root directory, run `npm run dev`. The server will start, typically on `http://127.0.0.1:9002`.
-   **To run the client**: From the `iris-client/` directory, run `npm start`.

## 2. Server API

The client communicates with the server via a REST API.

### Authentication Endpoint

This is the primary endpoint for the client to authenticate.

-   **URL**: `POST /api/auth/login`
-   **Full Local URL**: `http://127.0.0.1:9002/api/auth/login`
-   **Method**: `POST`
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
      "token": "string"
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
      "error": "Invalid credentials."
    }
    ```

### Default User for Testing

A default user is pre-configured in the server for development and testing purposes.

-   **Operator ID**: `Operator-7`
-   **Access Key**: `IRIS-Ut9OWLLQWhB#FEc6awCLdLlZrSUh$WGzLHpvvCbY`

The client should use this key to log in.

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

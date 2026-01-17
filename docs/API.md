# API Documentation

This document describes the Discord API endpoints used by Wildflover DM Cleaner.

## Base URL

```
https://discord.com/api/v9
```

## Authentication

All requests require a Bearer token in the Authorization header:

```
Authorization: YOUR_DISCORD_TOKEN
```

## Endpoints

### Get Current User

Retrieves information about the authenticated user.

**Endpoint:** `GET /users/@me`

**Response:**
```json
{
  "id": "123456789012345678",
  "username": "username",
  "discriminator": "0",
  "global_name": "Display Name",
  "avatar": "avatar_hash",
  "email": "user@example.com",
  "verified": true,
  "premium_type": 2
}
```

### Get DM Channels

Retrieves all DM channels for the authenticated user.

**Endpoint:** `GET /users/@me/channels`

**Response:**
```json
[
  {
    "id": "123456789012345678",
    "type": 1,
    "last_message_id": "987654321098765432",
    "recipients": [
      {
        "id": "234567890123456789",
        "username": "friend",
        "discriminator": "0",
        "global_name": "Friend Name",
        "avatar": "avatar_hash"
      }
    ]
  }
]
```

**Channel Types:**
- `1`: DM (Direct Message)
- `3`: Group DM

### Get Relationships

Retrieves the user's friends list and relationships.

**Endpoint:** `GET /users/@me/relationships`

**Response:**
```json
[
  {
    "id": "234567890123456789",
    "type": 1,
    "user": {
      "id": "234567890123456789",
      "username": "friend",
      "discriminator": "0",
      "global_name": "Friend Name",
      "avatar": "avatar_hash",
      "public_flags": 0,
      "premium_type": 0
    }
  }
]
```

**Relationship Types:**
- `1`: Friend
- `2`: Blocked
- `3`: Incoming Friend Request
- `4`: Outgoing Friend Request

### Get Channel Messages

Retrieves messages from a specific channel.

**Endpoint:** `GET /channels/{channel_id}/messages`

**Query Parameters:**
- `limit`: Number of messages to retrieve (1-100, default: 50)
- `before`: Get messages before this message ID
- `after`: Get messages after this message ID
- `around`: Get messages around this message ID

**Example:**
```
GET /channels/123456789012345678/messages?limit=100&before=987654321098765432
```

**Response:**
```json
[
  {
    "id": "987654321098765432",
    "type": 0,
    "content": "Message content",
    "channel_id": "123456789012345678",
    "author": {
      "id": "123456789012345678",
      "username": "username",
      "discriminator": "0",
      "avatar": "avatar_hash"
    },
    "attachments": [],
    "embeds": [],
    "mentions": [],
    "mention_roles": [],
    "pinned": false,
    "mention_everyone": false,
    "tts": false,
    "timestamp": "2025-01-17T12:00:00.000000+00:00",
    "edited_timestamp": null,
    "flags": 0
  }
]
```

### Delete Message

Deletes a specific message.

**Endpoint:** `DELETE /channels/{channel_id}/messages/{message_id}`

**Example:**
```
DELETE /channels/123456789012345678/messages/987654321098765432
```

**Response:** `204 No Content` on success

**Rate Limit:** 5 requests per 5 seconds per channel

### Create DM Channel

Creates a new DM channel with a user.

**Endpoint:** `POST /users/@me/channels`

**Request Body:**
```json
{
  "recipient_id": "234567890123456789"
}
```

**Response:**
```json
{
  "id": "123456789012345678",
  "type": 1,
  "recipients": [
    {
      "id": "234567890123456789",
      "username": "friend",
      "discriminator": "0",
      "avatar": "avatar_hash"
    }
  ]
}
```

## Rate Limiting

Discord implements rate limiting to prevent abuse. The application handles rate limits automatically.

### Rate Limit Headers

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1642435200
X-RateLimit-Reset-After: 5.000
X-RateLimit-Bucket: hash
```

### Rate Limit Response

When rate limited, Discord returns `429 Too Many Requests`:

```json
{
  "message": "You are being rate limited.",
  "retry_after": 5.123,
  "global": false
}
```

**Handling:**
- Wait for `retry_after` seconds before retrying
- Implement exponential backoff
- Respect rate limit headers

## Error Codes

Common HTTP status codes:

- `200 OK`: Request successful
- `204 No Content`: Request successful, no content returned
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Missing permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limited
- `500 Internal Server Error`: Discord server error
- `502 Bad Gateway`: Discord server error

## Best Practices

### Token Security

- Never share your token
- Never commit tokens to version control
- Store tokens securely in memory only
- Clear tokens on application exit

### Rate Limiting

- Implement delays between requests
- Respect rate limit headers
- Use exponential backoff on errors
- Batch operations when possible

### Error Handling

- Always check response status
- Handle rate limits gracefully
- Retry on 5xx errors
- Log errors for debugging

### Performance

- Use pagination for large datasets
- Implement caching where appropriate
- Minimize unnecessary API calls
- Use batch operations

## Implementation Example

```typescript
// Fetch messages with rate limit handling
async function fetchMessages(channelId: string, token: string) {
  const response = await fetch(
    `https://discord.com/api/v9/channels/${channelId}/messages?limit=100`,
    {
      headers: {
        'Authorization': token
      }
    }
  )

  if (response.status === 429) {
    const data = await response.json()
    await new Promise(resolve => 
      setTimeout(resolve, (data.retry_after || 1) * 1000)
    )
    return fetchMessages(channelId, token) // Retry
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return await response.json()
}

// Delete message with error handling
async function deleteMessage(
  channelId: string, 
  messageId: string, 
  token: string
) {
  const response = await fetch(
    `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    }
  )

  if (response.status === 429) {
    const data = await response.json()
    await new Promise(resolve => 
      setTimeout(resolve, (data.retry_after || 1) * 1000)
    )
    return deleteMessage(channelId, messageId, token) // Retry
  }

  return response.ok || response.status === 404
}
```

## References

- [Discord API Documentation](https://discord.com/developers/docs)
- [Discord API Rate Limits](https://discord.com/developers/docs/topics/rate-limits)
- [Discord API Changelog](https://discord.com/developers/docs/change-log)

---

**Note:** This documentation is based on Discord API v9. API endpoints and behavior may change. Always refer to the official Discord API documentation for the most up-to-date information.

# Chat-app Backend

# Api Endpoints
- api/health `get`

## api/auth
- register          `post` {name, email, password}
- login             `post` {email, password}
- logout            `post` 
- me                `get`

## api/users
- /:id              `get` --> fetch a user
- /?filter='abc'    `get` --> fetch users with filter
- /update            `patch` {avatar, name, new_password}
- /contacts          `get`
- /groups            `get`
- /messages/missed   `get` --> fetch user missed messages

## api/conversations
- /                 `post` {name,members} --> create a group conversation
- /:id              `delete` --> delete a group conversation
- /:receId          `get`  --> get conversation between [receiver,user]
- /group/:id        `get` --> fetch a group
- /messages/send    `post` {conversationId,isGroup, receiverId, text, file}
- /messages/:convId `get` --> get all messages of a conversation
- /messages/:msgId  `delete` --> delete the message
- /messages/all/:convId `delete` --> delete all messages of a user
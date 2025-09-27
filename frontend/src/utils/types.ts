export interface User {
    _id: string
    name: string
    email: string;
    avatar: {
        path: string
        public_id: string
    }
}

export interface Conversation {
    _id: string
    name: string
    is_group: boolean
    members: [{
        user_id: string,
        role: 'admin' | 'member'
    }]
}
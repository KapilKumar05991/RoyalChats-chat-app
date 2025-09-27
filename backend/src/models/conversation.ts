import { Schema, model, Types } from 'mongoose';

export interface IConversation {
  name: string
  is_group: boolean
  members: [{
    user_id: string,
    role: 'admin' | 'member'
  }]
}

const ConversationSchema = new Schema<IConversation>({
  name: { type: String, default: '' },
  is_group: { type: Boolean, default: false },
  members: [{
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
  }],
}, { timestamps: true });

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
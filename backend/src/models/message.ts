import { Schema, model, Types } from 'mongoose';
import { string } from 'zod';

export interface IMessage {
  conversation_id: Schema.Types.ObjectId
  sender_id: Schema.Types.ObjectId
  text: string
  attachment: {
    path: string,
    public_id: string
  },
}

const MessageSchema = new Schema<IMessage>({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, trim: true },
  attachment: {
    path: { type: String, default: '' },
    public_id: { type: String, default: '' }
  },
}, { timestamps: true });

export const Message = model<IMessage>('Message', MessageSchema);
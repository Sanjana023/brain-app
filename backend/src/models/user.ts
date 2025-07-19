import mongoose, { Document, model } from 'mongoose';

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
}

//creating the schema
const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

//enforcing the model into the schema
const user = model<IUser>('User', userSchema);

export default user;

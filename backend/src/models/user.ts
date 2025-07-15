import mongoose, { model } from 'mongoose';

//creating the schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: true },
});

//enforcing the model into the schema
const user = model("User",userSchema);

export default user;

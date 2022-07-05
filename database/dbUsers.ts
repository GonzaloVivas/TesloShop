import bcrypt from 'bcryptjs';
import { User } from "../models";
import { db } from "./"

export const checkUserEmailPassword = async ( email: string, password: string ) => {

  await db.connect();
  const user = await User.findOne({ email }).lean();
  await db.disconnect();

  if ( !user ) return null;

  if ( !bcrypt.compareSync( password, user.password! ) ) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLowerCase(),
    role,
    name
  }

}

export const oAuthToDbUser = async ( oauthEmail: string, oauthName: string ) => {

  await db.connect();
  const user = await User.findOne({ email: oauthEmail }).lean();

  if ( user ) {
    await db.disconnect();
    const { _id, name, email, role } = user;

    return { _id, name, email, role };
  }

  const newUser = new User({ email: oauthEmail, name: oauthName, password: '@', role: 'client' });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;

  return { _id, name, email, role };

}
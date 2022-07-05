import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data =
  | { message: string }
  | {
    token: string;
    user: {
      email: string;
      name: string;
      role: string;
    }
  }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'POST':
      return registerUser(req, res);
  
    default:
      res.status(400).json({ message: 'Bad request'});
  }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { name = '', email = '', password = '' } = req.body as { name: string; email: string; password: string; };

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'Debe ingresar un correo válido' });
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Debe ingresar un nombre válido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseño debe tener 6 caracteres o mas' });
  }

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: 'El correo indicado ya se encuentra registrado' });
  }
  
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync( password ),
    role: 'client',
  })

  try {

    await newUser.save({ validateBeforeSave: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '500 Server error'});
  }

  const { _id, role } = newUser;

  const token = jwt.signToken( _id, email );

  return res.status(200).json({
    token: token,
    user: {
      email,
      role,
      name
    }
  })

}

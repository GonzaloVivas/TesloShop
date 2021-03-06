import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { AuthLayout } from "../../components/layouts"
import { validations } from '../../utils';
import { AuthContext } from '../../context';

type FormData = {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {

  const router = useRouter();
  const { registerUser } = useContext(AuthContext)
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onRegisterSubmit = async ({ name, email, password }: FormData) => {

    setShowError(false);
    const { hasError, message } = await registerUser( name, email, password );

    if ( hasError ) {
      setErrorMessage( message! );
      setShowError(true);
      return;
    }

    await signIn('credentials', { email, password });

  }

  return (
    <AuthLayout title={'Ingresar'}>

      <form onSubmit={ handleSubmit(onRegisterSubmit) }  noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
              {
                showError && (
                  <Chip
                    className='fadeIn'
                    label={ errorMessage }
                    color='error'
                    icon={<ErrorOutline />}
                  />
                )
              }
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Nombre completo'
                variant='filled'
                fullWidth
                {
                  ...register('name', {
                  required: 'Debe indicar un su nombre',
                  minLength: {value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                })
                }
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type='email'
                label='Email'
                variant='filled'
                fullWidth
                {
                  ...register('email', {
                    required: 'Debe indicar un correo v??lido',
                    validate: validations.isEmail
                  })
                }
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Contrase??a'
                type='password'
                variant='filled'
                fullWidth
                { ...register('password', {
                    required: 'Debe indicar una contrase??a',
                    minLength: { value: 6, message: 'La contrase??a debe tener 6 caracteres o m??s' }
                  })
                }
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                Crear cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={ router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login' } passHref>
                <Link underline='always'>
                  ??Ya tienes una cuenta? Inicia sesi??n
                </Link>
              </NextLink>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const session = await getSession({ req });
  const { p = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }

}

export default RegisterPage;
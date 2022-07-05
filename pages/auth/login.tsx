import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { AuthLayout } from "../../components/layouts"
import { validations } from '../../utils';

type FormData = {
  email: string;
  password: string;
}

const LoginPage = () => {

  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => { 
    getProviders().then( providers => {
      setProviders(providers);
    })
  }, [])
  

  const onLoginSubmit = async ( { email, password }: FormData ) => {

    setShowError(false);

    await signIn('credentials', { email, password });

  }

  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={ handleSubmit(onLoginSubmit) } noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
              {
                showError && (
                  <Chip
                    className='fadeIn'
                    label='Por favor verifica tu usuario y contraseña'
                    color='error'
                    icon={ <ErrorOutline /> }
                  />
                )
              }
            </Grid>


            <Grid item xs={12}>
              <TextField
                type='email'
                label='Email'
                variant='filled'
                fullWidth
                {
                  ...register('email', {
                    required: 'Debe indicar un correo válido',
                    validate: validations.isEmail
                  })
                }
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                type='password'
                variant='filled'
                fullWidth
                { ...register('password', {
                  required: 'Debe indicar una contraseña',
                  minLength: { value: 6, message: 'La contraseña debe tener 6 caracteres o más' }
                }) }
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                Ingresar
              </Button>
            </Grid>
            
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={ router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/register' } passHref>
                <Link underline='always'>
                  ¿No tienes cuenta? Regístrate
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display='flex' flexDirection='column'>
              <Divider sx={{ width: '100%', mb: 2 }} />

              {
                Object.values(providers).map( (provider: any) => {

                  if (provider.id === 'credentials') return (<div key='credentials'></div>)

                  return (
                    <Button
                      key={ provider.id }
                      variant='outlined'
                      fullWidth
                      color='primary'
                      sx={{ mb: 1 }}
                      onClick={ () => signIn( provider.id ) }
                    >
                      { provider.name }
                    </Button>
                  )

                })
              }

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

  if ( session ) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      }
    }
  }

  return {
    props: { }
  }
}

export default LoginPage;
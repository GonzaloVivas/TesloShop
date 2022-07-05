import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr';
import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider } from '@mui/material'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import '../styles/globals.css'
import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, UiProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
      <SessionProvider>
        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeProvider theme={ lightTheme }>
                  <CssBaseline />
                  <Component { ...pageProps } />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </SessionProvider>
    </PayPalScriptProvider>
  )
}

export default MyApp

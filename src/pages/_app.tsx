import type { AppProps } from 'next/app'
import { ToastProvider } from 'react-toast-notifications';

import '../styles/globals.css'
import './styles-Login.css';
import './Register/styles-Register.css';
import './Products/styles-Products.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider autoDismiss autoDismissTimeout={4000}>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
export default MyApp

import './styles.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

import { useEffect } from 'react';
import ToastContext, { success, error, warn } from 'context/ToastContext'
import { ThemeProvider } from 'context/ThemeContext';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, [])
  return <>
  <ThemeProvider>
    <ToastContext.Provider value={{success, error, warn}}>
      <Component {...pageProps} />
      <ToastContainer/>
    </ToastContext.Provider>
  </ThemeProvider>
  </>
}

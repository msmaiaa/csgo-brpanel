import './styles.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

import { useEffect } from 'react';
import ToastContext, { success, error, warn } from '../context/ToastContext'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, [])
  return <>
  <ToastContext.Provider value={{success, error, warn}}>
    <Component {...pageProps} />
    <ToastContainer />
  </ToastContext.Provider>
  </>
}

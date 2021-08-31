import './styles.css'
import 'react-toastify/dist/ReactToastify.css';
import ToastContext, { success, error, warn } from '../context/ToastContext'
import { ToastContainer } from 'react-toastify'

export default function MyApp({ Component, pageProps }) {
  return <>
  <ToastContext.Provider value={{success, error, warn}}>
    <Component {...pageProps} />
    <ToastContainer />
  </ToastContext.Provider>
  </>
}

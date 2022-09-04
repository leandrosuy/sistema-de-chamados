import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./Contexts/Auth";
import Routes from "./Routes";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000} />
          <Routes />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

import { Suspense } from "react";
import { WithAuthProvider } from "./pages/Login/authcontext.tsx";
import Router from "./routes/router";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./components/UI components/Loader/Loader.tsx";

function App() {
  return (
    <Suspense fallback={<Loader/>}>
      <Router />
      <ToastContainer/>
    </Suspense>
  );
}

export default WithAuthProvider(App);
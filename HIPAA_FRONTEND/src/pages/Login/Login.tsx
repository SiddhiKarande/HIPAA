import { LoginProps } from "./auth.types";
import styles from "./Login.module.scss";
import { useAuth } from "./authcontext";
import { useNavigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React from "react";
import { toast } from "react-toastify";

const withGoogleAuth = (Child: React.ComponentType) => {
  return () => (
    <GoogleOAuthProvider clientId="607365374960-bn963428ikduadegnr8b3pllr3bm5hfj.apps.googleusercontent.com">
      <Child />
    </GoogleOAuthProvider>
  );

}

const Login = ({ }: LoginProps) => {

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSuccessfulLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const response = await auth.handleOAuthLogin(credentialResponse);
      if (response.role) {
        navigate(`/${response.role}/courses`);
      }
    } catch (e) {
      toast.error('Login failed')
    }
  }

  const handleFailedLogin = () => {
    toast.error('Login Failed, Please try again.')
  }

  return (
    <div className={styles.Login}>
      <div className={styles.Left}>
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMjE3IiB2aWV3Qm94PSIwIDAgODAgMjE3IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMC4wODM0NzQ4IDExOC40MDZDMS45MDM1OSAxNDkuNTg5IDI4LjgxOTYgMTUyLjAzNSAzOC42Nzg1IDE1MC41MDdMMC4wODM0NzQ4IDIxN0gyOC44MTI4QzUxLjYyNDggMTg3Ljk5NyA1OS40NzgxIDE3NS45MzcgNjYuOTU3NCAxNjEuOTkyQzkxLjIyMTYgMTE2Ljc1MyA3Ny4yOTQgOTMuODY2OSA2MC4yMjYzIDg0LjM1MzJDNDIuNjQ5MiA3NC41NTU1IC0yLjE5MTY3IDc5LjQyNzQgMC4wODM0NzQ4IDExOC40MDZaIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjMzIiByPSIzMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
          alt="Coditas Logo"
        />
      </div>

      <div className={styles.Right}>
        <div className={styles.ImgContainer}>
          <img src="" className={styles.Logo} />
          <h1 className={styles.TitleMain}>Hipaa</h1>
        </div>
        <h2 className={styles.TitleSecondary}>
          Welcome to HIPAA training platform
        </h2>
        <p className={styles.Para}>
          Sign in using your Coditas G-suite account
        </p>
        <GoogleLogin
          onSuccess={handleSuccessfulLogin}
          onError={handleFailedLogin}
          useOneTap
        />
      </div>
    </div>
  );
};

export default withGoogleAuth(Login);

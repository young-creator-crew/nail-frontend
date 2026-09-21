import LoginForm from "../../components/auth/LoginForm.jsx";
import styles from "./AuthPage.module.css";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          type="button"
          onClick={() => navigate(-1)}
        >
          <span>&#8617;</span>
        </button>
        <span className={styles.headerSpacer} />
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>Boas-vindas de volta</h1>
        <p className={styles.subtitle}>
          Entre para consultar seus serviços e próximos agendamentos.
        </p>
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;

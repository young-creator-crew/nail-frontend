import RegisterForm from "../../components/auth/RegisterForm.jsx";
import styles from "./AuthPage.module.css";

export function Register() {
  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <h1 className={styles.title}>Cadastrar</h1>
        <RegisterForm />
      </main>
    </div>
  );
}

export default Register;

import { useState } from "react";
import { useContext } from "react";
import { login } from "../../services/authService.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import styles from "./LoginForm.module.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const user = useContext(AuthContext);

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    const result = await login(email, password);

    if (result === 200) {
      console.log("Login successful", { rememberMe });
      return;
    }

    if (result === 401) {
      setErrorMessage("Invalid password");
      return;
    }

    if (result === 422) {
      setErrorMessage("User not found");
      return;
    }

    if (result === 500) {
      setErrorMessage("Internal server error");
      return;
    }

    setErrorMessage("An unexpected error occurred.");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="emailInput">E-mail</label>
      <input
        className={styles.input}
        type="email"
        id="emailInput"
        placeholder="nome@exemplo.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label className={styles.label} htmlFor="passwordInput">Senha</label>
      <div className={styles.passwordField}>
        <input
          className={styles.input}
          type={showPassword ? "text" : "password"}
          id="passwordInput"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className={styles.passwordToggle}
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
        >
          <span className={`${styles.passwordIcon} ${showPassword ? styles.passwordVisible : ""}`} />
        </button>
      </div>

      <div className={styles.options}>
        <label className={styles.remember}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <span>Lembrar de mim</span>
        </label>
        <button className={styles.forgotPassword} type="button">
          Esqueci minha senha
        </button>
      </div>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <button className={styles.button} type="submit">Entrar</button>

      <p className={styles.registerPrompt}>
        Ainda não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </form>
  );
}

export default LoginForm;
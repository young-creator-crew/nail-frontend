import { useState } from "react";
import { register } from "../../services/authService.js";
import styles from "./RegisterForm.module.css";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName]= useState("");

    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    const result = await register(email, password, name);

    if (result === 201) {
      console.log("Register successful");
      alert("IRRAAAAAAAAAA")
      return;
    }

    if (result === 409) {
      setErrorMessage("This email is already registered.");
      return;
    }

    if (result === 500) {
      setErrorMessage("Internal server error. Please try again later.");
      return;
    }

    setErrorMessage("An unexpected error occurred.");

    }

    return (
    
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="emailInput">Email</label>
      <input
        className={styles.input}
        type="text"
        id="emailInput"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label className={styles.label} htmlFor="passwordInput">Password</label>
      <input
        className={styles.input}
        type="password"
        id="passwordInput"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <label className={styles.label} htmlFor="usernameInput">Username</label>
      <input
        className={styles.input}
        type="text"
        id="usernameInput"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <button className={styles.button} type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
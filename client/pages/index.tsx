import type { NextPage } from 'next';
import LoginForm from '../modules/login/loginForm';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => (
  <div className={styles.container}>
    <div className={styles.main}>
      <LoginForm />
    </div>
  </div>
);

export default Home;

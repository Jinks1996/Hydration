// import Dashboard from './dashboard/index';
import styles from './index.module.scss';
import Header from '../components/header';
export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <div className={styles.page}>
      <Header/>
    </div>
  );
}

export default Index;

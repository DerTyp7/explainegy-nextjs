import ContentTable from "./ContentTable";
import Sidebar from "./Sidebar";
import styles from "../../../styles/Tutorial.module.scss";

export default function Layout({ children }) {
	return (
		<div className={styles.tutorial}>
			<ContentTable />
			<div>{children}</div>
			<Sidebar />
		</div>
	);
}

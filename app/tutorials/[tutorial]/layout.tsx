import ContentTable from "./ContentTable";
import Sidebar from "./Sidebar";
import styles from "../../../styles/Tutorial.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.tutorial}>
			<ContentTable />
			<div className="tutorialContent">{children}</div>
			<Sidebar />
		</div>
	);
}

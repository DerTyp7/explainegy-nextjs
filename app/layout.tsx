import "../styles/globals.scss";
import Nav from "./Nav";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<body>
			<Nav />
			<main>{children}</main>
		</body>
	);
}

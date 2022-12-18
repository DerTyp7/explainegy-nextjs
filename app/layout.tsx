import "../styles/globals.scss";
import Nav from "./Nav";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<head></head>
			<body>
				<header>
					<Nav />
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}

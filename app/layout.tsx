import "../styles/globals.scss";
import Nav from "./Nav";
import Footer from "./Footer";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html style={{ scrollBehavior: "smooth" }}>
			<head></head>
			<body>
				<header>
					<Nav />
				</header>
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}

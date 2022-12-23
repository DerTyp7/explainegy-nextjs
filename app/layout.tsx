import "../styles/globals.scss";
import "../styles/colorVariables.scss";
import "../styles/variables.scss";
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

			<body className="body">
				<header>
					<Nav />
				</header>
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}

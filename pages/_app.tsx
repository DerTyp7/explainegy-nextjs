import "@/styles/globals.scss";
import "@/styles/inputs.scss";
import "@/styles/buttons.scss";
import "@/styles/typography.scss";
import type { AppProps } from "next/app";
import AdminNav from "@/components/AdminNav";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header>
        <Nav categories={[]} />
        <AdminNav />
      </header>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

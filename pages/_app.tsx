import "@/styles/globals.scss";
import "@/styles/inputs.scss";
import "@/styles/buttons.scss";
import "@/styles/typography.scss";
import type { AppProps } from "next/app";
import AdminNav from "@/components/AdminNav";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Category } from "@prisma/client";
import prisma from "@/lib/prisma";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header>
        <Nav />
        <AdminNav />
      </header>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

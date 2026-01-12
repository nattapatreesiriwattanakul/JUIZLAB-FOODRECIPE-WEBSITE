import "@/styles/globals.css";
import RootLayout from "@/components/RootLayout";

const noLayoutRoutes = ["/login", "/register"];

export default function App({ Component, pageProps, router }) {
  const isStandalone = noLayoutRoutes.includes(router.pathname);

  return isStandalone ? (
    <Component {...pageProps} />
  ) : (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

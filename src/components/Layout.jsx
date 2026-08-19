import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { useSettings } from "../settingsContext.jsx";

export default function Layout({ children }) {
  const { settings } = useSettings();

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer footer={settings?.footer} />
    </>
  );
}

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import StickyContactBar from "./StickyContactBar.jsx";
import LeadPopup from "./LeadPopup.jsx";
import { useSettings } from "../settingsContext.jsx";

export default function Layout({ children }) {
  const { settings } = useSettings();

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer footer={settings?.footer} />
      <StickyContactBar />
      <LeadPopup />
    </>
  );
}

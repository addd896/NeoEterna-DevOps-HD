import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom"; // ✅ Both hooks needed
import AppRoutes from "./routes/AppRoutes";

const ScrollToTop = () => {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "NeoEterna – Blockchain Time Capsules";
        metaDescription = "Preserve your memories forever on the blockchain.";
        break;
      case "/dashboard":
        title = "Dashboard | NeoEterna";
        break;
      case "/create":
        title = "Create Capsule | NeoEterna";
        break;
      case "/login":
        title = "Login | NeoEterna";
        break;
      // Add other pages as needed
    }

    if (title) document.title = title;

    if (metaDescription) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) tag.content = metaDescription;
    }
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;

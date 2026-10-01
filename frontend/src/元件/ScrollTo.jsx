import { useLayoutEffect} from "react";
import { useLocation } from "react-router";

function ScrollTop() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.key]);
}
export default ScrollTop;

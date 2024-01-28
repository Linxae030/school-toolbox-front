import { useRoutes } from "react-router-dom";
import routes from "./router";
import useWatchRoutes from "./hooks/useWatchRoute";

function App() {
  useWatchRoutes();
  return <>{useRoutes(routes)}</>;
}

export default App;

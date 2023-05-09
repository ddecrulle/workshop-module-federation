import { createBrowserRouter } from "react-router-dom";
import App from "App";
import RemoteContainer from "RemoteContainer";

export const router = createBrowserRouter([{
  path: "/remote/*",
  element: <RemoteContainer />
},
{
  path: "/",
  element: <App />
}]
)
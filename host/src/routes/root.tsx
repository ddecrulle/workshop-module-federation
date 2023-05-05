import { createBrowserRouter } from "react-router-dom";
import App from "App";
import RemoteApp from "remoteApp/RemoteApp"

export const router = createBrowserRouter([{
  path: "/remote",
  element: <RemoteApp />
},
{
  path: "/",
  element: <App />
}]
)
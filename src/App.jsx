import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import RootLayout from "./layouts/Root.layout";
import HomePage from "./pages/Home.page";
import LoginPage from "./pages/Login.page";
import SignupPage from "./pages/Signup.page";
import EditLinkPage from "./pages/EditLink.page";
import NotFoundPage from "./pages/NotFound.page";
import { isUserValid } from "./lib/pocketbase";


const ROUTER = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={isUserValid ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="edit/:id" element={<EditLinkPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  ),
);


export default function App() {
  return <RouterProvider router={ROUTER} />
}



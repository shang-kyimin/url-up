import { Link, Outlet } from "react-router-dom";
import { isUserValid, signout } from "../lib/pocketbase";


export default function RootLayout() {
  return (
    <div className="root-layout space-y-4">
      <header className="flex justify-between items-center mx-1 py-4 px-8 border-b border-co-base">
        <Link to="/">
          <h1 className="text-3xl font-bold">Url-Up</h1>
        </Link>

        <div className="flex gap-6">
          {!isUserValid
            ? (
              <>
                <Link to="/login">
                  <button className="main-btn bg-co-base text-co-lavender">Log In</button>
                </Link>
                <Link to="/signup">
                  <button className="main-btn">Sign Up</button>
                </Link>
              </>
            ) : (
              <>
                <button className="main-btn bg-co-base text-co-lavender" onClick={signout}>
                  Log out
                </button>
              </>
            )
          }
        </div>
      </header>
      
      <div className="mx-auto">
        <Outlet />
      </div>
    </div>
  );
}



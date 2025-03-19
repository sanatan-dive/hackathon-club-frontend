import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { SignedIn, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <>
      <div className="min-h-screen text-stone-300 antialiased">
        {/* Background container */}
        <div className="fixed inset-0 -z-10">
          <div className="relative h-full w-full bg-black">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <Header>
            <div className="flex items-center gap-2 lg:gap-4">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          
          <main>
            <Outlet /> {/* This will render the nested routes */}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
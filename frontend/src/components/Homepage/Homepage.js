import React from "react";
import Header from "../Header/Header";
import "../../css/styles.css";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";

export default function Homepage({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  return (
    <>
      <Header
        setIsAuthenticated={setIsAuthenticated}
        setIsAuthenticatedInBackend={setIsAuthenticatedInBackend}
      />
      <Menu />
      <div>
        <div className="main-wrapper">
          <main className="scale-down">
            {/* Render your React components or content here */}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}

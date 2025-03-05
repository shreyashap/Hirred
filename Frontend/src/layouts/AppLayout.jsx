import { Outlet } from "react-router-dom";
import Header from "../components/Custom/Header";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container mx-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

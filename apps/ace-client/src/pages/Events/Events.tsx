import { Outlet } from "react-router-dom";

export default function Events() {
  return (
    <div className="flex flex-col align-middle  py-4  md:py-6">
      <Outlet />
    </div>
  );
}

import { Link, Outlet } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function LibrarySubLayout() {
  return (
    <div>
      <Link
        to="/dashboard/library"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <FiArrowLeft size={16} /> Thư viện
      </Link>
      <Outlet />
    </div>
  );
}

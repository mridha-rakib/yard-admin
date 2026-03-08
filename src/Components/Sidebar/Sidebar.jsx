import { FiLogOut } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import brandlogo from "../../assets/image/yard_logo.png";
import {
  AlignCenterVertical,
  ChartColumnIncreasing,
  Crown,
  Settings,
  Users,
} from "lucide-react";
import { BsBadgeAd } from "react-icons/bs";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { useAuthStore } from "../../stores/use-auth-store";

const Sidebar = ({ closeDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  const menuItems = [
    {
      icon: <RiDashboardHorizontalLine className="w-5 h-5" />,
      label: "Dashboard",
      Link: "/",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Bookings",
      Link: "/booking",
    },
    {
      icon: <ChartColumnIncreasing className="w-5 h-5" />,
      label: "Workers",
      Link: "/workers",
    },
    {
      icon: <Crown className="w-5 h-5" />,
      label: "Payments",
      Link: "/payments",
    },

    {
      icon: <BsBadgeAd className="w-5 h-5"/>,
      label: "Customers",
      Link: "/customers",
    },
    {
      icon: <AlignCenterVertical className="w-5 h-5"/>,
      label: "Support",
      Link: "/support",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      Link: "/settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
    closeDrawer?.();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="w-72  bg-[#0a3019]  h-full">
      <div className="border-b-2 border-[#166534]">
         <div className="px-8 py-5 ">
        <img src={brandlogo} alt="logo" className="w-auto" />
      </div>
      </div>

      <div className="flex-1 overflow-y-auto ">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.Link;

          return (
            <div key={item.label}>
              <div
                className={`flex w-4/5 mx-auto rounded-lg justify-between items-center px-5 py-2 my-5 cursor-pointer transition-all hover:bg-[#166534] hover:text-white hover:font-semibold ${
                  isActive
                    ? "bg-[#166534] text-white font-semibold"
                    : "text-white"
                }`}
              >
                <Link to={item.Link} onClick={() => closeDrawer?.()} className="flex items-center gap-3">
                  {item.icon}
                  <p>{item.label}</p>
                  {item.isDropdown && (
                    <BiChevronDown
                      className={`${isActive ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-60">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isInitializing}
          className="flex items-center justify-center w-full py-3 text-xl text-white rounded-lg cursor-pointer gap-x-5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiLogOut className="text-xl" />
          <p>{isInitializing ? "Logging out..." : "Log out"}</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

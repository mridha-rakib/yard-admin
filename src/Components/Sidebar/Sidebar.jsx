import { FiLogOut } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import brandlogo from "../../assets/image/yard_logo.png";
import {
  AlignCenterVertical,
  ChartColumnIncreasing,
  Crown,
  Settings,
  TriangleAlert,
  Users,
} from "lucide-react";
import { BsBadgeAd } from "react-icons/bs";
import { SiActivitypub } from "react-icons/si";
import { RiDashboardHorizontalLine } from "react-icons/ri";


const Sidebar = ({ closeDrawer }) => {
  const location = useLocation();

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
                <Link to={item.Link} className="flex items-center gap-3">
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
        <Link to="/sign-in">
          <div className="flex items-center justify-center w-full py-3 text-xl text-white rounded-lg cursor-pointer gap-x-5">
            <FiLogOut className="text-xl" />
            <p>Log out</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

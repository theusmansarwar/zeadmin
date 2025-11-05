import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import logo from "./Assets/zemaltlogo.svg";

import AddBlog from "./Pages/Blogs/AddBlog";
import Team from "./Pages/Team/Team";
import AddTeam from "./Pages/Team/AddTeam";
import TeamCategory from "./Pages/TeamCategory/TeamCategory";
import Blogs from "./Pages/Blogs/Blogs";
import Categories from "./Pages/Categories/Categories";
import Comments from "./Pages/Comments/Comments";
import Leads from "./Pages/Leads/Leads";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Testimonial from "./Pages/Testimonials/Testimonial";
import AddTestimonial from "./Pages/Testimonials/AddTestimonial";
import Applications from "./Pages/Applications/Applications";
import ViewApplication from "./Pages/Applications/ViewApplication";
import UserType from "./Pages/Users/UserType";
import Users from "./Pages/Users/Users";
import FeaturedBlogs from "./Pages/FeaturedBlogs/FeaturedBlogs";
import AddServices from "./Pages/Services/AddServices";
import Services from "./Pages/Services/Services";
import Industries from "./Pages/Industries/Industries";
import CaseStudies from "./Pages/CaseStudies/CaseStudies";
import AddCaseStudies from "./Pages/CaseStudies/AddCaseStudies";
import AddIndustries from "./Pages/Industries/AddIndustries";
import { FaGears } from "react-icons/fa6";
import {
  MdBusinessCenter,
  MdCategory,
  MdComment,
  MdDashboard,
  MdOutlineDoubleArrow,
  MdOutlineFeaturedPlayList,
  MdWork,
  MdArticle,
} from "react-icons/md";
import { RiTeamFill, RiTeamLine } from "react-icons/ri";
import {
  FaBlog,
  FaBookOpen,
  FaQuoteRight,
  FaUser,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";
import { PiUsersFourFill } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import { BsMicrosoftTeams } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowForward, IoIosPeople } from "react-icons/io";
import { SiLibreofficewriter } from "react-icons/si";
import { Tooltip } from "@mui/material";
import AddSubService from "./Pages/Services/AddSubService";
import Roles from "./Pages/Roles/Roles";
import AddJobs from "./Pages/Jobs/AddJobs";
import Job from "./Pages/Jobs/Jobs";
const App = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeitems, setActiveitems] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDropdownToggle = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const allItems = [
    { id: 1, name: "Dashboard", route: "/dashboard", icon: <MdDashboard /> },
    { id: 2, name: "Leads", route: "/leads", icon: <MdWork /> },
     {
      id: 3,
      name: "Services",
      icon: <FaGears />,
      route: "/services",
    },
    {
      id: 4,
      name: "Industries",
      route: "/industries",
      icon: <MdBusinessCenter />,
    },
    
     {
      id: 5,
      name: "Case Studies",
      route: "/casestudies",
      icon: <FaBookOpen />,
    },
    {
      id: 6,
      name: "Blogs",
      icon: <FaBlog />,
      children: [
        { id: 1, name: "All Blogs", route: "/blogs", icon: <MdArticle /> },
        {
          id: 62,
          name: "Featured Blogs",
          route: "/blogs/featured",
          icon: <MdOutlineFeaturedPlayList />,
        },
        {
          id: 63,
          name: "Categories",
          route: "/categories",
          icon: <MdCategory />,
        },
        { id: 64, name: "Comments", route: "/comments", icon: <MdComment /> },
      ],
    },

    {
      id: 7,
      name: "Testimonials",
      route: "/testimonials",
      icon: <FaQuoteRight />,
    },
    {
      id: 8,
      name: "Teams",
      icon: <RiTeamFill />,
      children: [
        { id: 81, name: "All Teams", route: "/teams", icon: <IoIosPeople /> },
        {
          id: 82,
          name: "Team Categories",
          route: "/team-categories",
          icon: <RiTeamLine />,
        },
        {
          id: 83,
          name: "Team Roles",
          route: "/roles",
          icon: <RiTeamLine />,
        },
      ],
    },
   
    {
      id: 9,
      name: "Jobs & Applicants",
      icon: <BsMicrosoftTeams />,
      children: [
        {
          id: 91,
          name: "Jobs",
          route: "/jobs",
          icon: <SiLibreofficewriter />,
        },
        {
          id: 92,
          name: "Applicants",
          route: "/applications",
          icon: <PiUsersFourFill />,
        },
      ],
    },
    {
      id: 10,
      name: "Users",
      icon: <FaUser />,
      children: [
        { id: 101, name: "All Users", route: "/users", icon: <FaUsers /> },
        { id: 102, name: "User Types", route: "/usertype", icon: <FaUserCog /> },
      ],
    },
   
    
  ];

  useEffect(() => {
    const currentItem = allItems.find(
      (item) =>
        item.route === location.pathname ||
        item.children?.some((child) => child.route === location.pathname)
    );
    setActiveitems(currentItem?.id || null);
  }, [location.pathname]);

  const handleitemsClick = (item) => {
    if (item.children) {
      setActiveitems(item.id);
      handleDropdownToggle(item.id);
    } else {
      setActiveitems(item.id);
      handleDropdownToggle(item.id);
      navigate(item.route);
    }
  };

  const handleChildClick = (child) => {
    navigate(child.route);
  };

  return (
    <div className="App">
      <div className={`app-side-bar ${isOpen ? "open" : "closed"}`}>
        <div className="opencloseicon" onClick={toggleMenu}>
          <MdOutlineDoubleArrow className={isOpen ? "rotated" : ""} />
        </div>
        <div className="logo-area">
          <img src={logo} className="logo" alt="Zemalt Logo" />
        </div>
        <ul className="Parent-ul">
          {allItems.map((item) => (
            <>
              <Tooltip title={!isOpen ? item.name : ""} placement="right" arrow>
                <li
                  key={item.id}
                  className={
                    activeitems === item.id ? "selected-item" : "unselected"
                  }
                  onClick={() => handleitemsClick(item)}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  {item.icon}
                  {isOpen && (
                    <span>
                      {item.name}
                      {item.children && (
                        <>
                          {openDropdown === item.id ? (
                            <IoIosArrowDown />
                          ) : (
                            <IoIosArrowForward />
                          )}
                        </>
                      )}
                    </span>
                  )}
                </li>
              </Tooltip>

              {item.children && openDropdown === item.id && (
                <ul
                  className="Child-ul"
                  style={{
                    listStyle: "none",
                  }}
                >
                  {item.children.map((child) => (
                    <Tooltip
                      title={!isOpen ? child.name : ""}
                      placement="right"
                      arrow
                    >
                      <li
                        key={child.id}
                        className={
                          location.pathname === child.route
                            ? "selected-item"
                            : "unselected"
                        }
                        onClick={() => handleChildClick(child)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {child.icon}
                        {isOpen && <span>{child.name}</span>}
                      </li>
                    </Tooltip>
                  ))}
                </ul>
              )}
            </>
          ))}

          <Tooltip title={!isOpen ? "Logout" : ""} placement="right" arrow>
            <li className="unselected" onClick={onLogout}>
              <IoLogOut />
              {isOpen && <span>Logout</span>}
            </li>
          </Tooltip>
        </ul>
      </div>

      <div className="app-right">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/add-industry" element={<AddIndustries />} />
          <Route path="/edit-industry/:id" element={<AddIndustries />} />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/edit-blog/:id" element={<AddBlog />} />
          <Route path="/blogs/featured" element={<FeaturedBlogs />} />
          <Route path="/edit-featuredblog/:id" element={<AddBlog />} />
          <Route path="/categories" element={<Categories />} />

          <Route path="/comments" element={<Comments />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/add-testimonial" element={<AddTestimonial />} />
          <Route path="/edit-testimonial/:id" element={<AddTestimonial />} />

          <Route path="/users" element={<Users />} />
          <Route path="/usertype" element={<UserType />} />

          <Route path="/casestudies" element={<CaseStudies />} />
          <Route path="/add-casestudies" element={<AddCaseStudies />} />
          <Route path="/edit-casestudies/:id" element={<AddCaseStudies />} />

          <Route path="/teams" element={<Team />} />
          <Route path="/add-team" element={<AddTeam />} />
          <Route path="/edit-team/:id" element={<AddTeam />} />
          <Route path="/team-categories" element={<TeamCategory />} />
           <Route path="/roles" element={<Roles />} />

          <Route path="/jobs" element={<Job />} />
          <Route path="/add-job" element={<AddJobs />} />
          <Route path="/edit-job/:id" element={<AddJobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/view-application/:id" element={<ViewApplication />} />

          <Route path="/services" element={<Services />} />
          <Route path="/add-service" element={<AddServices />} />
          <Route path="/edit-service/:id" element={<AddServices />} />
          <Route path="/service/:serviceId/add-subservice" element={<AddSubService />} />
          <Route path="/service/:serviceId/edit-subservice/:subServiceId" element={<AddSubService />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

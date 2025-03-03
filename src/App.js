import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import zemaltlogo from "./Assets/zemalt-logo.png";
import personimg from "./Assets/person.png";
import AddBlog from "./Pages/Blogs/AddBlog";
import Blogs from "./Pages/Blogs/Blogs";
import Categories from "./Pages/Categories/Categories";
import Comments from "./Pages/Comments/Comments";
import Leads from "./Pages/Leads/Leads";
import ViewLead from "./Pages/Leads/ViewLead";
import TeamCategory from "./Pages/TeamCategory/TeamCategory";
import Team from "./Pages/Team/Team";
import AddTeam from "./Pages/Team/AddTeam";
import Roles from "./Pages/Roles/Roles";

const App = ({ onLogout, message }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeitems, setActiveitems] = useState(null);

  const items = useMemo(
    () => [
      { id: 1, name: "Dashboard", route: "/dashboard" },
      { id: 2, name: "Leads", route: "/leads" },
      { id: 3, name: "Blogs", route: "/blogs" },
      { id: 4, name: "Categories", route: "/categories" },
      { id: 5, name: "Comments", route: "/comments" },
      { id: 6, name: "Teams", route: "/teams" },
      { id: 7, name: "Team Categories", route: "/team-categories" },
      { id: 8, name: "Roles", route: "/roles" },
    
    ],
    []
  );

  useEffect(() => {
    const currentItem = items.find((item) => item.route === location.pathname);
    setActiveitems(currentItem?.id || null);
  }, [location, items]);

  const handleitemsClick = (item) => {
    setActiveitems(item.id);
    navigate(item.route);
  };

  return (
    <div className="App">
      <div className="app-side-bar">
        <img src={zemaltlogo} className="home-zemalt-logo" alt="zemalt Logo" />
        <div className="userprofile">
          <div
            className="avatar"
            style={{
              backgroundImage: `url(${personimg})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="avatar-data">
            <p>Profile</p>
            <h4>Admin</h4>
          </div>
        </div>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={activeitems === item.id ? "selected-item" : "unselected"}
              onClick={() => handleitemsClick(item)}
            >
              {item.name}
            </li>
          ))}
          <li className="unselected" onClick={onLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="app-right">
      
          <Routes>
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/add-categories" element={<AddBlog />} />
            <Route path="/edit-blog/:id" element={<AddBlog />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/team-categories" element={<TeamCategory />} />
            <Route path="/teams" element={<Team />} />
            <Route path="/add-team" element={<AddTeam />} />
            <Route path="/edit-team/:id" element={<AddTeam />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/view-lead/:id" element={<ViewLead />} />
            <Route path="/blogs" element={<Blogs />} />
           
          </Routes>
    
      </div>
    </div>
  );
};

export default App;

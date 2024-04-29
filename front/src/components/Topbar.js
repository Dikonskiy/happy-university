import "../css/profile.css";
import avatar from "../elements/stud_photo.jpg"
import Info from "./Info";

const Topbar = () => {
  const role = localStorage.getItem("userRole");
  const path = window.location.pathname
  .split("/").filter(path => path !== "");
  const tab = path[path.length - 1];

  return (
    <div className="top-bar">
        <header className="header">
            {role === "Student" && (
            <h2>
                Student Information
                <br />
                System
            </h2>
            )}
            {role === "Teacher" && (
            <h2>
                Teacher Information
                <br />
                System
            </h2>
            )}
            {role === "Admin" && (
            <h2>
                Admin Workspace
                <br />
                System
            </h2>
            )}
            <h2>Portal Guidlenes</h2>
        </header>

        {tab !== 'home' && (
            <div className="profile">
            <Info/>
            <img src={avatar} width="140" height="180" className="images" alt="Profile"/>
            </div>
        )}
    </div>
  );
};

export default Topbar;

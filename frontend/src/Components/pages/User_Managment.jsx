import React, { useState,useEffect } from "react";
import "./Dashboard.css";
import axios from 'axios';
import  Analytics  from "./Analytics";
import  CameraZones  from "./CameraZones";
import  Dashboard  from "./Dashboard";
import  LogOut  from "./LogOut";
import { FaTachometerAlt, FaUsers, FaCamera} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import Profile from "./Profile";
import VideoZones from "./VideoZones";
import LoginRegister from "../LoginRegister/LoginRegister";


const UserManagement = () => {
  
  // const [activeItem, setActiveItem] = useState("UserManagement");

  const [activeItem, setActiveItem] = useState("CameraZones");
  const [userDetails,setUserDetails]= useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // const downloadCSV = () => {
  //   const csvData = userDetails.map(user => ({
  //     User: user.username,
  //     Email: user.email,
  //     Status: user.is_active ? 'Active' : 'Inactive',
  //     'Date Joined': new Date(user.date_joined).toLocaleDateString()
  //   }));

  //   const csvContent = [
  //     Object.keys(csvData[0]).join(','),
  //     ...csvData.map(row => Object.values(row).join(','))
  //   ].join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'user_details.csv';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };
  

 

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  
  useEffect(()=>{
     const getDetails = async(e)=>{
          
          try{
              const response = await axios.get("http://127.0.0.1:8000/userDetails/");
              console.log(response);
              setUserDetails(response.data.users)
            }
          catch(err){
              alert(err.response.data.error||"No Details Found");
          }
      }
      getDetails();
  },[])
  
  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <Dashboard />;
      case "Analytics":
        return <Analytics />;
      case "Profile":
        return <Profile/>;
      case "CameraZones":
        return <CameraZones />;
      case "VideoZones":
        return <VideoZones/>
      case "LogOut":
        return <LogOut />;
      default:
        
        return (
          <div className="display">
              <div className="label">Admin Console</div>
                   <div className="user-managment">
                      <div className="heading">
                          <span className="icon"><MdGroups /></span>
                           User Management
                           {/*<button className="DownloadCSV" onClick = {downloadCSV}>DownloadCsv</button>*/}
                      </div>
                   <div className="user-list">
                      <div className="user-list-header">
                         <div>User</div>
                         <div>Email</div>
                         <div>Status</div>
                         <div>Date Joined</div>
                      </div>

                     {userDetails.map(user => (
                          <div className="user-list-row" key={user.id}>
                              <div>{user.username}</div>
                              <div>{user.email}</div>
                              <div>{user.is_active ? 'Active' : 'Inactive'}</div>
                              <div>{new Date(user.date_joined).toLocaleDateString()}</div>
                          </div>
                      ))}
                  </div>
               </div>
            </div>
        
        );
    }
  };
  if (!isLoggedIn) {
    return <LoginRegister />;
  };
  return (
    <div className="dashboard">
      <div className="title-heading">
        <h1 className="title">People Counting and Zone Management System</h1>
      </div>
      <div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="side-menu">
        <ul>
          <li onClick={() => setActiveItem("UserManagement")}>
            <span className="icon"><FaUsers /></span>User Management
          </li>
          <li onClick={() => setActiveItem("Dashboard")}>
            <span className="icon"><FaTachometerAlt /></span>Dashboard
          </li>
          <li onClick={() => setActiveItem("CameraZones")}>
            <span className="icon"><FaCamera /></span>Camera Zones
          </li>
           <li onClick={() => setActiveItem("VideoZones")}>
            <span className="icon"><FaVideo /></span>Video Zones
          </li>
          <li onClick={() => setActiveItem("Profile")}>
            <span className="icon"><FaUserCircle /></span>Profile
          </li>
          {/* <li onClick={() => setActiveItem("Analytics")}>
            <span className="icon"><FaChartBar /></span>Analytics
          </li>
          <li onClick={() => setActiveItem("LogOut")}>
            <span className="icon"><FaSignOutAlt /></span>Logout
          </li> */}
         
        </ul>
      </div>

      {renderContent()}

    </div>
  );
};

export default UserManagement;

import React,{useEffect,useState} from 'react';
import axios from 'axios';

const Profile =()=>{

  const [userDetails,setuserDetails] = useState(null);

  useEffect(()=>{
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/profile/");
        setuserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  },[]);

  return (
        <div>
          <table>
            <thead>
              <tr>
                <th colSpan="2">User Profile</th>
              </tr>
            </thead>
            <tbody>
              {userDetails && (
                <tr>
                  <td>Username:</td>
                  <td>{userDetails.username}</td>
                </tr>
              )}
              {userDetails && (
                <tr>
                  <td>Email:</td>
                  <td>{userDetails.email}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>  
  );
};

export default Profile;
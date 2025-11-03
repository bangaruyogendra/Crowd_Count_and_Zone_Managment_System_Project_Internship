import React from "react";
import { FaSquareGithub } from "react-icons/fa6";
const Documentation = () => {


const openGitHub = () => {
    window.open("https://github.com/bangaruyogendra/Infosys_CrowdCount_October_2025_Bangaru_Balu_Yogendra", "_blank");
}

  const styles = {
    container: {
      position: "relative",
      top: "80px",
      margin: "20px auto",
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      padding: "10px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "600px",
    },
    title: {
      color: "darkblue",
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "10px",
    },
    subtitle: {
      color: "#333",
      fontWeight: "600",
      marginTop: "15px",
    },
    list: {
      marginLeft: "20px",
      lineHeight: "1.6",
    },
    paragraph: {
      color: "#555",
      lineHeight: "1.6",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Project– Quick Guide</div>

      <p style={styles.paragraph}>
        This project helpful to detect people in crowd Places like malls, airports, and train stations in real time using <b>Django</b>, <b>Redis</b>, and <b>React</b>.
        Django handles video processing, Redis stores live detection data, and React displays the
        real time results instantly in form charts and alerts.
      </p>

      <div style={styles.subtitle}>How to Run</div>
      <ul style={styles.list}>
        <li>Start Redis Server: <code>redis-server</code></li>
        <li>Run Django Backend: <code>python manage.py runserver</code></li>
        <li>Start React App: <code>npm start</code></li>
        <li>Open in browser: <b>http://localhost:3000</b></li>
      </ul>

      <div style={styles.subtitle}>How It Works</div>
      <ul style={styles.list}>
        <li>Django captures video frames.</li>
        <li>YOLO model detects people in each frame.</li>
        <li>Detection results are stored in Redis.</li>
        <li>React fetches and displays real-time people count.</li>
      </ul>
     <button style={{marginTop:"20px", padding:"10px 15px", backgroundColor:"darkblue", color:"white", border:"none", borderRadius:"5px", cursor:"pointer", ":hover":{backgroundColor:"blue"}}}
      onClick={openGitHub}><span style={{marginRight:"5px"}}><FaSquareGithub /></span>Github</button>
    </div>
  );
};

export default Documentation;

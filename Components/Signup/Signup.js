import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../Capture.PNG";

import "./Signup.css";
import { Firebase } from "../../firebase/config";
import { useHistory } from "react-router";
import SignUpLoading from "../Loading/SignUpLoading";

export default function Signup() {
  const history = useHistory();
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState(""); // State to manage error message
  let [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if phone number is exactly 10 digits
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return; // Exit function if phone number is invalid
    }
    
    setLoading(true);
    
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user.updateProfile({ displayName: name }).then(() => {
          Firebase.firestore().collection("users").doc(result.user.uid).set({
            id: result.user.uid,
            name: name,
            phone: phone,
          });
        });
      })
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        setError(error.message); 
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <>
      {/* {loading && <SignUpLoading/> }  */}
      <div>
        <div className="signupParentDiv">
          <img width="200px" height="200px" src={Logo} alt=""></img>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <br />
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
            />
            <br />
            <label>Email</label>
            <br />
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            <br />
            <label>Phone</label>
            <br />
            <input
              className="input"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              name="phone"
            />
            {error && <p style={{ color: "red" }}>{error}</p>} 
            <br />
            <label>Password</label>
            <br />
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            <br />
            <br />
            <button >Signup</button> 
          </form>
          <Link to="/login">Login</Link>
        </div>
      </div> 
    </>
  );
}

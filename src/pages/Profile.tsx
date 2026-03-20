import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../reduxHooks";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

export default function Profile() {
  const user = useAppSelector((s) => s.register.user);
  const navigate = useNavigate();

  // 🔥 Sync Redux user to localStorage (keeps updates after refresh)
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // If no user
  if (!user) {
    return (
      <div className="container">
        <h1>Profile</h1>
        <p>No user profile found.</p>
        <p>
          Please <a href="/login">log in</a> or{" "}
          <a href="/register">create an account</a> to view and update your
          profile.
        </p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-content">
        <div style={{ padding: "20px" }}>
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back
          </button>
        </div>

        <div className="containers">
          <div className="container-profile">
            <h1 className="profile-title">Profile</h1>

            <section className="profile-summary" style={{ marginBottom: 24 }}>
              <ul>
                <li><b>Name:</b> {user?.name}</li>
                <li><b>Surname:</b> {user?.surname}</li>
                <li><b>Cell:</b> {user?.cell}</li>
                <li><b>Email:</b> {user?.email}</li>
              </ul>

              <br />

              <Link className="edit-profile-btn" to="/profile/edit">
                Edit Profile
              </Link>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
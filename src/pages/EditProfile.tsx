import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { updateProfile, updateCredentials } from "../features/RegisterSlice";
import { updateUserProfile } from "../api/users";
import CryptoJS from "crypto-js";
import { Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.register.user);

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [cell, setCell] = useState(user?.cell ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credError, setCredError] = useState<string | null>(null);
  const [profSaved, setProfSaved] = useState(false);
  const [credSaved, setCredSaved] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ SAVE PROFILE
  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfSaved(false);

    if (!name || !surname || !cell || !email || !user?.id) return;

    try {
      // 🔹 Update backend
      await updateUserProfile(user.id, { name, surname, cell, email });

      // 🔹 Create updated user
      const updatedUser = {
        ...user,
        name,
        surname,
        cell,
        email,
      };

      // 🔹 Update Redux
      dispatch(updateProfile({ name, surname, cell, email }));

      // 🔥 Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfSaved(true);
      setTimeout(() => setProfSaved(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // ✅ SAVE PASSWORD + EMAIL
  const saveCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCredError(null);
    setCredSaved(false);

    const SECRET = (import.meta as any).env?.VITE_AUTH_SECRET ?? "dev-secret";

    const bytes = CryptoJS.AES.decrypt(user.passwordCipher, SECRET);
    const plain = bytes.toString(CryptoJS.enc.Utf8);

    if (plain !== currentPassword) {
      setCredError("Current password is incorrect");
      return;
    }

    if (newPassword.length < 6) {
      setCredError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredError("New passwords do not match");
      return;
    }

    const passwordCipher = CryptoJS.AES.encrypt(newPassword, SECRET).toString();

    // 🔹 Update Redux (EMAIL + PASSWORD)
    dispatch(
      updateCredentials({
        email: email,
        passwordCipher,
      }),
    );

    // 🔥 Create updated user
    const updatedUser = {
      ...user,
      email,
      passwordCipher,
    };

    // 🔥 Persist to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCredSaved(true);
  };

  return (
    <div>
      <Navbar />

      <div className="containers-edit">
        {/* ✅ PROFILE FORM */}
        <form className="login" onSubmit={saveProfile}>
          <h2 className="update">Edit Profile</h2>

          <label htmlFor="name">
            <b>Name</b>
          </label>
          <input
            className="input-login"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="surname">
            <b>Surname</b>
          </label>
          <input
            className="input-login"
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

          <label htmlFor="cell">
            <b>Cell number</b>
          </label>
          <input
            className="input-login"
            id="cell"
            type="tel"
            value={cell}
            onChange={(e) => setCell(e.target.value)}
            required
          />

          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            className="input-login"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="updateBtn" type="submit">
            Save profile
          </button>

          {profSaved && <p role="status">Profile updated</p>}
        </form>

        {/* ✅ PASSWORD FORM */}
        <form className="login" onSubmit={saveCredentials}>
          <h2 className="update">Update Password</h2>

          <label htmlFor="current">
            <b>Current password</b>
          </label>
          <input
            className="input-login"
            id="current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label htmlFor="new">
            <b>New password</b>
          </label>
          <input
            className="input-login"
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirm">
            <b>Confirm new password</b>
          </label>
          <input
            className="input-login"
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {credError && (
            <p role="alert" style={{ color: "red" }}>
              {credError}
            </p>
          )}

          <button className="updateBtn" type="submit">
            Update password
          </button>

          {credSaved && <p role="status">Password updated</p>}
        </form>
      </div>

      <Footer />
    </div>
  );
}

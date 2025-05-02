"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { updateEmail, updatePassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserData(currentUser.uid);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setBirthday(data.birthday || "");
        setGender(data.gender || "");
      }
      if (auth.currentUser) {
        setNewEmail(auth.currentUser.email || "");
      }
    } catch (error) {
      console.error("Error cargando datos del usuario:", error);
    }
  };

  const handleSaveInfo = async () => {
    if (!user) {
      console.error("No user authenticated.");
      return;
    }

    try {
      if (auth.currentUser) {
        if (newEmail && newEmail !== auth.currentUser.email) {
          await updateEmail(auth.currentUser, newEmail);
          await updateDoc(doc(db, "users", auth.currentUser.uid), { email: newEmail });
        }

        if (newPassword) {
          await updatePassword(auth.currentUser, newPassword);
        }

        await setDoc(doc(db, "users", auth.currentUser.uid), {
          displayName: auth.currentUser.displayName,
          email: newEmail || auth.currentUser.email,
          birthday,
          gender,
        });

        setSuccessMessage("Profile updated successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving profile:", error.message);
        setError(error.message);
      } else {
        console.error("An unknown error occurred.");
        setError("An unknown error occurred.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 mt-30 mb-15">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-zinc-800/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-700/50 shadow-lg text-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Welcome, {user?.displayName || "Gamer"}!
        </h1>

        <div className="flex flex-col gap-6">
          {/* Birthday */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-200"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* New Email */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={handleSaveInfo}
              disabled={!user}
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-full transition-all duration-300 ${
                !user ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Save Changes
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <p className="text-green-400 mt-4">{successMessage}</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

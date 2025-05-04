"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");

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
    if (!user || !auth.currentUser) return;

    const emailChanged = newEmail && newEmail !== auth.currentUser.email;
    const passwordChanged = !!newPassword;

    if (emailChanged || passwordChanged) {
      setShowReauthModal(true);
      return;
    }

    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        birthday,
        gender,
      });

      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to update profile.");
    }
  };

  const handleReauthentication = async () => {
    if (!auth.currentUser || !reauthPassword) return;

    try {
      if (!auth.currentUser.email) {
        setError("Missing email. Please re-login.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        reauthPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      if (newEmail && newEmail !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, newEmail);
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          email: newEmail,
        });
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

      setShowReauthModal(false);
      setReauthPassword("");
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error("Reauthentication failed:", error);
      setError("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      try {
        const snap = await getDocs(collection(db, "users", user.uid, "orders"));
        const formatted = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(formatted);
      } catch (error) {
        console.error("Error loading order history:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user]);

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
    <section className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 mt-30 mb-15 flex-col p-6">
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
          {/* birthday */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 text-gray-200"
            />
          </div>

          {/* gender */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 text-gray-200"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* email */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 text-gray-200"
            />
          </div>

          {/* password */}
          <div className="flex flex-col">
            <label className="mb-2 text-left text-gray-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 text-gray-200"
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveInfo}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-full mt-6 hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Save Changes
          </button>
        </div>

        {/* modal todo ok */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-green-500 shadow-xl max-w-sm text-center">
              <h2 className="text-xl font-bold mb-2 text-green-400">
                Success
              </h2>
              <p className="text-gray-300">Profile updated successfully.</p>
            </div>
          </div>
        )}

        {/* modal checkear contraseña */}
        {showReauthModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-2xl text-white w-full max-w-sm border border-purple-500">
              <h2 className="text-xl font-bold mb-4">Re-authenticate</h2>
              <p className="mb-4 text-gray-400 text-sm">
                Please enter your current password to confirm changes.
              </p>
              <input
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                placeholder="Current password"
                className="w-full p-2 rounded bg-zinc-800 text-white mb-4 border border-zinc-700"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReauthModal(false)}
                  className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReauthentication}
                  disabled={!reauthPassword}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* historial compras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl mt-10 mx-auto bg-zinc-800/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-700/50 shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Purchase History
        </h2>

        {ordersLoading ? (
          <div className="text-gray-400 text-center">Loading orders...</div>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-center">No purchases found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-zinc-800/70 border border-zinc-700/50 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    {new Date(order.date?.seconds * 1000).toLocaleDateString()}
                  </span>
                  <span className="text-pink-400 font-bold">
                    €{order.total.toFixed(2)}
                  </span>
                </div>
                <ul className="list-disc pl-5 text-gray-300 text-sm">
                  {order.items.map((item: any, i: number) => (
                    <li key={i}>{item.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

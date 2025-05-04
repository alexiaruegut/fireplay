"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import Link from "next/link";
import { addDoc, Timestamp } from "firebase/firestore";

interface CartItem {
  id: number;
  name: string;
  slug: string;
  background_image: string;
  price: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const cartRef = collection(db, "users", firebaseUser.uid, "cart");
        const cartSnap = await getDocs(cartRef);
        const items = cartSnap.docs.map((doc) => ({
          ...doc.data(),
          id: parseInt(doc.id),
        })) as CartItem[];
        setCartItems(items);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const removeFromCart = async (gameId: number) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "cart", gameId.toString());
    await deleteDoc(ref);
    setCartItems((prev) => prev.filter((item) => item.id !== gameId));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!user) return alert("Please log in to checkout");
    setShowModal(true);
  };

  const closeModal = async () => {
    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      const cartRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Items a guardar en orden:", items);

      if (items.length === 0) {
        console.warn("Carrito vacío, no se guarda orden.");
        setShowModal(false);
        return;
      }

      await addDoc(collection(db, "users", user.uid, "orders"), {
        items,
        total,
        date: Timestamp.now(),
      });

      const batch = writeBatch(db);
      snapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      setCartItems([]);
      setShowModal(false);
      console.log("Compra guardada con éxito.");
    } catch (error) {
      console.error("Error guardando la compra:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-zinc-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 p-8">
        <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-2xl text-center">
          <p className="text-gray-300 mb-4">
            You have to Sign In to see your cart.
          </p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 p-8">
        <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-2xl text-center">
          <p className="text-gray-300 mb-4">
            You don&apos;t have any games in your cart yet.
          </p>
          <Link
            href="/games"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition"
          >
            Explore Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col flex-1 bg-zinc-900 text-gray-100 p-8 mt-20">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center">
        Your Cart
      </h1>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4"
          >
            <Link
              href={`/game/${item.slug}`}
              className="flex items-center space-x-4"
            >
              <img
                src={item.background_image}
                alt={item.name}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-purple-300">€{item.price}</p>
              </div>
            </Link>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-700">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl text-pink-400 font-bold">€{total}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
        >
          Proceed to Checkout
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 to-pink-600 max-w-sm w-full shadow-xl">
              <div className="bg-zinc-900 text-white p-8 rounded-[14px] text-center">
                <h2 className="text-2xl font-bold mb-4">Purchase Completed!</h2>
                <p className="text-gray-300 mb-6">
                  Thanks for your order. Enjoy your games!
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:bg-purple-700 transition cursor-pointer hover:from-purple-700 hover:to-pink-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

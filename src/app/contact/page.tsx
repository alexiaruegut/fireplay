"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 mt-30 mb-15 flex-col p-6">
      <div className="w-full max-w-2xl bg-zinc-800/60 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-zinc-700">
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center">
          Contact Fireplay
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Got a question, issue or feedback? Reach out and we’ll get back to you
          as soon as possible.
        </p>

        {submitted && (
          <div className="bg-green-600/20 border border-green-500 text-green-300 p-4 rounded-xl text-center mb-6">
            Thank you! Your message has been sent.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Subject</label>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

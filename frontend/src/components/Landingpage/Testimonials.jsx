// client/src/components/Testimonials.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Jane M.",
    role: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "JobHub helped me land my dream role within weeks! The platform made job applications super easy and transparent.",
  },
  {
    id: 2,
    name: "Michael K.",
    role: "HR Manager, Fintech Group",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    text: "As an employer, I love how JobHub connects us with qualified candidates efficiently. It saves time and improves hiring quality.",
  },
  {
    id: 3,
    name: "Aisha O.",
    role: "Data Analyst",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    text: "The interface is smooth and the recommendations are spot on. JobHub really understands what job seekers need.",
  },
  {
    id: 4,
    name: "Kevin N.",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    text: "I used JobHub to track applications and communicate directly with recruiters. It’s an all-in-one solution!",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          What Our Users Say
        </h2>
        <p className="text-gray-600 mb-10">
          Real stories from job seekers and recruiters who trust JobHub
        </p>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[index].id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 mx-auto max-w-2xl"
            >
              <img
                src={testimonials[index].image}
                alt={testimonials[index].name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-md"
              />
              <p className="text-gray-700 italic mb-6">
                “{testimonials[index].text}”
              </p>
              <h3 className="text-lg font-semibold text-blue-700">
                {testimonials[index].name}
              </h3>
              <p className="text-sm text-gray-500">{testimonials[index].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

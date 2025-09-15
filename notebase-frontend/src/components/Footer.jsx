
// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="py-4 mt-8 text-center bg-slate-100 border-t">
      <small className="text-slate-500">
        © {new Date().getFullYear()} NoteBase - A Multi-tenant SaaS Demo
      </small>
    </footer>
  );
}


// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../api/api";

// A simple Icon component for visual flair
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for creating a note
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // State for editing a note
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // State for upgrading
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Function to show a success message that fades out
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    try {
      const storedUserJSON = localStorage.getItem("user");
      if (storedUserJSON) {
        const storedUser = JSON.parse(storedUserJSON);
        setUser(storedUser.user || null);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadNotes = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await authFetch("/notes");
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadNotes();
  }, [user, loadNotes]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) return setError("Title and content are required.");
    if (user?.tenant?.plan === "free" && notes.length >= 3) return setError("Free plan limit reached. Upgrade to Pro for unlimited notes.");

    setIsCreating(true);
    try {
      const newNote = await authFetch("/notes", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
      showSuccess("Note created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create note.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await authFetch(`/notes/${id}`, { method: "DELETE" });
      setNotes(notes.filter((n) => n._id !== id));
      showSuccess("Note deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete note.");
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedNote = await authFetch(`/notes/${editingNoteId}`, {
        method: "PUT",
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      setNotes(notes.map(n => n._id === editingNoteId ? updatedNote : n));
      cancelEditing();
      showSuccess("Note updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update note.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError("");
    try {
      const upgradedTenant = await authFetch(`/tenants/${user.tenant.slug}/upgrade`, { method: "POST" });
      const fullUserData = JSON.parse(localStorage.getItem("user"));
      const updatedFullUser = { ...fullUserData, user: { ...user, tenant: upgradedTenant } };
      localStorage.setItem("user", JSON.stringify(updatedFullUser));
      setUser(updatedFullUser.user);
      showSuccess(`Tenant "${upgradedTenant.name}" upgraded to PRO!`);
    } catch (err) {
      setError(err.message || "Upgrade failed.");
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!user) return <div className="text-center p-10">Loading...</div>;

  const isFreePlan = user.tenant.plan.toLowerCase() === 'free';
  const notesUsed = notes.length;
  const progress = isFreePlan ? Math.min((notesUsed / 3) * 100, 100) : 100;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* SUCCESS & ERROR TOASTS */}
        {success && <div className="fixed top-5 right-5 z-50 p-4 text-sm text-green-800 bg-green-100 rounded-lg shadow-lg animate-fade-in-down">{success}</div>}
        {error && <div className="fixed top-5 right-5 z-50 p-4 text-sm text-red-800 bg-red-100 rounded-lg shadow-lg animate-fade-in-down">{error}</div>}

        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">My Notes</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome, <span className="font-semibold">{user.fullName}</span> at <strong className="font-semibold text-slate-600">{user.tenant.name}</strong>
            </p>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div>
              <p className="font-semibold text-slate-700">Plan: <span className="capitalize">{user.tenant.plan}</span></p>
              <div className="w-32 h-2 mt-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full transition-all duration-500 ${isFreePlan ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">{isFreePlan ? `${notesUsed} / 3 notes used` : "Unlimited notes"}</p>
            </div>
            {user.role.toLowerCase() === 'admin' && isFreePlan && (
              <button onClick={handleUpgrade} disabled={isUpgrading} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-slate-400 transition-colors flex items-center gap-2">
                <Icon path="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" className="w-4 h-4" />
                {isUpgrading ? "Upgrading..." : "Upgrade"}
              </button>
            )}
          </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CREATE NOTE */}
          <aside className="lg:col-span-1">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm sticky top-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                Create a New Note
              </h3>
              <form onSubmit={handleCreateNote} className="mt-6 space-y-4">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note Title" className="w-full px-4 py-2 text-slate-700 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"/>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your thoughts here..." rows="5" className="w-full px-4 py-2 text-slate-700 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"/>
                <button type="submit" disabled={isCreating} className="w-full px-5 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2">
                  <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5"/>
                  {isCreating ? "Saving..." : "Add Note"}
                </button>
              </form>
            </div>
          </aside>

          {/* RIGHT COLUMN: NOTES LIST */}
          <main className="lg:col-span-2">
            {loading ? <div className="text-center py-10 text-slate-500">Loading notes...</div> : 
             notes.length === 0 ? 
              <div className="flex flex-col items-center justify-center h-full p-10 text-center bg-white border-2 border-dashed border-slate-300 rounded-xl">
                <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-16 h-16 text-slate-300 mb-4"/>
                <h4 className="text-xl font-bold text-slate-700">No Notes Yet</h4>
                <p className="text-slate-500">Create your first note using the form on the left.</p>
              </div> :
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {notes.map((note) => (
                  editingNoteId === note._id ? (
                    // EDITING STATE
                    <form key={note._id} onSubmit={handleUpdateNote} className="p-5 bg-white border border-indigo-300 rounded-xl shadow-lg ring-2 ring-indigo-200 animate-fade-in space-y-3">
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-1.5 text-lg font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                      <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows="4" className="w-full px-3 py-1.5 text-slate-600 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                      <div className="flex items-center gap-2 pt-2">
                        <button type="submit" disabled={isUpdating} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-slate-400">
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={cancelEditing} className="px-3 py-1 text-sm font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // DEFAULT DISPLAY STATE
                    <article key={note._id} className="flex flex-col p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex-grow">
                        <h4 className="mb-2 text-lg font-bold text-slate-800">{note.title}</h4>
                        <p className="text-slate-600 whitespace-pre-wrap break-words">{note.content}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                        <small className="text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</small>
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEditing(note)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" className="w-4 h-4"/></button>
                          <button onClick={() => handleDeleteNote(note._id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </article>
                  )
                ))}
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { getUserClips, deleteClip, updateClip } from "../services/api";
import { Copy, Terminal, Search, Trash2, Edit2, Save, X, Loader2, Clock, Download, FileText, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard({ user }) {
  const [clips, setClips] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [viewingClip, setViewingClip] = useState(null);

  useEffect(() => {
    if (user?.username) {
      setLoading(true);
      getUserClips(user.username, page, pageSize)
        .then((data) => {
          setClips(data.sort((a, b) => b.id - a.id));
        })
        .catch(() => toast.error("Failed to load clips"))
        .finally(() => setLoading(false));
    }
  }, [user, page]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

 const isBase64File = (content) => {
    return content && content.startsWith("FILE_URL:");
  };

const downloadFile = async (content, code = "file") => {
    let url = content.replace("FILE_URL:", "");
    let ext = "";
    
    // 1. Extract the extension we saved in the backend
    if (url.includes("|")) {
        const parts = url.split("|");
        ext = parts[0]; // e.g., ".pdf"
        url = parts[1]; // e.g., "https://res.cloudinary..."
    }

    const loadingToast = toast.loading("Downloading file...");

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      if (!ext) {
          const mimeType = blob.type.toLowerCase();
          if (mimeType.includes("zip") || mimeType.includes("compressed")) ext = ".zip";
          else if (mimeType.includes("pdf")) ext = ".pdf";
          else if (mimeType.includes("png")) ext = ".png";
          else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
      }

      // 2. Force an invisible background download with the perfect filename
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = `clip-${code}${ext}`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      toast.success("Download complete!", { id: loadingToast });

    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Opening in new tab...", { id: loadingToast });
      window.open(url, "_blank");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this clip?")) return;
    const previousClips = [...clips];
    setClips(clips.filter(c => c.id !== id));
    try {
      await deleteClip(id);
      toast.success("Clip deleted");
    } catch (err) {
      setClips(previousClips);
      toast.error("Failed to delete");
    }
  };

  const startEdit = (clip) => {
    if (isBase64File(clip.content)) {
      toast.error("Cannot edit binary files directly.");
      return;
    }
    setEditingId(clip.id);
    setEditContent(clip.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = async (id) => {
    if (!editContent.trim()) return;
    setActionLoading(true);
    try {
      await updateClip(id, editContent);
      setClips(clips.map(c => c.id === id ? { ...c, content: editContent } : c));
      setEditingId(null);
      toast.success("Clip updated");
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredClips = clips.filter(
    (clip) =>
      clip.content.toLowerCase().includes(filter.toLowerCase()) ||
      clip.code.includes(filter)
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Explicitly parse as UTC by adding Z if missing
    let dateToParse = dateString;
    if (typeof dateString === 'string' && !dateString.includes('Z') && !dateString.includes('+')) {
      dateToParse = dateString.replace(' ', 'T') + 'Z';
    }

    return new Date(dateToParse).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="px-4 md:px-20 mx-auto py-8 md:py-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-gray-400" />
            Clip History
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your synced content.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Filter current page..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#141416] text-gray-300 pl-9 pr-4 py-2 rounded text-sm focus:ring-1 focus:ring-gray-600 outline-none placeholder-gray-600"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-[#141416] rounded-md overflow-hidden bg-[#0A0A0A] shadow-sm mb-6">
        <div className="grid grid-cols-12 border-b border-[#141416] bg-[#111] py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3 md:col-span-2">Code</div>
          <div className="col-span-6 md:col-span-6">Content</div>
          <div className="hidden md:block md:col-span-2">Created</div>
          <div className="col-span-3 md:col-span-2 text-right">Actions</div>
        </div>

        {loading && <div className="p-8 text-center text-gray-500 text-sm font-mono animate-pulse">Loading streams...</div>}
        {!loading && filteredClips.length === 0 && <div className="p-12 text-center"><p className="text-gray-500 text-sm">No clips found on this page.</p></div>}

        <div className="divide-y divide-gray-800/50">
          {filteredClips.map((clip) => (
            <div key={clip.id} className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#161616] transition-colors group text-sm font-mono">
              {/* Code */}
              <div className="col-span-3 md:col-span-2 flex items-center gap-2"><span className="text-white font-bold">#{clip.code}</span></div>
              {/* Content */}
              <div className="col-span-6 md:col-span-6 pr-4">
                {editingId === clip.id ? (
                  <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} autoFocus className="w-full bg-[#111] border border-blue-500/50 text-white px-2 py-1 rounded outline-none" onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(clip.id); if (e.key === 'Escape') cancelEdit(); }} />
                ) : (
                  isBase64File(clip.content) ? (
                    <div className="flex items-center gap-2 text-blue-400"><FileText className="w-4 h-4 shrink-0" /><span className="italic truncate">{clip.fileName || "File"}</span></div>
                  ) : (
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                      {clip.content.length > 60 ? `${clip.content.substring(0, 60)}...` : clip.content}
                    </p>
                  )
                )}
              </div>
              {/* Created */}
              <div className="hidden md:flex md:col-span-2 items-center gap-2 text-xs text-gray-500"><Clock className="w-3 h-3" />{formatDate(clip.createdAt)}</div>
              {/* Actions */}
              <div className="col-span-3 md:col-span-2 flex justify-end gap-1 md:gap-2">
                {editingId === clip.id ? (
                  <>
                    <button onClick={() => saveEdit(clip.id)} disabled={actionLoading} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded">{actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}</button>
                    <button onClick={cancelEdit} disabled={actionLoading} className="p-1.5 text-gray-500 hover:bg-gray-800 rounded"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <div className="flex gap-1">
                    {!isBase64File(clip.content) && (
                      <button
                        onClick={() => setViewingClip(clip)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {isBase64File(clip.content) ? (
                      <button onClick={() => downloadFile(clip.content, clip.code)} className="p-1.5 text-purple-500 hover:text-white hover:bg-purple-500/20 rounded"><Download className="w-4 h-4" /></button>
                    ) : (
                      <button onClick={() => copyToClipboard(clip.content)} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors"><Copy className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => startEdit(clip)} className="p-1.5 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(clip.id)} className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-[#141416] pt-4">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0 || loading}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded hover:bg-[#1A1A1A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-xs font-mono text-gray-600">Page {page + 1}</span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={clips.length < pageSize || loading}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded hover:bg-[#1A1A1A] transition-colors"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewingClip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingClip(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#141416] rounded-lg shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#141416]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
                    <Terminal className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold">Clip Details</h2>
                    <p className="text-blue-500 text-xs font-mono font-bold">#{viewingClip.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingClip(null)}
                  className="p-2 text-gray-500 hover:text-white hover:bg-[#1A1A1A] rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto mb-6 bg-[#050505] rounded-md p-4 border border-[#111]">
                <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap break-words">
                  {viewingClip.content}
                </pre>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setViewingClip(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-white font-bold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { copyToClipboard(viewingClip.content); setViewingClip(null); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 

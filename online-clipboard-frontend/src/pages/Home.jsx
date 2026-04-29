import { useState, useRef , useEffect} from "react";
import { Copy, FileUp, Terminal, Save, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClip, getClipByCode } from "../services/api";
import { queueClip } from "../services/OfflineSync";
import Features from "../components/Features";
import JSZip from "jszip"; 
import TerminalLoader from "../components/TerminalLoader";
import { Globe, Check } from "lucide-react"; 


const TerminalWindow = ({ title, children, color = "gray" }) => (
  <div className="bg-[#0A0A0A] border border-[#141416] rounded-md shadow-2xl flex flex-col h-full overflow-hidden transition-colors group">
    <div className="bg-[#111] border-b border-[#141416] p-3 flex items-center justify-between">
      <div className="flex gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] opacity-75 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className={`text-xs font-bold tracking-wide uppercase text-${color}-500 opacity-90`}>
        {title}
      </div>
      <div className="w-8" />
    </div>
    <div className="p-5 flex-1 flex flex-col font-mono text-sm relative">
      {children}
    </div>
  </div>
);

export default function Home({ user }) {
  const [textInput, setTextInput] = useState("");
  const [retrieveCode, setRetrieveCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [retrievedClip, setRetrievedClip] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [visible, setVisible] = useState(false);
  

  const handleTextUpload = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const data = await createClip(textInput, user?.username , visible);
      setGeneratedCode(data.code);
      setTextInput("");
      toast.success("Clip saved successfully!");
    } catch (err) {
      const isNetworkError = !navigator.onLine || err.name === "TypeError" || err.message.toLowerCase().includes("fetch");
      if (isNetworkError) {
        await queueClip(textInput, user?.username, visible);
        setTextInput("");
      } else {
        toast.error("Failed to save clip.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // A. SINGLE FILE
    if (files.length === 1) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large (Max 10MB).");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target.result;
        setLoading(true);
        try {
          const data = await createClip(content, user?.username, visible , file.name);
          setGeneratedCode(data.code);
          toast.success(`File "${file.name}" uploaded!`);
        } catch (err) {
          const isNetworkError = !navigator.onLine || err.name === "TypeError" || err.message.toLowerCase().includes("fetch");
          if (isNetworkError) {
            await queueClip(content, user?.username, visible  , file.name);
          } else {
            toast.error("Upload failed.");
          }
        } finally {
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // B. MULTIPLE FILES (Group Upload)
    setLoading(true);
    const zip = new JSZip();
    let totalSize = 0;

    Array.from(files).forEach((file) => {
      totalSize += file.size;
      zip.file(file.name, file);
    });

    if (totalSize > 10 * 1024 * 1024) {
      setLoading(false);
      return toast.error("Total group size too large (Max 10MB).");
    }

    try {
      const contentBlob = await zip.generateAsync({ type: "blob" });
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64String = event.target.result;
          const data = await createClip(base64String, user?.username, visible , "Archive.zip");
          setGeneratedCode(data.code);
          toast.success(`${files.length} files zipped & uploaded!`);
        } catch (err) {
          const isNetworkError = !navigator.onLine || err.name === "TypeError" || err.message.toLowerCase().includes("fetch");
          if (isNetworkError) {
            await queueClip(base64String, user?.username, visible , "Archive.zip");
          } else {
            toast.error("Upload failed.");
          }
        } finally {
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(contentBlob);
    } catch (err) {
      console.error(err);
      toast.error("Failed to zip files.");
      setLoading(false);
    }
  };



  const handleRetrieve = async (e) => {
    e.preventDefault();
    if (retrieveCode.length < 5) return toast.warning("Code must be 5 digits.");
    setLoading(true);
    setRetrievedClip(null);
    try {
      const data = await getClipByCode(retrieveCode);
      setRetrievedClip(data);
      toast.success("Content retrieved!");
    } catch (err) {
      toast.error("Clip not found or expired.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
      a.download = customFileName || `clip-${code}${ext}`;

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


  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-20 font-sans">
      <div className="mb-12 border-l-4 border-blue-400 pl-6 py-2">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Terminal className="w-8 h-8 text-blue-500" />
          Online Clipboard
        </h1>
        <p className="text-gray-400 text-base max-w-2xl">
          Easily move text and files between your devices. <br/>
          Paste on one device, get a code, and enter it on another.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* COL 1: PASTE TEXT */}
        <TerminalWindow title="1. Paste Text" color="blue">
          <div className="text-gray-400 text-xs mb-4 flex items-center gap-2">
            <span className="text-blue-500 font-bold">Option A:</span> Paste your text data.
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full flex-1 bg-[#111] border border-[#141416] text-gray-200 p-3 rounded focus:border-blue-500/50 outline-none resize-none text-sm placeholder-gray-600 mb-4"
            placeholder="Type or paste your content here..."
          />
          <div 
            onClick={() => setVisible(!visible)}
            className="flex items-center gap-2 mb-4 cursor-pointer group"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${visible ? "bg-blue-500 border-blue-500" : "border-gray-600 bg-transparent group-hover:border-blue-400"}`}>
              {visible && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs ${visible ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}>
              Make Public (Visible on Community Feed)
            </span>
          </div>
          <button onClick={handleTextUpload} disabled={loading || !textInput} className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#333] hover:border-white text-white py-3 rounded text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer">
            {loading ? "Saving..." : <> <Save className="w-4 h-4" /> Save Clip </>}
          </button>
        </TerminalWindow>

        {/* COL 2: UPLOAD FILE */}
        <TerminalWindow title="2. Upload File" color="purple">
          <div className="text-gray-400 text-xs mb-4 flex items-center gap-2">
            <span className="text-purple-500 font-bold">Option B:</span> Upload files (Max 10MB).
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {/* ADDED 'multiple' HERE */}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
            
            <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-[#333] hover:border-purple-500/50 bg-[#111] rounded h-full min-h-[150px] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden">
              <FileUp className="w-10 h-10 text-gray-600 group-hover:text-purple-400 mb-3 transition-colors" />
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider group-hover:text-purple-300">Click to Select Files</span>
            </div>
               <div 
            onClick={() => setVisible(!visible)}
            className="flex items-center gap-2 mt-4 cursor-pointer group"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${visible ? "bg-blue-500 border-blue-500" : "border-gray-600 bg-transparent group-hover:border-blue-400"}`}>
              {visible && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs ${visible ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}>
              Make Public (Visible on Community Feed)
            </span>
          </div>
          </div>
          <div className="mt-4 text-center text-[10px] text-gray-500">Supports: Single Files or Groups (Auto-Zip)</div>
        </TerminalWindow>

        {/* COL 3: RETRIEVE */}
        <TerminalWindow title="3. Retrieve" color="emerald">
          <div className="text-gray-400 text-xs mb-4 flex items-center gap-2">
            <span className="text-emerald-500 font-bold">Action:</span> Have a code? Enter it.
          </div>
          <div className="flex gap-2 mb-4">
            <input type="text" value={retrieveCode} onChange={(e) => setRetrieveCode(e.target.value)} maxLength={5} placeholder="Ex: 12345" className="w-full bg-[#111] border border-[#141416] text-white p-3 rounded focus:border-emerald-500/50 outline-none text-lg text-center font-bold tracking-widest placeholder-gray-700" />
          </div>
          <button onClick={handleRetrieve} disabled={loading || retrieveCode.length < 5} className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#333] cursor-pointer hover:border-white text-white py-3 rounded text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 mb-4">
            {loading ? "Searching..." : <> <Download className="w-4 h-4" /> Get Content </>}
          </button>

          <div className="flex-1 bg-[#050505] border border-[#141416] rounded p-3 relative overflow-hidden group">
            {retrievedClip ? (
              <>
                <div className="text-xs text-emerald-500 font-bold mb-2 flex items-center gap-1">
                   <FileText className="w-3 h-3" /> Content Found:
                </div>
              
                {isBase64File(retrievedClip.content) ? (
                   <div className="h-full flex flex-col items-center justify-center">
                     <p className="text-gray-400 text-xs mb-3 italic">Binary File Detected</p>
                     <button 
                      onClick={() => downloadFile(retrievedClip.content, retrievedClip.code)}
                       className="bg-[#111] border border-[#333] hover:border-emerald-500 text-white px-4 py-2 rounded text-xs flex items-center gap-2 transition"
                     >
                       <Download className="w-4 h-4" /> Download File
                     </button>
                   </div>
                ) : (
                  <>
                    <button onClick={() => copyToClipboard(retrievedClip.content)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white bg-[#111] border border-[#222] rounded hover:border-gray-500 transition opacity-0 group-hover:opacity-100" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all h-full overflow-y-auto max-h-[120px] custom-scrollbar font-mono">
                      {retrievedClip.content}
                    </pre>
                  </>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs text-center px-4">
                <span>Content will appear here...</span>
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>

      <Features />

      <AnimatePresence>
        {loading && <TerminalLoader message="TRANSMITTING" />}
        {generatedCode && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed bottom-8 right-8 z-50">
            <div className="bg-[#0A0A0A] border border-[#141416] rounded-md shadow-2xl w-80 overflow-hidden">
              <div className="bg-emerald-900/20 border-b border-emerald-900/30 p-3 px-4 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Success!
                </span>
                <button onClick={() => setGeneratedCode(null)} className="text-emerald-700 hover:text-emerald-400">✕</button>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-400 text-sm mb-3">Your Pickup Code:</p>
                <div onClick={() => copyToClipboard(generatedCode)} className="bg-black border border-[#141416] p-4 rounded cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-900/10 transition group">
                  <span className="text-4xl font-mono font-bold text-white tracking-widest group-hover:scale-110 inline-block transition-transform">{generatedCode}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-3">Click the code to copy it</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useRef, useState, useEffect } from "react";
import { baseUrl } from "../../Config/Config";
import "./RichTextEditor.css";
import UploadFile from "../Models/UploadFile";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function RichTextEditor({ onChange, data }) {
  const editorRef = useRef(null);
  const savedSelection = useRef(null);

  const [htmlPreview, setHtmlPreview] = useState(data || "");

  // 🔗 Link modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // 🖼️ Image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [uploadedPath, setUploadedPath] = useState("");
  const [altText, setAltText] = useState("");

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    heading: "p",
    unorderedList: false,
    orderedList: false,
  });

 useEffect(() => {
  if (editorRef.current && data && editorRef.current.innerHTML !== data) {
    editorRef.current.innerHTML = data;
    setHtmlPreview(data);
  }
}, [data]);


  // 🧠 Selection save/restore
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) savedSelection.current = sel.getRangeAt(0);
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      if (!editor.contains(window.getSelection().anchorNode)) return;
      const newState = {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        unorderedList: document.queryCommandState("insertUnorderedList"),
        orderedList: document.queryCommandState("insertOrderedList"),
        heading: getCurrentBlockTag(),
      };
      setActiveFormats(newState);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    editor.addEventListener("click", handleImageClick);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      editor.removeEventListener("click", handleImageClick);
    };
  }, []);

  const getCurrentBlockTag = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return "p";
    let node = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (/^(P|H1|H2|H3)$/i.test(node.nodeName)) return node.nodeName.toLowerCase();
      node = node.parentNode;
    }
    return "p";
  };

  const handleImageClick = (e) => {
    if (e.target.tagName === "IMG") {
      const currentAlt = e.target.alt || "";
      const newAlt = prompt("Edit alternative text:", currentAlt);
      if (newAlt !== null) {
        e.target.alt = newAlt;
        triggerChange();
      }
    }
  };

  const triggerChange = () => {
    const html = editorRef.current?.innerHTML || "";
    setHtmlPreview(html);
    onChange?.(html); 
  };

  const doExec = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    triggerChange();
  };

  const formatAsParagraph = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand("formatBlock", false, "p");

    const childNodes = Array.from(editor.childNodes);
    childNodes.forEach((node) => {
      if (node.nodeType === 1 && ["DIV", "SPAN"].includes(node.nodeName)) {
        const p = document.createElement("p");
        p.innerHTML = node.innerHTML;
        editor.replaceChild(p, node);
      }
    });
    triggerChange();
  };
  const openLinkDialog = () => {
    saveSelection();
    const selection = window.getSelection().toString();
    setLinkText(selection || "");
    setLinkUrl("");
    setLinkModalOpen(true);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return alert("Please enter a valid URL.");
    const url = linkUrl.trim();
    const text = linkText.trim() || linkUrl.trim();
    const html = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

    restoreSelection();
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    triggerChange();
    setLinkModalOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  // 🖼️ Open/Insert image
  const openImageDialog = () => {
    saveSelection();
    setUploadedPath("");
    setAltText("");
    setImageModalOpen(true);
  };

  const insertImage = () => {
    if (!uploadedPath) return alert("Please upload an image first.");
    const fullUrl = uploadedPath.startsWith("http")
      ? uploadedPath
      : `${baseUrl}${uploadedPath}`;
    const html = `<img src="${fullUrl}" alt="${altText || ""}" />`;

    restoreSelection();
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    triggerChange();
    setImageModalOpen(false);
    setUploadedPath("");
    setAltText("");
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    let cleanHTML = html || text;
    if (html) {
      cleanHTML = cleanHTML
        .replace(/<!--.*?-->/gi, "")
        .replace(/<(\/?)span[^>]*>/gi, "")
        .replace(/<(\/?)font[^>]*>/gi, "")
        .replace(/<(meta|link|style|script)[^>]*>.*?<\/\1>/gi, "")
        .replace(/<(\/?)(o|w):[^>]*>/gi, "")
        .replace(/ style="[^"]*"/gi, "")
        .replace(/ class="[^"]*"/gi, "")
        .replace(/\s*mso-[^:]+:[^;"]+;?/gi, "")
        .replace(/<p>(\s|&nbsp;)*<\/p>/gi, "");
    }
    document.execCommand("insertHTML", false, cleanHTML);
    triggerChange();
  };

  return (
    <div className="rte-container">
      {/* 🧰 Toolbar */}
      <div className="rte-toolbar">
        <button className={activeFormats.bold ? "active" : ""} onClick={() => doExec("bold")}>
          <strong>B</strong>
        </button>
        <button className={activeFormats.italic ? "active" : ""} onClick={() => doExec("italic")}>
          <em>I</em>
        </button>
        <button className={activeFormats.heading === "p" ? "active" : ""} onClick={formatAsParagraph}>
          P
        </button>
        <button className={activeFormats.heading === "h1" ? "active" : ""} onClick={() => doExec("formatBlock", "<h1>")}>
          H1
        </button>
        <button className={activeFormats.heading === "h2" ? "active" : ""} onClick={() => doExec("formatBlock", "<h2>")}>
          H2
        </button>
        <button className={activeFormats.heading === "h3" ? "active" : ""} onClick={() => doExec("formatBlock", "<h3>")}>
          H3
        </button>
        <button className={activeFormats.unorderedList ? "active" : ""} onClick={() => doExec("insertUnorderedList")}>
          • List
        </button>
        <button className={activeFormats.orderedList ? "active" : ""} onClick={() => doExec("insertOrderedList")}>
          1. List
        </button>
        <button onClick={openLinkDialog}>🔗 Link</button>
        <button onClick={openImageDialog}>🖼️ Image</button>
      </div>

      {/* 📝 Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerChange}
        onPaste={handlePaste}
        className="rte-editor"
>
  <p>Start writing here...</p>
</div>

      {/* 🔍 HTML output */}
      <div className="rte-output">
        <label>HTML Output</label>
        <textarea readOnly value={htmlPreview} rows={6} />
      </div>

      {/* 🔗 Link Dialog */}
      <Dialog open={linkModalOpen} onClose={() => setLinkModalOpen(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
          <TextField label="Display Text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Example text" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          <Button onClick={insertLink} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🖼️ Image Dialog */}
      <Dialog open={imageModalOpen} onClose={() => setImageModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <UploadFile endpoint="/upload-image" fieldName="image" accept="image/*" onUploadComplete={(path) => setUploadedPath(path)} />
          <TextField label="Alt Text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe this image" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageModalOpen(false)}>Cancel</Button>
          <Button onClick={insertImage} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

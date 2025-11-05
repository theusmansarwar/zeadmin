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
  Box,
} from "@mui/material";

export default function RichTextEditor({ onChange }) {
  const editorRef = useRef(null);
  const [htmlPreview, setHtmlPreview] = useState("");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // ✅ Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [uploadedPath, setUploadedPath] = useState("");
  const [altText, setAltText] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.addEventListener("click", handleImageClick);
    return () => editor.removeEventListener("click", handleImageClick);
  }, []);

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
    document.execCommand(command, false, value);
    triggerChange();
  };

  const setHeading = (level) => {
    document.execCommand("formatBlock", false, level === 0 ? "p" : `h${level}`);
    triggerChange();
  };

  // 🔗 Open link modal
  const openLinkDialog = () => {
    const selection = window.getSelection().toString();
    setLinkText(selection || "");
    setLinkUrl("");
    setLinkModalOpen(true);
  };

  // 🔗 Insert link
  const insertLink = () => {
    if (!linkUrl.trim()) return alert("Please enter a valid URL.");

    const url = linkUrl.trim();
    const text = linkText.trim() || linkUrl.trim();
    const html = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

    document.execCommand("insertHTML", false, html);
    triggerChange();
    setLinkModalOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  // 🖼️ Open image modal
  const openImageDialog = () => {
    setUploadedPath("");
    setAltText("");
    setImageModalOpen(true);
  };

  // 🖼️ Insert image into editor
  const insertImage = () => {
    if (!uploadedPath) return alert("Please upload an image first.");
    const fullUrl = uploadedPath.startsWith("http")
      ? uploadedPath
      : `${baseUrl}${uploadedPath}`;

    const html = `<img src="${fullUrl}" alt="${altText || ""}" />`;
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
      <div className="rte-toolbar">
        <button onClick={() => doExec("bold")}>
          <strong>B</strong>
        </button>
        <button onClick={() => doExec("italic")}>
          <em>I</em>
        </button>

        <select onChange={(e) => setHeading(Number(e.target.value))} defaultValue="">
          <option value="0">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
        </select>

        <button onClick={() => doExec("insertUnorderedList")}>• List</button>
        <button onClick={() => doExec("insertOrderedList")}>1. List</button>
        <button onClick={openLinkDialog}>🔗 Link</button>

        <button onClick={openImageDialog}>🖼️ Image</button>
      </div>

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

      <div className="rte-output">
        <label>HTML Output</label>
        <textarea readOnly value={htmlPreview} rows={6} />
      </div>

      {/* 🔗 Link Dialog */}
      <Dialog open={linkModalOpen} onClose={() => setLinkModalOpen(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="URL"
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <TextField
            label="Display Text"
            variant="outlined"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Example text"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          <Button onClick={insertLink} variant="contained">
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🖼️ Image Upload Dialog */}
      <Dialog open={imageModalOpen} onClose={() => setImageModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <UploadFile
            endpoint="/upload-image"
            fieldName="image"
            accept="image/*"
            onUploadComplete={(path) => setUploadedPath(path)}
          />

          {uploadedPath && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <img
                src={uploadedPath.startsWith("http") ? uploadedPath : `${baseUrl}${uploadedPath}`}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </Box>
          )}

          <TextField
            label="Alt Text"
            variant="outlined"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image"
          />
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

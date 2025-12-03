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

  // 📊 Table modal
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState("3");
  const [tableCols, setTableCols] = useState("3");

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    heading: "p",
    unorderedList: false,
    orderedList: false,
  });

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const isFocused = document.activeElement === editor;
    if (isFocused) return;

    if (data && editor.innerHTML !== data) {
      editor.innerHTML = data;
      setHtmlPreview(data);
    }
  }, [data]);

  // 🧠 Save/restore selection
  const saveSelection = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus(); // ensure selection is inside editor
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
    editor.addEventListener("contextmenu", handleTableContextMenu);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      editor.removeEventListener("click", handleImageClick);
      editor.removeEventListener("contextmenu", handleTableContextMenu);
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

  const handleTableContextMenu = (e) => {
    const target = e.target;
    
    // Check if click is on table cell
    if (target.tagName === "TD" || target.tagName === "TH") {
      e.preventDefault();
      
      const action = prompt(
        "Table actions:\n" +
        "1 - Add row above\n" +
        "2 - Add row below\n" +
        "3 - Delete row\n" +
        "4 - Add column left\n" +
        "5 - Add column right\n" +
        "6 - Delete column\n" +
        "7 - Delete table"
      );
      
      const table = target.closest("table");
      const row = target.closest("tr");
      const cellIndex = Array.from(row.cells).indexOf(target);
      
      switch (action) {
        case "1":
          addRowAbove(table, row);
          break;
        case "2":
          addRowBelow(table, row);
          break;
        case "3":
          deleteRow(table, row);
          break;
        case "4":
          addColumnLeft(table, cellIndex);
          break;
        case "5":
          addColumnRight(table, cellIndex);
          break;
        case "6":
          deleteColumn(table, cellIndex);
          break;
        case "7":
          if (window.confirm("Delete entire table?")) {
            table.remove();
            triggerChange();
          }
          break;
      }
    }
  };

  const addRowAbove = (table, currentRow) => {
    const newRow = document.createElement("tr");
    const cellCount = currentRow.cells.length;
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("td");
      cell.textContent = " ";
      newRow.appendChild(cell);
    }
    currentRow.parentNode.insertBefore(newRow, currentRow);
    triggerChange();
  };

  const addRowBelow = (table, currentRow) => {
    const newRow = document.createElement("tr");
    const cellCount = currentRow.cells.length;
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("td");
      cell.textContent = " ";
      newRow.appendChild(cell);
    }
    currentRow.parentNode.insertBefore(newRow, currentRow.nextSibling);
    triggerChange();
  };

  const deleteRow = (table, row) => {
    if (table.rows.length > 1) {
      row.remove();
      triggerChange();
    } else {
      alert("Cannot delete the last row.");
    }
  };

  const addColumnLeft = (table, cellIndex) => {
    Array.from(table.rows).forEach((row) => {
      const newCell = document.createElement(row.cells[cellIndex].tagName);
      newCell.textContent = " ";
      row.insertBefore(newCell, row.cells[cellIndex]);
    });
    triggerChange();
  };

  const addColumnRight = (table, cellIndex) => {
    Array.from(table.rows).forEach((row) => {
      const newCell = document.createElement(row.cells[cellIndex].tagName);
      newCell.textContent = " ";
      row.insertBefore(newCell, row.cells[cellIndex].nextSibling);
    });
    triggerChange();
  };

  const deleteColumn = (table, cellIndex) => {
    if (table.rows[0].cells.length > 1) {
      Array.from(table.rows).forEach((row) => {
        row.deleteCell(cellIndex);
      });
      triggerChange();
    } else {
      alert("Cannot delete the last column.");
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

  const fixListWrapping = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const lists = editor.querySelectorAll("ul, ol");

    lists.forEach((list) => {
      const children = [...list.childNodes];

      children.forEach((node) => {
        // If a paragraph exists directly in a UL/OL — convert it to LI
        if (node.nodeName === "P") {
          const li = document.createElement("li");
          li.innerHTML = node.innerHTML;
          list.replaceChild(li, node);
        }

        // If text node exists directly inside UL/OL — wrap it
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
          const li = document.createElement("li");
          li.textContent = node.textContent;
          list.replaceChild(li, node);
        }
      });
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

  const openTableDialog = () => {
    saveSelection();
    setTableRows("3");
    setTableCols("3");
    setTableModalOpen(true);
  };

  const insertTable = () => {
    const rows = parseInt(tableRows, 10);
    const cols = parseInt(tableCols, 10);

    if (rows < 1 || cols < 1 || rows > 20 || cols > 20) {
      return alert("Please enter valid dimensions (1-20).");
    }

    // Create table element
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    // Create header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const th = document.createElement("th");
      th.style.border = "1px solid #ddd";
      th.style.padding = "8px";
      th.textContent = "Header";
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement("tbody");
    for (let i = 0; i < rows - 1; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < cols; j++) {
        const td = document.createElement("td");
        td.style.border = "1px solid #ddd";
        td.style.padding = "8px";
        td.textContent = "Cell";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    // Insert table directly into the editor
    restoreSelection();
    const editor = editorRef.current;
    if (!editor) return;
    
    editor.focus();
    
    const sel = window.getSelection();
    const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    
    if (range) {
      range.deleteContents();
      
      // Insert table
      range.insertNode(table);
      
      // Add a paragraph after the table for continued editing
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      table.parentNode.insertBefore(p, table.nextSibling);
      
      // Move cursor to the new paragraph
      range.setStart(p, 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    triggerChange();
    setTableModalOpen(false);
  };

 const handlePaste = (e) => {
  e.preventDefault();

  const html = e.clipboardData.getData("text/html");
  const text = e.clipboardData.getData("text/plain");

  // ✅ If plain text only → detect table
  if (text && !html) {
    const lines = text.trim().split("\n").filter(line => line.trim());

    const hasTabsOrSpaces = lines.some(line =>
      line.includes("\t") || /\s{2,}/.test(line)
    );

    if (hasTabsOrSpaces && lines.length > 1) {
      const table = document.createElement("table");
      table.setAttribute("border", "1");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";

      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      lines.forEach((line, index) => {
        const tr = document.createElement("tr");

        let cells = line.split("\t");
        if (cells.length === 1) {
          cells = line.split(/\s{2,}/);
        }

        cells.forEach(cellText => {
          const cell = document.createElement(index === 0 ? "th" : "td");
          cell.style.border = "1px solid #ddd";
          cell.style.padding = "8px";
          cell.textContent = cellText.trim();
          tr.appendChild(cell);
        });

        // ✅ FIRST ROW → THEAD | OTHERS → TBODY
        if (index === 0) {
          thead.appendChild(tr);
        } else {
          tbody.appendChild(tr);
        }
      });

      table.appendChild(thead);
      table.appendChild(tbody);

      // ✅ Insert clean table at cursor
      const sel = window.getSelection();
      const range = sel.rangeCount ? sel.getRangeAt(0) : null;

      if (range) {
        range.deleteContents();
        range.insertNode(table);

        // ✅ Add clean paragraph after table (NOT inside)
        const p = document.createElement("p");
        p.innerHTML = "<br>";
        table.after(p);

        range.setStart(p, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      triggerChange();
      return;
    }
  }

  // ✅ If HTML exists → clean and insert normally
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
        <div
          className={activeFormats.bold ? "active" : ""}
          onMouseDown={(e) => { e.preventDefault(); doExec("bold"); }}
        >
          <strong>B</strong>
        </div>
        <div
          className={activeFormats.italic ? "active" : ""}
          onMouseDown={(e) => { e.preventDefault(); doExec("italic"); }}
        >
          <em>I</em>
        </div>
        <div
          className={activeFormats.heading === "p" ? "active" : ""}
          onMouseDown={(e) => { e.preventDefault(); formatAsParagraph(); }}
        >
          P
        </div>
        <div
          className={activeFormats.heading === "h1" ? "active" : ""}
          onMouseDown={(e) => { e.preventDefault(); doExec("formatBlock", "<h1>"); }}
        >
          H1
        </div>
        <div
          className={activeFormats.heading === "h2" ? "active" : ""}
          onMouseDown={(e) => { e.preventDefault(); doExec("formatBlock", "<h2>"); }}
        >
          H2
        </div>
        <div
          className={activeFormats.heading === "h3" ? "active" : ""}
          onMouseDown={(e) => { e.preventDefault(); doExec("formatBlock", "<h3>"); }}
        >
          H3
        </div>
        <div
          className={activeFormats.unorderedList ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            doExec("insertUnorderedList");
            setTimeout(fixListWrapping, 10);
          }}
        >
          • List
        </div>
        <div
          className={activeFormats.orderedList ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            doExec("insertOrderedList");
            setTimeout(fixListWrapping, 10);
          }}
        >
          1. List
        </div>
        <div onMouseDown={(e) => { e.preventDefault(); openLinkDialog(); }}>🔗 Link</div>
        <div onMouseDown={(e) => { e.preventDefault(); openImageDialog(); }}>🖼️ Image</div>
        <div onMouseDown={(e) => { e.preventDefault(); openTableDialog(); }}>📊 Table</div>
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
      <Dialog
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <TextField
            label="Display Text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Example text"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          <Button onClick={insertLink} variant="contained">Insert</Button>
        </DialogActions>
      </Dialog>

      {/* 🖼️ Image Dialog */}
      <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <UploadFile
            endpoint="/upload-image"
            fieldName="image"
            accept="image/*"
            onUploadComplete={(path) => setUploadedPath(path)}
          />
          <TextField
            label="Alt Text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageModalOpen(false)}>Cancel</Button>
          <Button onClick={insertImage} variant="contained">Insert</Button>
        </DialogActions>
      </Dialog>

      {/* 📊 Table Dialog */}
      <Dialog
        open={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle sx={{ mb:"20px" }}>Insert Table</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 400, pt: 3 }}>
          <TextField
            label="Rows"
            type="number"
            variant="outlined"
            value={tableRows}
            onChange={(e) => setTableRows(e.target.value)}
            inputProps={{ min: 1, max: 20 }}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Columns"
            type="number"
            variant="outlined"
            value={tableCols}
            onChange={(e) => setTableCols(e.target.value)}
            inputProps={{ min: 1, max: 20 }}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableModalOpen(false)}>Cancel</Button>
          <Button onClick={insertTable} variant="contained">Insert</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
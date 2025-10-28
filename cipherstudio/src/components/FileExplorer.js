import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import logo from "../logo/logo.png";
import "./FileExplorer.css";

export default function FileExplorer({
  files,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onSelect,
  selected,
}) {
  const [filename, setFilename] = useState("");
  const [foldername, setFoldername] = useState("");

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    Object.keys(files).forEach((key) => {
      if (key.endsWith("/")) {
        // folder - ensure exists
        zip.folder(key.replace(/\/$/, ""));
      } else {
        zip.file(key, files[key] || "");
      }
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "cipherstudio_project.zip");
  };

  return (
    <div className="fe-root">
      <div className="fe-logo">
        <img src={logo} alt="CipherStudio" />
        <div className="fe-title">CipherStudio</div>
      </div>

      <div className="fe-controls">
        <div className="fe-input-row">
          <input
            placeholder="New file (e.g., src/app.js)"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (onCreateFile(filename) || setFilename(""))}
          />
          <button className="fe-btn" onClick={() => { if (filename) { onCreateFile(filename); setFilename(""); }}}>＋</button>
        </div>

        <div className="fe-input-row">
          <input
            placeholder="New folder (e.g., src/components)"
            value={foldername}
            onChange={(e) => setFoldername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (onCreateFolder(foldername) || setFoldername(""))}
          />
          <button className="fe-btn" onClick={() => { if (foldername) { onCreateFolder(foldername); setFoldername(""); }}}>📁</button>
        </div>

        <div className="fe-actions">
          <button className="fe-action" onClick={handleDownloadAll}>⬇ Download ZIP</button>
        </div>
      </div>

      <div className="fe-list" role="list">
        {Object.keys(files).length === 0 && <div className="fe-empty">No files yet</div>}
        {Object.keys(files)
          .sort()
          .map((key) => {
            const isFolder = key.endsWith("/");
            const display = isFolder ? key : key.split("/").pop();
            return (
              <div
                key={key}
                className={`fe-item ${selected === key ? "active" : ""}`}
                onClick={() => !isFolder && onSelect(key)}
              >
                <div className="fe-item-left">
                  <span className="fe-icon">{isFolder ? "📁" : "📄"}</span>
                  <span className="fe-name">{display}</span>
                </div>
                <div className="fe-item-right">
                  <button
                    className="fe-del"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(key);
                    }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

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
  const [currentPath, setCurrentPath] = useState(""); // track where we are inside folders

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    Object.keys(files).forEach((key) => {
      if (key.endsWith("/")) {
        zip.folder(key.replace(/\/$/, ""));
      } else {
        zip.file(key, files[key] || "");
      }
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "cipherstudio_project.zip");
  };

  // Helper: get current folder contents only
  const currentFiles = Object.keys(files).filter((key) => {
    // root files if currentPath === ""
    if (currentPath === "") {
      return !key.includes("/") || key.indexOf("/") === key.length - 1;
    }
    return (
      key.startsWith(currentPath) &&
      key !== currentPath &&
      key.slice(currentPath.length).split("/").length <= 2
    );
  });

  // Navigation helpers
  const goToFolder = (path) => setCurrentPath(path);
  const goBack = () => {
    if (!currentPath) return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length ? parts.join("/") + "/" : "");
  };

  const fullFilePath = (name) =>
    currentPath ? currentPath + name : name;

  const fullFolderPath = (name) =>
    currentPath ? currentPath + name + "/" : name + "/";

  return (
    <div className="fe-root">
      <div className="fe-logo">
        <img src={logo} alt="CipherStudio" />
        <div className="fe-title">CipherStudio</div>
      </div>

      <div className="fe-controls">
        {currentPath && (
          <button className="fe-action" onClick={goBack}>
            🔙 Back
          </button>
        )}

        <div className="fe-input-row">
          <input
            placeholder={`New file (${currentPath || "root"})`}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filename.trim()) {
                onCreateFile(fullFilePath(filename.trim()));
                setFilename("");
              }
            }}
          />
          <button
            className="fe-btn"
            onClick={() => {
              if (filename.trim()) {
                onCreateFile(fullFilePath(filename.trim()));
                setFilename("");
              }
            }}
          >
            ＋
          </button>
        </div>

        <div className="fe-input-row">
          <input
            placeholder={`New folder (${currentPath || "root"})`}
            value={foldername}
            onChange={(e) => setFoldername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && foldername.trim()) {
                onCreateFolder(fullFolderPath(foldername.trim()));
                setFoldername("");
              }
            }}
          />
          <button
            className="fe-btn"
            onClick={() => {
              if (foldername.trim()) {
                onCreateFolder(fullFolderPath(foldername.trim()));
                setFoldername("");
              }
            }}
          >
            📁
          </button>
        </div>

        <div className="fe-actions">
          <button className="fe-action" onClick={handleDownloadAll}>
            ⬇ Download ZIP
          </button>
        </div>
      </div>

      <div className="fe-list" role="list">
        {currentFiles.length === 0 && (
          <div className="fe-empty">No files/folders here</div>
        )}
        {currentFiles.sort().map((key) => {
          const isFolder = key.endsWith("/");
          const display = key
            .slice(currentPath.length)
            .replace(/\/$/, "");
          return (
            <div
              key={key}
              className={`fe-item ${selected === key ? "active" : ""}`}
              onClick={() =>
                isFolder ? goToFolder(key) : onSelect(key)
              }
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

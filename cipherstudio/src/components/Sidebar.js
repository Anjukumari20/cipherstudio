import React, { useState } from "react";

const Sidebar = ({ files, setFiles, setActiveFile, activeFile }) => {
  const [newFileName, setNewFileName] = useState("");

  const addFile = () => {
    if (!newFileName.trim()) return;
    const newFile = { name: newFileName, content: "// New file" };
    setFiles([...files, newFile]);
    setNewFileName("");
  };

  const deleteFile = (name) => {
    const filtered = files.filter((file) => file.name !== name);
    setFiles(filtered);
    if (activeFile.name === name && filtered.length > 0) setActiveFile(filtered[0]);
  };

  return (
    <div className="sidebar">
      <h2 className="logo">⚡ CipherStudio</h2>
      <div className="file-ops">
        <input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file name"
        />
        <button onClick={addFile}>+</button>
      </div>
      <ul className="file-list">
        {files.map((file) => (
          <li
            key={file.name}
            onClick={() => setActiveFile(file)}
            className={activeFile.name === file.name ? "active" : ""}
          >
            {file.name}
            <button className="delete-btn" onClick={() => deleteFile(file.name)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

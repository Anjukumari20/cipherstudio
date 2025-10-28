import React, { useState, useEffect } from "react";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import OutputConsole from "./components/OutputConsole";
import SandpackIDE from "./components/SandpackIDE";
import "./App.css";

function App() {
  const [files, setFiles] = useState(() =>
    JSON.parse(localStorage.getItem("cipher_files")) || {
      "main.js": "console.log('Hello CipherStudio');",
      "utils/helper.js": "// helper functions\n",
      "assets/": null,
    }
  );
  const [selected, setSelected] = useState("main.js");
  const [output, setOutput] = useState("");
  const [showSandpack, setShowSandpack] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Check if user logged in
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("cipherUser"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cipher_files", JSON.stringify(files));
    if (!files[selected] && selected && selected.endsWith("/")) {
      const firstFile = Object.keys(files).find((k) => !k.endsWith("/"));
      setSelected(firstFile || "");
    }
  }, [files, selected]);

  // ✅ Create file (support folder nesting)
  const createFile = (path) => {
    if (!path) return;
    const clean = path.trim();
    if (files[clean]) {
      alert("File/folder already exists.");
      return;
    }

    const parentFolder = clean.substring(0, clean.lastIndexOf("/") + 1);
    if (parentFolder && !files[parentFolder]) {
      alert("Parent folder doesn't exist!");
      return;
    }

    setFiles((prev) => ({ ...prev, [clean]: "// new file\n" }));
    setSelected(clean);
  };

  // ✅ Create folder
  const createFolder = (folderName) => {
    if (!folderName) return;
    const name = folderName.trim();
    const folderKey = name.endsWith("/") ? name : name + "/";
    if (files[folderKey]) {
      alert("Folder already exists.");
      return;
    }
    setFiles((prev) => ({ ...prev, [folderKey]: null }));
  };

  // ✅ Delete file/folder
  const deleteEntry = (key) => {
    if (!window.confirm(`Delete "${key}" ?`)) return;
    setFiles((prev) => {
      const clone = { ...prev };
      if (key.endsWith("/")) {
        const prefix = key;
        Object.keys(clone).forEach((k) => {
          if (k === key || k.startsWith(prefix)) delete clone[k];
        });
      } else delete clone[key];
      return clone;
    });
    const first = Object.keys(files).find((k) => !k.endsWith("/"));
    setSelected(first || "");
  };

  // ✅ Update file content
  const updateFileContent = (path, content) => {
    setFiles((prev) => ({ ...prev, [path]: content }));
  };

  // ✅ Run code
  const runSelectedCode = () => {
    const code = files[selected];
    if (!code) return setOutput("// Select a file with runnable code");
    try {
      const logs = [];
      const origLog = console.log;
      console.log = (...args) => logs.push(args.map(String).join(" "));
      // eslint-disable-next-line no-eval
      eval(code);
      console.log = origLog;
      setOutput(logs.join("\n") || "// No output");
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("cipherUser");
    setUser(null);
  };

  return (
    <div className="cs-root">
      <div className="cs-sidebar">
        <FileExplorer
          files={files}
          onCreateFile={createFile}
          onCreateFolder={createFolder}
          onDelete={deleteEntry}
          onSelect={(k) => setSelected(k)}
          selected={selected}
        />
      </div>

      <div className="cs-main">
        <div className="cs-editor-toolbar">
          <div className="tabs">
            <div className="tab">{selected || "No file selected"}</div>

            <button className="run" onClick={runSelectedCode}>▶ Run</button>
            <button
              className="run"
              onClick={() => setShowSandpack(!showSandpack)}
              title="Toggle Sandpack IDE"
            >
              💻 Sandpack
            </button>

            {/* ✅ Login/Logout button */}
            {user ? (
              <>
                <span className="welcome-text">
                  Welcome, {user.firstName || "User"}!
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <button
                className="run login"
                onClick={() => (window.location.href = "/login")}
              >
                🔑 Login
              </button>
            )}
          </div>
        </div>

        <div className="cs-workarea">
          {showSandpack ? (
            <SandpackIDE code={files[selected]} />
          ) : (
            <>
              <div className="cs-editor">
                <CodeEditor
                  path={selected}
                  content={files[selected] || ""}
                  onChange={(newCode) => updateFileContent(selected, newCode)}
                />
              </div>
              <div className="cs-output">
                <OutputConsole output={output} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

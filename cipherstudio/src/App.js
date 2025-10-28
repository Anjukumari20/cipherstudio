import React, { useState, useEffect } from "react";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import OutputConsole from "./components/OutputConsole";
import SandpackIDE from "./components/SandpackIDE"; // 👈 ADD THIS
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
  const [showSandpack, setShowSandpack] = useState(false); // 👈 Toggle Sandpack view

  useEffect(() => {
    localStorage.setItem("cipher_files", JSON.stringify(files));
    if (!files[selected] && selected && selected.endsWith("/")) {
      const firstFile = Object.keys(files).find((k) => !k.endsWith("/"));
      setSelected(firstFile || "");
    }
  }, [files, selected]);

  const createFile = (path) => {
    if (!path) return;
    const clean = path.trim();
    if (files[clean]) return alert("File/folder already exists.");
    setFiles((prev) => ({ ...prev, [clean]: "// new file\n" }));
    setSelected(clean);
  };

  const createFolder = (folderName) => {
    if (!folderName) return;
    const name = folderName.trim();
    const folderKey = name.endsWith("/") ? name : name + "/";
    if (files[folderKey]) return alert("Folder already exists.");
    setFiles((prev) => ({ ...prev, [folderKey]: null }));
  };

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

  const updateFileContent = (path, content) => {
    setFiles((prev) => ({ ...prev, [path]: content }));
  };

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

import React, { useState, useEffect } from "react";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import OutputConsole from "./components/OutputConsole";
import "./App.css";

function App() {
  // files: object where key = path (folders end with '/'), value = file content string or null for folders
  const [files, setFiles] = useState(() =>
    JSON.parse(localStorage.getItem("cipher_files")) || {
      "main.js": "console.log('Hello CipherStudio');",
      "utils/helper.js": "// helper functions\n",
      "assets/": null, // folder example
    }
  );
  const [selected, setSelected] = useState("main.js");
  const [output, setOutput] = useState("");

  useEffect(() => {
    localStorage.setItem("cipher_files", JSON.stringify(files));
    // ensure selected points to an actual file
    if (!files[selected] && selected && selected.endsWith("/")) {
      // select first file if a folder is selected accidentally
      const firstFile = Object.keys(files).find((k) => !k.endsWith("/"));
      setSelected(firstFile || "");
    }
  }, [files, selected]);

  const createFile = (path) => {
    // create inside root or a folder path (user provides full path or simple filename)
    if (!path) return;
    const clean = path.trim();
    if (files[clean]) {
      alert("File/folder already exists.");
      return;
    }
    setFiles((prev) => ({ ...prev, [clean]: "// new file\n" }));
    setSelected(clean);
  };

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

  const deleteEntry = (key) => {
    if (!window.confirm(`Delete "${key}" ?`)) return;
    // if folder, delete all contents inside that folder
    setFiles((prev) => {
      const clone = { ...prev };
      if (key.endsWith("/")) {
        const prefix = key;
        Object.keys(clone).forEach((k) => {
          if (k === key || k.startsWith(prefix)) delete clone[k];
        });
      } else {
        delete clone[key];
      }
      return clone;
    });
    // update selected
    const first = Object.keys(files).find((k) => !k.endsWith("/"));
    setSelected(first || "");
  };

  const updateFileContent = (path, content) => {
    setFiles((prev) => ({ ...prev, [path]: content }));
  };

  const runSelectedCode = () => {
    const code = files[selected];
    if (!code) {
      setOutput("// Select a file with runnable code (e.g., .js)");
      return;
    }
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
            <button className="run" onClick={runSelectedCode} title="Run">
              ▶ Run
            </button>
            <button
              className="download-single"
              onClick={() => {
                // download only selected file if file
                if (!selected || selected.endsWith("/")) {
                  alert("Select a file to download.");
                  return;
                }
                const blob = new Blob([files[selected]], { type: "text/plain;charset=utf-8" });
                // dynamic link
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = selected.split("/").pop();
                a.click();
                URL.revokeObjectURL(a.href);
              }}
              title="Download file"
            >
              ⬇
            </button>
          </div>
        </div>

        <div className="cs-workarea">
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
        </div>
      </div>
    </div>
  );
}

export default App;

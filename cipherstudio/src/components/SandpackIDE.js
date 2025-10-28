// src/components/SandpackIDE.js
import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { SandpackThemeProvider } from "@codesandbox/sandpack-react";

export default function SandpackIDE({ code = "", onCodeChange }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <SandpackThemeProvider>
        <Sandpack
          template="react"
          files={{
            "/App.js": code || `export default function App() {
  return <h1>Hello CipherStudio 👋</h1>;
}`,
            "/index.js": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
          }}
          options={{
            showTabs: true,
            showLineNumbers: true,
            wrapContent: true,
            editorHeight: "85vh",
            showConsole: true,
            resizablePanels: true,
          }}
        />
      </SandpackThemeProvider>
    </div>
  );
}

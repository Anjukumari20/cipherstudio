import React from "react";
import "./OutputConsole.css";

export default function OutputConsole({ output }) {
  return (
    <div className="output-wrap">
      <div className="output-header">Output</div>
      <pre className="output-body">{output || "// Output will appear here"}</pre>
    </div>
  );
}

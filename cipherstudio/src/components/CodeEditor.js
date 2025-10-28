import React from "react";
import "./CodeEditor.css";

export default function CodeEditor({ content = "", onChange, path }) {
  return (
    <div className="code-editor-wrap">
      <textarea
        className="code-area"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
}

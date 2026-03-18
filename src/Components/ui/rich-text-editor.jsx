import { useRef } from "react";
import JoditEditor from "jodit-react";
import "jodit/es2021/jodit.min.css";

const DEFAULT_EDITOR_BUTTONS = [
  "paragraph",
  "|",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "|",
  "ul",
  "ol",
  "|",
  "outdent",
  "indent",
  "|",
  "align",
  "|",
  "link",
  "table",
  "hr",
  "|",
  "undo",
  "redo",
];

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start writing here...",
  minHeight = 320,
}) => {
  const editorRef = useRef(null);
  const configRef = useRef({
    readonly: false,
    placeholder,
    minHeight,
    toolbarAdaptive: false,
    toolbarSticky: false,
    statusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    buttons: DEFAULT_EDITOR_BUTTONS,
    removeButtons: ["image", "video", "file", "copyformat", "cut", "copy", "paste"],
  });

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-green-700">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={configRef.current}
        tabIndex={1}
        onBlur={(nextValue) => onChange?.(nextValue)}
        onChange={(nextValue) => onChange?.(nextValue)}
      />
    </div>
  );
};

export default RichTextEditor;

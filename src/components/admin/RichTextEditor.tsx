"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold, Italic, Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, Link as LinkIcon, Minus, Undo, Redo,
  RemoveFormatting,
} from "lucide-react";

type Props = {
  defaultValue: string;
  name: string;
  onChange?: (html: string) => void;
};

export default function RichTextEditor({ defaultValue, name, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#30A2F1] underline" } }),
      Placeholder.configure({ placeholder: "Beitragsinhalt hier eingeben…" }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] px-4 py-3 outline-none focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  // Keep hidden input in sync with editor content
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const el = document.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (el) el.value = editor.getHTML();
    };
    editor.on("update", update);
    return () => { editor.off("update", update); };
  }, [editor, name]);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL eingeben:", "https://");
    if (!url) return;
    if (editor.state.selection.empty) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  type ToolItem =
    | { type: "button"; icon: React.ElementType; label: string; action: () => void; active: () => boolean }
    | { type: "divider" };

  const tools: ToolItem[] = [
    { type: "button", icon: Heading1, label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: () => editor.isActive("heading", { level: 1 }) },
    { type: "button", icon: Heading2, label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor.isActive("heading", { level: 2 }) },
    { type: "button", icon: Heading3, label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: () => editor.isActive("heading", { level: 3 }) },
    { type: "button", icon: Heading4, label: "H4", action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), active: () => editor.isActive("heading", { level: 4 }) },
    { type: "divider" },
    { type: "button", icon: Bold,     label: "Fett",    action: () => editor.chain().focus().toggleBold().run(),       active: () => editor.isActive("bold") },
    { type: "button", icon: Italic,   label: "Kursiv",  action: () => editor.chain().focus().toggleItalic().run(),     active: () => editor.isActive("italic") },
    { type: "divider" },
    { type: "button", icon: List,        label: "Liste",           action: () => editor.chain().focus().toggleBulletList().run(),  active: () => editor.isActive("bulletList") },
    { type: "button", icon: ListOrdered, label: "Nummerierte Liste", action: () => editor.chain().focus().toggleOrderedList().run(), active: () => editor.isActive("orderedList") },
    { type: "divider" },
    { type: "button", icon: LinkIcon,          label: "Link",      action: addLink,                                             active: () => editor.isActive("link") },
    { type: "button", icon: Minus,             label: "Trennlinie", action: () => editor.chain().focus().setHorizontalRule().run(), active: () => false },
    { type: "button", icon: RemoveFormatting,  label: "Formatierung entfernen", action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), active: () => false },
    { type: "divider" },
    { type: "button", icon: Undo, label: "Rückgängig", action: () => editor.chain().focus().undo().run(), active: () => false },
    { type: "button", icon: Redo, label: "Wiederholen", action: () => editor.chain().focus().redo().run(), active: () => false },
  ];

  return (
    <div className="border border-gray-300 rounded overflow-hidden focus-within:border-[#30A2F1] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {tools.map((tool, i) =>
          tool.type === "divider" ? (
            <div key={i} className="w-px h-5 bg-gray-300 mx-1" />
          ) : (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              onMouseDown={(e) => { e.preventDefault(); tool.action(); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded text-[12px] font-medium transition-colors
                ${tool.active()
                  ? "bg-[#30A2F1] text-white"
                  : "text-[#555] hover:bg-gray-200 hover:text-[#333]"
                }`}
            >
              <tool.icon size={14} />
              <span className="hidden md:inline text-[11px]">{tool.label}</span>
            </button>
          )
        )}
      </div>

      {/* Editor area */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} defaultValue={defaultValue} />
    </div>
  );
}

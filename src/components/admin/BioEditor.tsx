"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link2, Minus, Undo, Redo } from "lucide-react";

type Props = {
  name: string;
  defaultValue?: string | null;
};

export default function BioEditor({ name, defaultValue }: Props) {
  const [html, setHtml] = useState(defaultValue || "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class: "bio-editor-content min-h-[160px] focus:outline-none p-3 text-[14px] text-[#333] leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex-wrap">
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          title="Fett"
        >
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          title="Kursiv"
        >
          <Italic size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title="Aufzählungsliste"
        >
          <List size={13} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title="Nummerierte Liste"
        >
          <ListOrdered size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolBtn onClick={setLink} active={editor?.isActive("link")} title="Link">
          <Link2 size={13} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Trennlinie"
        >
          <Minus size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolBtn
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
          title="Rückgängig"
        >
          <Undo size={13} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
          title="Wiederholen"
        >
          <Redo size={13} />
        </ToolBtn>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="bg-white" />

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-[#30A2F1] text-white"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

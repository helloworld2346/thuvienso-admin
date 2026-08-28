import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from "react-icons/fi";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-surface-3 dark:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL liên kết", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-app-border bg-surface-3/50 px-2 py-1.5">
      <ToolbarButton
        label="In đậm"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FiBold size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="In nghiêng"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FiItalic size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Tiêu đề"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <span className="text-xs font-bold">H2</span>
      </ToolbarButton>
      <ToolbarButton
        label="Danh sách"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FiList size={15} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-app-border" />
      <ToolbarButton
        label="Căn trái"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <FiAlignLeft size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Căn giữa"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <FiAlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton
        label="Căn phải"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <FiAlignRight size={15} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-app-border" />
      <ToolbarButton
        label="Chèn liên kết"
        active={editor.isActive("link")}
        onClick={addLink}
      >
        <FiLink size={15} />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung..." }),
    ],
    content: value,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[220px] px-3 py-2 focus:outline-none dark:prose-invert",
      },
    },
  });

  // Đồng bộ khi value từ ngoài đổi (vd mở modal Sửa prefill content)
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:border-app-border dark:bg-surface-3">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

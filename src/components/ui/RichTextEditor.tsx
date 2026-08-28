import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "@/components/ui/fontSize";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
  FiImage,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from "react-icons/fi";
import { MdFormatListNumbered } from "react-icons/md";
import { Select } from "@/components/ui/Select";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

const FONT_OPTIONS = [
  { value: "", label: "Mặc định" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
];

const SIZE_OPTIONS = [
  { value: "", label: "Cỡ chữ" },
  { value: "12px", label: "12" },
  { value: "14px", label: "14" },
  { value: "16px", label: "16" },
  { value: "18px", label: "18" },
  { value: "24px", label: "24" },
  { value: "32px", label: "32" },
];

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
      className={`rounded p-2 text-gray-600 transition-colors hover:bg-surface-3 dark:text-gray-300 ${
        active ? "bg-surface-3 text-primary" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onUploadImage,
}: {
  editor: Editor;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePickImage = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập đường dẫn", prev ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const currentFont =
    (editor.getAttributes("textStyle").fontFamily as string) ?? "";
  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string) ?? "";

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-app-border bg-surface p-2">
      {/* Font family */}
      <div className="w-36">
        <Select
          aria-label="Phông chữ"
          value={currentFont}
          options={FONT_OPTIONS}
          placeholder="Phông chữ"
          onChange={(v) =>
            v
              ? editor.chain().focus().setFontFamily(v).run()
              : editor.chain().focus().unsetFontFamily().run()
          }
        />
      </div>

      {/* Font size */}
      <div className="w-24">
        <Select
          aria-label="Cỡ chữ"
          value={currentSize}
          options={SIZE_OPTIONS}
          placeholder="Cỡ chữ"
          onChange={(v) =>
            v
              ? editor.chain().focus().setFontSize(v).run()
              : editor.chain().focus().unsetFontSize().run()
          }
        />
      </div>

      <span className="mx-1 h-5 w-px bg-app-border" />

      <ToolbarButton
        label="Đậm"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FiBold size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Nghiêng"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FiItalic size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Gạch dưới"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FiUnderline size={16} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-app-border" />

      <ToolbarButton
        label="Danh sách chấm"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FiList size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Danh sách đánh số"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <MdFormatListNumbered size={16} />
      </ToolbarButton>
      {/* Multilevel: tăng/giảm cấp trong list */}
      <ToolbarButton
        label="Tăng cấp"
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
      >
        <span className="text-sm font-semibold">→</span>
      </ToolbarButton>
      <ToolbarButton
        label="Giảm cấp"
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
      >
        <span className="text-sm font-semibold">←</span>
      </ToolbarButton>

      <ToolbarButton
        label="Liên kết"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <FiLink size={16} />
      </ToolbarButton>

      {onUploadImage && (
        <>
          <ToolbarButton label="Chèn ảnh" onClick={handlePickImage}>
            <FiImage size={16} />
          </ToolbarButton>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </>
      )}

      <span className="mx-1 h-5 w-px bg-app-border" />

      <ToolbarButton
        label="Canh trái"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <FiAlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Canh giữa"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <FiAlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Canh phải"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <FiAlignRight size={16} />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  onUploadImage,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung..." }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[240px] px-4 py-3 focus:outline-none dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-app-border bg-surface">
      <Toolbar editor={editor} onUploadImage={onUploadImage} />
      <EditorContent editor={editor} />
    </div>
  );
}

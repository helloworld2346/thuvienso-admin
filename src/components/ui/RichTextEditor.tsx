import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { FontSize } from "@/components/ui/fontSize";
import { Select } from "@/components/ui/Select";
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
  FiCode,
  FiMinus,
  FiRotateCcw,
  FiRotateCw,
  FiDroplet,
} from "react-icons/fi";
import {
  MdFormatListNumbered,
  MdFormatIndentIncrease,
  MdFormatIndentDecrease,
  MdFormatStrikethrough,
  MdFormatQuote,
  MdFormatClear,
  MdBorderColor,
} from "react-icons/md";

const MAX_IMAGE_MB = 5;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const FONT_FAMILIES = [
  { value: "", label: "Mặc định" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
];

const FONT_SIZES = [
  { value: "", label: "Cỡ chữ" },
  { value: "12px", label: "12" },
  { value: "14px", label: "14" },
  { value: "16px", label: "16" },
  { value: "18px", label: "18" },
  { value: "24px", label: "24" },
  { value: "32px", label: "32" },
];

const HEADINGS = [
  { value: "p", label: "Văn bản" },
  { value: "1", label: "Tiêu đề 1" },
  { value: "2", label: "Tiêu đề 2" },
  { value: "3", label: "Tiêu đề 3" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded p-2 text-gray-600 transition-colors hover:bg-surface-3 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 ${
        active ? "bg-surface-3 text-primary" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-app-border" />;
}

function Toolbar({
  editor,
  onUploadImage,
}: {
  editor: Editor;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const inList = editor.isActive("listItem");

  const currentHeading = editor.isActive("heading", { level: 1 })
    ? "1"
    : editor.isActive("heading", { level: 2 })
      ? "2"
      : editor.isActive("heading", { level: 3 })
        ? "3"
        : "p";

  const currentFont =
    (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";
  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";

  const handlePickImage = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onUploadImage) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      window.alert("Chỉ chấp nhận ảnh JPG, PNG, GIF hoặc WEBP.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      window.alert(`Ảnh vượt quá ${MAX_IMAGE_MB}MB.`);
      return;
    }
    try {
      setUploading(true);
      const url = await onUploadImage(file);
      if (url) editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(false);
    }
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

  const applyHeading = (v: string) => {
    if (v === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: Number(v) as 1 | 2 | 3 })
        .run();
    }
  };

  const clearFormat = () =>
    editor.chain().focus().unsetAllMarks().clearNodes().run();

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-app-border bg-surface p-2">
      {/* Undo / Redo */}
      <ToolbarButton
        label="Hoàn tác"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <FiRotateCcw size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Làm lại"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <FiRotateCw size={16} />
      </ToolbarButton>

      <Divider />

      {/* Heading */}
      <div className="w-32">
        <Select
          aria-label="Kiểu đoạn"
          value={currentHeading}
          options={HEADINGS}
          onChange={applyHeading}
        />
      </div>

      {/* Font family */}
      <div className="w-36">
        <Select
          aria-label="Phông chữ"
          value={currentFont}
          options={FONT_FAMILIES}
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
          options={FONT_SIZES}
          onChange={(v) =>
            v
              ? editor.chain().focus().setFontSize(v).run()
              : editor.chain().focus().unsetFontSize().run()
          }
        />
      </div>

      <Divider />

      {/* Marks */}
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
      <ToolbarButton
        label="Gạch ngang"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <MdFormatStrikethrough size={16} />
      </ToolbarButton>

      {/* Text color */}
      <label
        className="relative flex cursor-pointer items-center rounded p-2 text-gray-600 transition-colors hover:bg-surface-3 dark:text-gray-300"
        title="Màu chữ"
      >
        <FiDroplet size={16} />
        <input
          type="color"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          value={
            (editor.getAttributes("textStyle").color as string) ?? "#000000"
          }
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          aria-label="Chọn màu chữ"
        />
      </label>

      {/* Highlight */}
      <label
        className="relative flex cursor-pointer items-center rounded p-2 text-gray-600 transition-colors hover:bg-surface-3 dark:text-gray-300"
        title="Tô nền chữ"
      >
        <MdBorderColor size={16} />
        <input
          type="color"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          value={
            (editor.getAttributes("highlight").color as string) ?? "#ffff00"
          }
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: e.target.value })
              .run()
          }
          aria-label="Chọn màu nền chữ"
        />
      </label>

      <Divider />

      {/* Lists + multilevel */}
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
      <ToolbarButton
        label="Tăng cấp"
        disabled={!inList}
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
      >
        <MdFormatIndentIncrease size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Giảm cấp"
        disabled={!inList}
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
      >
        <MdFormatIndentDecrease size={16} />
      </ToolbarButton>

      <Divider />

      {/* Block-level */}
      <ToolbarButton
        label="Trích dẫn"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <MdFormatQuote size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Khối mã"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <FiCode size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Đường kẻ ngang"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <FiMinus size={16} />
      </ToolbarButton>

      <Divider />

      {/* Align */}
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

      <Divider />

      {/* Link + Image */}
      <ToolbarButton
        label="Liên kết"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <FiLink size={16} />
      </ToolbarButton>
      {onUploadImage && (
        <>
          <ToolbarButton
            label={uploading ? "Đang tải ảnh..." : "Chèn ảnh"}
            disabled={uploading}
            onClick={handlePickImage}
          >
            <FiImage size={16} className={uploading ? "animate-pulse" : ""} />
          </ToolbarButton>
          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleFile}
          />
        </>
      )}

      <Divider />

      {/* Clear formatting */}
      <ToolbarButton label="Xoá định dạng" onClick={clearFormat}>
        <MdFormatClear size={16} />
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
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
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

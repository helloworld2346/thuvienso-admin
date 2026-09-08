import { FiCheck } from "react-icons/fi";

interface ThumbnailPickerProps {
  images: string[];
  value: string;
  onChange: (url: string) => void;
}

export function ThumbnailPicker({
  images,
  value,
  onChange,
}: ThumbnailPickerProps) {
  if (images.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-app-border px-3 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
        Chèn ảnh vào nội dung trước để chọn ảnh đại diện
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((url, i) => {
        const selected = url === value;
        return (
          <button
            key={url}
            type="button"
            onClick={() => onChange(selected ? "" : url)}
            aria-label={`Chọn ảnh ${i + 1} làm ảnh đại diện`}
            aria-pressed={selected}
            className={`group relative block w-full overflow-hidden rounded-lg border-2 pt-[100%] transition-colors ${
              selected
                ? "border-primary"
                : "border-transparent hover:border-app-border"
            }`}
          >
            <img
              src={url}
              alt={`Ảnh ${i + 1}`}
              className="absolute left-0 top-0 h-full w-full object-cover"
            />
            {selected && (
              <span className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-primary/30">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <FiCheck size={14} />
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiEye } from "react-icons/fi";
import {
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "@/features/documents/hooks/useDocuments";
import { DocumentFormModal } from "@/features/documents/components/DocumentFormModal";
import { DocumentFilesModal } from "@/features/documents/components/DocumentFilesModal";
import type {
  Document,
  DocumentPayload,
  DocumentType,
} from "@/features/documents/documents.types";
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_LABELS,
} from "@/features/documents/documents.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StateView } from "@/components/ui/StateView";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

const TYPE_FILTER_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  ...DOCUMENT_TYPES.map((t) => ({
    value: t,
    label: DOCUMENT_TYPE_LABELS[t],
  })),
];

export default function DocumentsPage() {
  const { data, isLoading, isError } = useDocuments();
  const createMut = useCreateDocument();
  const updateMut = useUpdateDocument();
  const deleteMut = useDeleteDocument();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | DocumentType>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState<Document | null>(null);
  const [viewingFiles, setViewingFiles] = useState<Document | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((d) => {
      const matchType = typeFilter ? d.typeDocument === typeFilter : true;
      const matchSearch = q
        ? d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q)
        : true;
      return matchType && matchSearch;
    });
  }, [data, search, typeFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value as "" | DocumentType);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (d: Document) => {
    setEditing(d);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = (values: DocumentPayload) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idDocument, payload: values },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(values, { onSuccess: close });
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idDocument, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        icon={<FiFileText size={26} />}
        title="Tài liệu"
        subtitle={`${total} tài liệu`}
        action={
          <Button
            variant="primary"
            leftIcon={<FiPlus size={16} />}
            onClick={openCreate}
          >
            Thêm tài liệu
          </Button>
        }
      />

      <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Tìm theo tiêu đề, nội dung..."
            />
          </div>
          <div className="w-full sm:w-52">
            <Select
              value={typeFilter}
              options={TYPE_FILTER_OPTIONS}
              onChange={handleTypeFilter}
              placeholder="Tất cả loại"
              aria-label="Lọc theo loại tài liệu"
            />
          </div>
        </div>

        <StateView
          isLoading={isLoading}
          isError={isError}
          isEmpty={total === 0}
          errorText="Không tải được danh sách tài liệu."
          emptyText={
            search || typeFilter
              ? "Không tìm thấy tài liệu phù hợp."
              : "Chưa có tài liệu."
          }
          emptyIcon={<FiFileText size={30} />}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((d) => (
              <div
                key={d.idDocument}
                className="group flex flex-col rounded-xl border border-app-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {d.thumbnail ? (
                    <img
                      src={d.thumbnail}
                      alt={d.title}
                      loading="lazy"
                      className="h-14 w-11 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                      <FiFileText size={18} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {d.title}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {DOCUMENT_TYPE_LABELS[d.typeDocument]}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => setViewingFiles(d)}
                      className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary dark:text-gray-400"
                      aria-label="Xem file"
                    >
                      <FiEye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(d)}
                      className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary dark:text-gray-400"
                      aria-label="Sửa"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(d)}
                      className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      aria-label="Xoá"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="truncate">{d.content}</span>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary dark:bg-primary/20">
                    {DOCUMENT_STATUS_LABELS[d.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <PaginationBar
              page={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </StateView>
      </div>

      <DocumentFormModal
        open={open}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <DocumentFilesModal
        document={viewingFiles}
        onClose={() => setViewingFiles(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá tài liệu"
        message={`Bạn có chắc muốn xoá tài liệu "${deleting?.title}"? Hành động này không thể hoàn tác.`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

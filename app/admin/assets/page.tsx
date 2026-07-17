"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ChevronRight, ExternalLink, Boxes, Lock, Download, FileCode, X, Pencil } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-shell"
import { useAdmin, type AccessLevel, type CodeFile } from "@/lib/admin-store"
import { ASSET_ICON_NAMES, AssetIcon } from "@/lib/asset-icons"

const ACCESS_OPTIONS: { id: AccessLevel; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
  { id: "professional", label: "Professional" },
]

const accessBadge: Record<AccessLevel, string> = {
  free: "bg-secondary text-secondary-foreground",
  pro: "bg-[#ea580c] text-white",
  professional: "bg-foreground text-background",
}

export default function AssetsPage() {
  const { assets, addMainButton, removeMainButton, editMainButton, addSubButton, removeSubButton, editSubButton } = useAdmin()
  const [newMain, setNewMain] = useState("")
  const [newMainIcon, setNewMainIcon] = useState<string>(ASSET_ICON_NAMES[0])
  const [openForm, setOpenForm] = useState<string | null>(null)
  const [editingMainId, setEditingMainId] = useState<string | null>(null)
  const [editMainName, setEditMainName] = useState("")
  const [editMainIcon, setEditMainIcon] = useState<string>(ASSET_ICON_NAMES[0])
  const [editingSubId, setEditingSubId] = useState<string | null>(null)

  function handleAddMain(e: React.FormEvent) {
    e.preventDefault()
    const name = newMain.trim()
    if (!name) return
    addMainButton(name, newMainIcon)
    setNewMain("")
    setNewMainIcon(ASSET_ICON_NAMES[0])
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="ASSETS"
        description="Configure sidebar main buttons and their sub buttons"
      />

      <div className="p-4 lg:p-8 dot-grid-bg space-y-6">
        {/* Add main button */}
        <form
          onSubmit={handleAddMain}
          className="border-2 border-foreground bg-background p-4 space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                {"// New Main Button (Category)"}
              </label>
              <input
                value={newMain}
                onChange={(e) => setNewMain(e.target.value)}
                placeholder="e.g. Components, Animated, Blocks"
                className="w-full border-2 border-foreground bg-background px-3 py-2 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors h-[38px] shrink-0"
            >
              <Plus size={14} strokeWidth={2} /> Add Main
            </button>
          </div>

          {/* Icon picker for Main Button (Category) */}
          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              {"// Main Button Icon"}
            </label>
            <div className="flex flex-wrap gap-1.5 border-2 border-foreground bg-background p-2">
              {ASSET_ICON_NAMES.map((iconName) => {
                const active = newMainIcon === iconName
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setNewMainIcon(iconName)}
                    aria-label={iconName}
                    title={iconName}
                    className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/20 hover:border-[#ea580c] hover:text-[#ea580c]"
                    }`}
                  >
                    <AssetIcon name={iconName} size={16} strokeWidth={1.5} />
                  </button>
                )
              })}
            </div>
          </div>
        </form>

        {/* Main buttons list */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-foreground p-12 text-center">
            <Boxes size={28} strokeWidth={1.5} className="text-[#ea580c] mb-3" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              No main buttons yet. Add one above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((main) => {
              const isEditingMain = editingMainId === main.id
              return (
                <div key={main.id} className="border-2 border-foreground bg-background">
                  {/* Main header / Main edit form */}
                  {isEditingMain ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!editMainName.trim()) return
                        editMainButton(main.id, editMainName.trim(), editMainIcon)
                        setEditingMainId(null)
                      }}
                      className="border-b-2 border-foreground bg-secondary/15 p-4 space-y-4 animate-fadeIn"
                    >
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                        <div className="flex-1">
                          <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                            {"// Edit Main Button (Category)"}
                          </label>
                          <input
                            value={editMainName}
                            onChange={(e) => setEditMainName(e.target.value)}
                            placeholder="e.g. Components"
                            className="w-full border-2 border-foreground bg-background px-3 py-2 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors h-[38px]"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMainId(null)}
                            className="border-2 border-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors h-[38px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      {/* Icon picker for Main Button (Category) */}
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                          {"// Main Button Icon"}
                        </label>
                        <div className="flex flex-wrap gap-1.5 border-2 border-foreground bg-background p-2">
                          {ASSET_ICON_NAMES.map((iconName) => {
                            const active = editMainIcon === iconName
                            return (
                              <button
                                key={iconName}
                                type="button"
                                onClick={() => setEditMainIcon(iconName)}
                                aria-label={iconName}
                                title={iconName}
                                className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                                  active
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-foreground/20 hover:border-[#ea580c] hover:text-[#ea580c]"
                                }`}
                              >
                                <AssetIcon name={iconName} size={16} strokeWidth={1.5} />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ChevronRight size={14} strokeWidth={2} className="text-[#ea580c]" />
                        {main.icon && (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-foreground/30 text-[#ea580c]">
                            <AssetIcon name={main.icon} size={13} strokeWidth={1.5} />
                          </span>
                        )}
                        <span className="text-xs font-mono uppercase tracking-widest font-bold">{main.name}</span>
                        <span className="text-[9px] font-mono text-muted-foreground">
                          [{main.subButtons.length}]
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOpenForm(openForm === main.id ? null : main.id)}
                          className="flex items-center gap-1.5 border border-foreground/30 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                        >
                          <Plus size={12} strokeWidth={2} /> Sub
                        </button>
                        <button
                          onClick={() => {
                            setEditingMainId(main.id)
                            setEditMainName(main.name)
                            setEditMainIcon(main.icon || ASSET_ICON_NAMES[0])
                          }}
                          aria-label={`Edit ${main.name}`}
                          className="flex items-center justify-center border border-foreground/30 w-8 h-8 hover:bg-foreground/5 transition-colors"
                        >
                          <Pencil size={13} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => removeMainButton(main.id)}
                          aria-label={`Delete ${main.name}`}
                          className="flex items-center justify-center border border-foreground/30 w-8 h-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add sub-button form */}
                  <AnimatePresence initial={false}>
                    {openForm === main.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-b-2 border-foreground"
                      >
                        <SubButtonForm
                          onSubmit={(sub) => {
                            addSubButton(main.id, sub)
                            setOpenForm(null)
                          }}
                          onCancel={() => setOpenForm(null)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sub buttons */}
                  {main.subButtons.length === 0 ? (
                    <p className="px-4 py-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      No sub buttons. Click &quot;Sub&quot; to add one.
                    </p>
                  ) : (
                    <ul className="divide-y divide-foreground/15">
                      {main.subButtons.map((sub) => {
                        const isEditingSub = editingSubId === sub.id
                        if (isEditingSub) {
                          return (
                            <li key={sub.id} className="border-b border-foreground/15 last:border-b-0 bg-secondary/10">
                              <SubButtonForm
                                initialData={sub}
                                onSubmit={(updatedSub) => {
                                  editSubButton(main.id, sub.id, updatedSub)
                                  setEditingSubId(null)
                                }}
                                onCancel={() => setEditingSubId(null)}
                              />
                            </li>
                          )
                        }
                        return (
                          <li
                            key={sub.id}
                            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                          >
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/30 text-[#ea580c]">
                                <AssetIcon name={sub.icon} size={15} strokeWidth={1.5} />
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[12px] font-mono">{sub.name}</span>
                                  {sub.access.map((acc) => (
                                    <span
                                      key={acc}
                                      className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest ${accessBadge[acc]}`}
                                    >
                                      {acc}
                                    </span>
                                  ))}
                                  <span className="inline-flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-muted-foreground">
                                    <FileCode size={10} /> {sub.codeFiles.length} file
                                    {sub.codeFiles.length === 1 ? "" : "s"}
                                  </span>
                                </div>
                                <div className="mt-1 flex flex-col gap-0.5">
                                  {sub.previewLink && (
                                    <a
                                      href={sub.previewLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-[#ea580c] transition-colors"
                                    >
                                      <ExternalLink size={10} /> {sub.previewLink}
                                    </a>
                                  )}
                                  {sub.zipLink && (
                                    <a
                                      href={sub.zipLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-[#ea580c] transition-colors"
                                    >
                                      <Download size={10} /> {sub.zipLink}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingSubId(sub.id)}
                                aria-label={`Edit ${sub.name}`}
                                className="flex items-center justify-center border border-foreground/30 w-8 h-8 hover:bg-foreground/5 transition-colors"
                              >
                                <Pencil size={13} strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => removeSubButton(main.id, sub.id)}
                                aria-label={`Delete ${sub.name}`}
                                className="flex items-center justify-center border border-foreground/30 w-8 h-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              >
                                <Trash2 size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------- Sub button form ---------------------------- */

function SubButtonForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (sub: {
    name: string
    icon: string
    previewLink: string
    zipLink: string
    codeFiles: CodeFile[]
    access: AccessLevel[]
  }) => void
  onCancel: () => void
  initialData?: {
    name: string
    icon: string
    previewLink: string
    zipLink: string
    codeFiles: CodeFile[]
    access: AccessLevel[]
  }
}) {
  const [name, setName] = useState(initialData?.name || "")
  const [previewLink, setPreviewLink] = useState(initialData?.previewLink || "")
  const [zipLink, setZipLink] = useState(initialData?.zipLink || "")
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>(
    initialData?.codeFiles || [{ id: `cf${Date.now()}`, name: "", code: "" }]
  )
  const [access, setAccess] = useState<AccessLevel[]>(initialData?.access || ["free"])

  function updateFile(id: string, patch: Partial<CodeFile>) {
    setCodeFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }
  function addFile() {
    setCodeFiles((prev) => [...prev, { id: `cf${Date.now()}`, name: "", code: "" }])
  }
  function removeFile(id: string) {
    setCodeFiles((prev) => (prev.length === 1 ? prev : prev.filter((f) => f.id !== id)))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const cleanFiles = codeFiles
      .map((f) => ({ ...f, name: f.name.trim(), code: f.code }))
      .filter((f) => f.name || f.code)
    onSubmit({
      name: name.trim(),
      icon: initialData?.icon || "Code2", // default standard icon for sub buttons since icon picker is moved to main category
      previewLink: previewLink.trim(),
      zipLink: zipLink.trim(),
      codeFiles: cleanFiles.length ? cleanFiles : [{ id: `cf${Date.now()}`, name: "untitled.tsx", code: "" }],
      access,
    })
  }

  const field = "w-full border-2 border-foreground bg-background px-3 py-2 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  return (
    <form onSubmit={submit} className="p-4 space-y-4 bg-secondary/30">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>{"// 1. Sub Button Name"}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Brutal Button" className={field} />
        </div>
        <div>
          <label className={labelCls}>{"// 2. Preview Link"}</label>
          <input
            value={previewLink}
            onChange={(e) => setPreviewLink(e.target.value)}
            placeholder="https://..."
            className={field}
          />
        </div>
      </div>

      {/* Icon picker removed from sub buttons */}

      {/* Zip download link */}
      <div>
        <label className={labelCls}>
          <Download size={10} className="inline mr-1 -mt-0.5 text-[#ea580c]" /> {"4. ZIP Download Link"}
        </label>
        <input
          value={zipLink}
          onChange={(e) => setZipLink(e.target.value)}
          placeholder="https://.../component.zip"
          className={field}
        />
      </div>

      {/* Multiple code files */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
            {"// 5. Code Files"}
          </label>
          <button
            type="button"
            onClick={addFile}
            className="flex items-center gap-1.5 border border-foreground/30 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
          >
            <Plus size={12} strokeWidth={2} /> Add File
          </button>
        </div>
        <div className="space-y-3">
          {codeFiles.map((file, i) => (
            <div key={file.id} className="border-2 border-foreground">
              <div className="flex items-center gap-2 border-b-2 border-foreground bg-background px-2 py-1.5">
                <FileCode size={13} strokeWidth={1.5} className="shrink-0 text-[#ea580c]" />
                <input
                  value={file.name}
                  onChange={(e) => updateFile(file.id, { name: e.target.value })}
                  placeholder={`file-${i + 1}.tsx`}
                  className="flex-1 bg-transparent text-[11px] font-mono outline-none"
                />
                {codeFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    aria-label="Remove file"
                    className="flex h-6 w-6 items-center justify-center border border-foreground/30 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X size={12} strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <textarea
                value={file.code}
                onChange={(e) => updateFile(file.id, { code: e.target.value })}
                placeholder="Paste component code here..."
                rows={5}
                className="w-full resize-y bg-[#0d0d0d] px-3 py-2 text-[12px] font-mono text-[#e6e6e6] outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>
          <Lock size={10} className="inline mr-1 -mt-0.5 text-[#ea580c]" /> {"6. Access Level (Select Multiple)"}
        </label>
        <div className="flex flex-wrap border-2 border-foreground w-fit">
          {ACCESS_OPTIONS.map((opt, i) => {
            const active = access.includes(opt.id)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setAccess((prev) => {
                    if (prev.includes(opt.id)) {
                      if (prev.length === 1) return prev
                      return prev.filter((a) => a !== opt.id)
                    } else {
                      return [...prev, opt.id]
                    }
                  })
                }}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  i > 0 ? "border-l-2 border-foreground" : ""
                } ${active ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors"
        >
          Save Sub Button
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border-2 border-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/shadcn-io/tags";
import { CheckIcon, PlusIcon, Tag as TagIcon } from "lucide-react";
import * as React from "react";

type TagOption = { id: string; label: string };

type RHFTagsProps = {
  value: string[]; // RHF field value
  onChange: (next: string[]) => void; // RHF setter
  options?: TagOption[]; // available options
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxTags?: number;
  slugId?: boolean; // slugify id from label when creating
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function RHFTags({
  value,
  onChange,
  options = [],
  placeholder = "Select a tag...",
  className,
  disabled = false,
  maxTags,
  slugId = true,
}: RHFTagsProps) {
  const [catalog, setCatalog] = React.useState<TagOption[]>(options);
  const [query, setQuery] = React.useState("");

  // keep local catalog in sync if parent updates options
  React.useEffect(() => {
    setCatalog(options);
  }, [options]);

  const normalizedIncludes = (arr: string[], id: string) =>
    arr.some((v) => v.toLowerCase() === id.toLowerCase());

  const setSelected = (next: string[]) => {
    onChange(maxTags ? next.slice(0, maxTags) : next);
  };

  const remove = (id: string) => setSelected(value.filter((v) => v !== id));

  const toggle = (id: string) => {
    setSelected(
      normalizedIncludes(value, id)
        ? value.filter((v) => v.toLowerCase() !== id.toLowerCase())
        : [...value, id]
    );
    setQuery(""); // UX: clear input after pick
  };

  const ensureCatalogContains = (id: string, label: string) => {
    const exists = catalog.some(
      (t) =>
        t.id.toLowerCase() === id.toLowerCase() ||
        t.label.toLowerCase() === label.toLowerCase()
    );
    if (!exists) setCatalog((prev) => [...prev, { id, label }]);
  };

  const create = () => {
    const name = query.trim();
    if (!name) return;

    const id = slugId ? slug(name) : name;
    // avoid duplicates
    const existsById = catalog.some(
      (t) => t.id.toLowerCase() === id.toLowerCase()
    );
    const existsByLabel = catalog.some(
      (t) => t.label.toLowerCase() === name.toLowerCase()
    );

    if (!existsById && !existsByLabel) {
      setCatalog((prev) => [...prev, { id, label: name }]);
    }
    if (!normalizedIncludes(value, id)) {
      setSelected([...value, id]);
    }
    setQuery("");
  };

  // filter list by query
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((t) => t.label.toLowerCase().includes(q));
  }, [catalog, query]);

  const showCreate = query.trim().length > 0 && filtered.length === 0;

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (showCreate) create();
    } else if (
      e.key === "Backspace" &&
      query.length === 0 &&
      value.length > 0
    ) {
      // backspace removes last chip when input empty
      remove(value[value.length - 1]);
    }
  };

  return (
    <Tags className={className} data-disabled={disabled}>
      <TagsTrigger className="min-h-10" aria-disabled={disabled}>
        {value.length === 0 ? (
          <span className="flex items-center gap-2 text-muted-foreground">
            <TagIcon size={14} />
          </span>
        ) : (
          value.map((id) => {
            const label =
              catalog.find((t) => t.id.toLowerCase() === id.toLowerCase())
                ?.label ?? id;
            return (
              <TagsValue
                key={id}
                onRemove={() => !disabled && remove(id)}
                aria-label={`Remove ${label}`}
              >
                {label}
              </TagsValue>
            );
          })
        )}
      </TagsTrigger>

      <TagsContent className="z-50">
        <TagsInput
          value={query}
          onValueChange={(v: string) => {
            setQuery(v);
            // optional: if the query exactly matches an existing tag's label, pre-ensure it's in catalog
            const match = catalog.find(
              (t) => t.label.toLowerCase() === v.trim().toLowerCase()
            );
            if (match) ensureCatalogContains(match.id, match.label);
          }}
          onKeyDown={onInputKeyDown}
          disabled={disabled || (maxTags ? value.length >= maxTags : false)}
        />

        <TagsList>
          {showCreate && (
            <TagsEmpty>
              <button
                type="button"
                className="mx-auto flex cursor-pointer items-center gap-2"
                onClick={create}
                disabled={disabled}
              >
                <PlusIcon size={14} className="text-muted-foreground" />
                Create new tag: <strong>{query.trim()}</strong>
              </button>
            </TagsEmpty>
          )}

          <TagsGroup>
            {filtered.map((tag) => {
              const selected = normalizedIncludes(value, tag.id);
              return (
                <TagsItem
                  key={tag.id}
                  value={tag.id}
                  onSelect={(val: string) => {
                    ensureCatalogContains(tag.id, tag.label);
                    toggle(val);
                  }}
                  aria-pressed={selected}
                  aria-label={`Select ${tag.label}`}
                >
                  {tag.label}
                  {selected && (
                    <CheckIcon
                      size={14}
                      className="ml-1 text-muted-foreground"
                    />
                  )}
                </TagsItem>
              );
            })}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
}

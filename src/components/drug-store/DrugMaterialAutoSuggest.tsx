import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DrugMaterialSuggest } from "./drug-store.schema"; // Import schema của bạn
import drugStoreApiRequest from "./drugStoreApiRequest";

interface Props {
  onSelect: (drug: DrugMaterialSuggest) => void;
  placeholder?: string;
}

export function DrugMaterialAutoSuggest({ onSelect, placeholder }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DrugMaterialSuggest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const isSelecting = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Logic kiểm tra vị trí để đảo chiều hiển thị (Smart Positioning)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();

      // Tính toán khoảng trống thực tế bên dưới tới đáy của Dialog hoặc Viewport
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // LIST_HEIGHT là chiều cao tối đa của menu gợi ý (300px + 10px buffer)
      const LIST_HEIGHT = 310;

      if (spaceBelow < LIST_HEIGHT && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }

      console.log(
        "Space Below:",
        spaceBelow,
        "Position:",
        spaceBelow < LIST_HEIGHT ? "top" : "bottom",
      );
    }
  }, [isOpen, suggestions.length]);

  // 2. Debounce Search API
  useEffect(() => {
    if (isSelecting.current || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Thay url API thực tế của bạn
        const res = await drugStoreApiRequest.autoSuggest(query);
        const data = res.payload.result;
        setSuggestions(data);
        setIsOpen(true);
        setSelectedIndex(0); // Reset index về dòng đầu tiên khi có kết quả mới
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // 3. Xử lý Phím tắt (Keyboard Navigation)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (drug: DrugMaterialSuggest) => {
    isSelecting.current = true;
    onSelect(drug);
    setQuery(drug.name);
    setIsOpen(false);
    setSelectedIndex(-1);

    setTimeout(() => {
      isSelecting.current = false;
    }, 500);
  };

  // Cuộn theo phím mũi tên
  useEffect(() => {
    const selectedElement = scrollRef.current?.children[
      selectedIndex
    ] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div
      className={cn("relative w-full", isOpen ? "z-[100]" : "z-auto")}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder || "Tìm thuốc, hoạt chất..."}
          className="pr-8 h-9 text-sm"
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay để click kịp nhận
        />
        <div className="absolute right-2 top-2 text-slate-400">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* DANH SÁCH GỢI Ý */}
      {isOpen && (suggestions.length > 0 || loading) && (
        <div
          className="absolute left-0 w-[550px] bg-white border border-blue-200 rounded-md shadow-2xl z-[9999]"
          style={
            position === "top"
              ? { bottom: "100%", marginBottom: "4px", top: "auto" }
              : { top: "100%", marginTop: "4px", bottom: "auto" }
          }
        >
          <div
            ref={scrollRef}
            className="max-h-[300px] overflow-y-auto custom-scrollbar"
          >
            {loading && suggestions.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Đang
                tìm...
              </div>
            )}

            {suggestions.map((drug, index) => (
              <div
                key={drug.id}
                className={cn(
                  "p-3 cursor-pointer border-b last:border-0 flex flex-col gap-1 transition-colors",
                  selectedIndex === index
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-slate-50 bg-white",
                )}
                onMouseDown={(e) => {
                  e.preventDefault(); // Ngăn onBlur của input chạy trước
                  handleSelect(drug);
                }}
              >
                <div className="font-bold text-sm text-blue-900 leading-tight">
                  {drug.name}
                </div>
                {drug.hoatChat && (
                  <div className="text-[11px] text-slate-600 italic line-clamp-1">
                    {drug.hoatChat}
                  </div>
                )}
                <div className="text-[10px] flex items-center gap-4 mt-1">
                  <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded border border-blue-100 uppercase">
                    {drug.code}
                  </span>
                  <span className="text-slate-500">
                    ĐVT: <strong className="text-slate-700">{drug.unit}</strong>
                  </span>
                  {drug.manufacturer && (
                    <span className="text-slate-400 truncate flex-1 text-right">
                      {drug.manufacturer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef, use } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiResponseInterface } from "@/types";
import { logger } from "@/lib/logger";
import { set } from "date-fns";

interface Props<T> {
  value?: string;
  fetchData: (query: string) => Promise<T[]>; // Hàm tạo URL tìm kiếm
  onSelect: (item: T) => void; // Callback khi chọn
  renderItem: (item: T) => React.ReactNode; // Giao diện từng dòng kết quả
  getDisplayValue: (item: T) => string; // Giá trị hiển thị lên ô Input sau khi chọn
  placeholder?: string;
  className?: string;
  minChars?: number;
}

export function AutoSuggest<T extends { id?: string | number }>({
  value = "",
  fetchData,
  onSelect,
  renderItem,
  getDisplayValue,
  placeholder,
  className,
  minChars = 2,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  const containerRef = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false);
  const lastSearchQuery = useRef("");

  useEffect(() => {
    lastSearchQuery.current = value;
    setQuery(value);
    setIsOpen(false);
  }, [value]);

  // Tính toán vị trí hiển thị (Đảo chiều nếu sát đáy)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 450 ? "top" : "bottom");
    }
  }, [isOpen, suggestions.length]);

  // Debounce API
  useEffect(() => {
    if (
      isSelecting.current ||
      query.length < minChars ||
      query === lastSearchQuery.current
    ) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchData(query);

        setSuggestions(Array.isArray(data) ? data : []);
        setIsOpen(data.length > 0);
        setSelectedIndex(0);
      } catch (err) {
        logger.error("AutoSuggest Error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, fetchData, minChars]);

  const handleSelect = (item: T) => {
    const displayValue = getDisplayValue(item);

    isSelecting.current = true;
    lastSearchQuery.current = displayValue;
    setQuery(displayValue);
    onSelect(item);
    setSuggestions([]);
    setIsOpen(false);
    setTimeout(() => {
      isSelecting.current = false;
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
    e.stopPropagation();
  };

  const handleInputChange = (val: string) => {
    isSelecting.current = false; // Reset cờ khi user bắt đầu gõ
    setQuery(val);
  };

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= minChars && setIsOpen(true)}
          placeholder={placeholder}
          className="pr-8 h-9 text-sm"
          onBlur={() => {
            setTimeout(() => {
              setIsOpen(false);
              // Không nên xóa suggestions ngay lập tức nếu muốn focus lại hiện luôn,
              // nhưng để tránh lỗi dòng khác, xóa là cách an toàn nhất:
              setSuggestions([]);
              lastSearchQuery.current = ""; // Reset để lần sau focus/gõ lại vẫn chạy
            }, 200);
          }}
        />
        <div className="absolute right-2 top-2.5 text-slate-400">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {isOpen && (suggestions.length > 0 || loading) && (
        <div
          className={cn(
            "absolute left-0 w-[550px] bg-white border border-blue-200 rounded-md shadow-2xl z-[9999] flex flex-col overflow-hidden",
            position === "top"
              ? "bottom-[calc(100%+4px)]"
              : "top-[calc(100%+4px)]",
          )}
          style={{ position: "absolute" }}
        >
          <div className="max-h-[400px] min-h-[150px] overflow-y-auto bg-white">
            {suggestions.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "p-3 cursor-pointer border-b last:border-0 transition-colors",
                  selectedIndex === index
                    ? "bg-blue-100"
                    : "hover:bg-slate-50 bg-white",
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

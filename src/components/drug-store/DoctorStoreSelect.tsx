"use client";

import React, { useEffect, useState } from "react";
import { PackageOpen, PackageSearch, Store } from "lucide-react";
import { useAppContext } from "@/providers/app-proviceders";
import { PharStoreInfo } from "@/types";
import SelectBoxSuggest from "../ui/SelectBoxSuggest";
import drugStoreApiRequest from "./drugStoreApiRequest";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export function DoctorStoreSelect() {
  const { currentStore, setCurrentStore } = useAppContext();
  const [stores, setStores] = useState<PharStoreInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        params.append("keyword", "");
        params.append("active", String(true));
        const res = await drugStoreApiRequest.searchStore(params);

        setStores(res.payload.result || []);
      } catch (error) {
        console.error("Lỗi tải danh sách kho", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleStoreChange = (storeId: string) => {
    const selected = stores.find((s) => s.id === storeId);
    if (selected) {
      setCurrentStore(selected);
    }
  };

  const toggleOnlyInStock = (value: boolean) => {
    if (currentStore) {
      const updatedStore = { ...currentStore, onlyInStock: value };
      setCurrentStore(updatedStore);
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg bg-blue-50/50 border-blue-100">
      <div className="flex items-center gap-2 text-blue-700 font-medium whitespace-nowrap">
        <Store className="h-4 w-4" />
        <span className="text-sm">Quầy thuốc:</span>
      </div>

      <div className="w-[250px]">
        <SelectBoxSuggest
          options={stores.map((s) => ({
            id: s.id,
            name: s.name,
            code: s.code,
          }))}
          value={currentStore?.id || ""}
          onChange={handleStoreChange}
          placeholder={loading ? "Đang tải..." : "Chọn quầy phát thuốc..."}
        />
      </div>

      {/* Phần Switch Lọc tồn kho */}
      <div className="flex items-center space-x-2 border-l pl-6">
        <div className="flex items-center gap-2 text-slate-600">
          {currentStore?.onlyInStock ? (
            <PackageSearch className="h-4 w-4 text-orange-500" />
          ) : (
            <PackageOpen className="h-4 w-4 text-slate-400" />
          )}
          <Label htmlFor="stock-mode" className="text-sm cursor-pointer">
            Chỉ lấy thuốc còn tồn
          </Label>
        </div>
        <Switch
          id="stock-mode"
          checked={currentStore?.onlyInStock ?? true}
          onCheckedChange={toggleOnlyInStock}
          disabled={!currentStore}
        />
      </div>

      {currentStore && (
        <span className="text-[10px] bg-white px-2 py-1 rounded border text-slate-500 font-mono">
          ID: {currentStore.code}
        </span>
      )}
    </div>
  );
}

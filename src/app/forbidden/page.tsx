// app/403/page.tsx
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert size={48} />
        </div>
        
        <h1 className="mb-2 text-4xl font-bold text-slate-900">403 - Truy cập bị từ chối</h1>
        <p className="mb-8 text-lg text-slate-600">
          Rất tiếc, bạn không có quyền truy cập vào chức năng này. <br />
          Vui lòng liên hệ quản trị viên hệ thống nếu bạn cho rằng đây là một sai sót.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={18} /> Quay lại trang chủ
            </Link>
          </Button>
          
          <Button variant="destructive" asChild>
            <Link href="/logout" className="flex items-center gap-2">
              <LogOut size={18} /> Đăng xuất
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-slate-400">
        Hệ thống Quản lý phòng khám
      </div>
    </div>
  );
}
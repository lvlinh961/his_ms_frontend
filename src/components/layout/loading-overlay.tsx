import "@/app/globals.css";
import { Loader2 } from "lucide-react";

type HeadrProps = {
  hideMenu?: Boolean | false;
};
export default function LoadingOverlay({ hideMenu }: HeadrProps) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/50 text-white">
      <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
    </div>
  );
}

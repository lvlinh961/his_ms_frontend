import { useState } from "react";
import { User } from "./userManagement.types";
import userApiRequest from "./userApiRequest";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  HttpStatus,
  DisableStatus,
  DisableStatusLabel,
} from "@/constants/enum";
import { Pencil, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { logger } from "@/lib/logger";

interface UserActionProps {
  user: User;
  fetchListUser: () => void;
  setSelectedUser?: (user: User | null) => void;
  setOpenUserAction?: (open: boolean) => void;
}

export default function UserAction({
  user,
  fetchListUser,
  setSelectedUser,
  setOpenUserAction,
}: UserActionProps) {
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    setLoading(true);
    try {
      //   const res = await userApiRequest.updateUserStatus(user.id, DisableStatus.DISABLE);
      //   if (res.status === HttpStatus.SUCCESS) {
      //     toast({
      //       title: "Thành công",
      //       description: "Đã vô hiệu hóa tài khoản.",
      //     });
      //     fetchListUser();
      //   }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      //   const res = await userApiRequest.updateUserStatus(user.id, DisableStatus.ENABLED);
      //   if (res.status === HttpStatus.SUCCESS) {
      //     toast({
      //       title: "Thành công",
      //       description: "Đã kích hoạt tài khoản.",
      //     });
      //     fetchListUser();
      //   }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    setLoading(true);
    try {
      //   const res = await userApiRequest.deleteUser(user.id);
      //   if (res.status === HttpStatus.SUCCESS) {
      //     toast({
      //       title: "Thành công",
      //       description: "Đã xóa người dùng.",
      //     });
      //     fetchListUser();
      //   }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for edit action
  const handleEdit = () => {
    logger.info("Edit user:", user);

    if (setSelectedUser) {
      setSelectedUser(user);
    }
    if (setOpenUserAction) {
      setOpenUserAction(true);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="outline"
        onClick={handleEdit}
        disabled={loading}
        title="Chỉnh sửa"
      >
        <Pencil size={16} />
      </Button>
      {user.status === DisableStatus.ENABLE ? (
        <Button
          size="icon"
          variant="outline"
          onClick={handleDisable}
          disabled={loading}
          title="Vô hiệu hóa"
        >
          <Ban size={16} />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="outline"
          onClick={handleEnable}
          disabled={loading}
          title="Kích hoạt"
        >
          <CheckCircle2 size={16} />
        </Button>
      )}
      <Button
        size="icon"
        variant="destructive"
        onClick={handleDelete}
        disabled={loading}
        title="Xóa"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}

import { useAppContext } from "@/providers/app-proviceders";

export const usePermission = () => {
  const { user, isInitialized } = useAppContext();

  const hasPermission = (permissionName?: string) => {
    // 1. Nếu chưa load xong từ LocalStorage, trả về false để Guard đứng đợi
    if (!isInitialized) return false;

    // 2. Không yêu cầu quyền thì luôn đúng
    if (!permissionName) return true;

    // return user?.scope.includes(permissionName);
    // 3. Kiểm tra mảng scope (đảm bảo user và scope tồn tại)
    return user?.scope?.includes(permissionName) ?? false;
  };

  return { hasPermission, isLoading: !isInitialized, user };
};

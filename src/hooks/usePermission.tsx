import { useAppContext } from "@/providers/app-proviceders";

export const usePermission = () => {
  const { user } = useAppContext();

  const hasPermission = (permissionName?: string) => {
    if (!permissionName) {
      return true;
    }
    return user?.scope.includes(permissionName);
  };

  return { hasPermission };
};

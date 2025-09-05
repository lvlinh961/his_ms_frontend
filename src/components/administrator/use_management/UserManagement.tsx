"use client";

import { useEffect, useState } from "react";
import { User, GetPagingUserParam } from "./userManagement.types";
import userApiRequest from "./userApiRequest";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleErrorApi } from "@/lib/utils";
import {
  DisableStatus,
  DisableStatusLabel,
  HttpStatus,
} from "@/constants/enum";
import { dateFormater } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateUserDialog from "./CreateUserDialog";
import { PaginationAnsyc } from "@/components/ui/PaginationAnsyc";
import LoadingOverlay from "@/components/layout/loading-overlay";
import UserAction from "./UserAction";

export default function UserManagement() {
  const [listUser, setListUser] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openUserAction, setOpenUserAction] = useState<boolean>(false);

  useEffect(() => {
    fetchListUser();
  }, []);

  const fetchListUser = async (page: number = 1, size: number = 20) => {
    setLoading(true);

    try {
      const query = {
        page: page,
        size: size,
      } satisfies GetPagingUserParam;

      const res = await userApiRequest.getListUser(query);

      if (res.status == HttpStatus.SUCCESS) {
        setListUser(res.payload.data);
        setCurrentPage(res.payload.currentPage);
        setTotalPage(res.payload.totalPage);
        setPageSize(res.payload.pageSize);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const addUser = (user: User) => {
    setListUser((prev) => {
      return [user, ...prev];
    });
  };

  const updateUser = (user: User) => {
    setListUser((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        const updatedList = [...prev];
        updatedList[index] = user;
        return updatedList;
      }
      return prev;
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="flex-1 md:p-4 w-full  h-full">
        <div className="p-4 border gap-4">
          <div className="flex items-center justify-between mt-4">
            <div></div>
            <div>
              <CreateUserDialog
                addUser={addUser}
                updateUser={updateUser}
                setSelectedUser={setSelectedUser}
                user={selectedUser}
                open={openUserAction}
                setOpen={setOpenUserAction}
              />
            </div>
          </div>
          <Table className="mt-4">
            <TableHeader className="bg-cyan-700 text-white">
              <TableRow>
                <TableHead className="text-white-500 font-bold">STT</TableHead>
                <TableHead className="text-white-500 font-bold">
                  Tên đăng nhập
                </TableHead>
                <TableHead className="text-white-500 font-bold">Tên</TableHead>
                <TableHead className="text-white-500 font-bold">Họ</TableHead>
                <TableHead className="text-white-500 font-bold">
                  Email
                </TableHead>
                <TableHead className="text-white-500 font-bold">
                  Ngày Sinh
                </TableHead>
                <TableHead className="text-white-500 font-bold">
                  Trạng thái
                </TableHead>
                <TableHead className="text-white-500 font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listUser &&
                listUser.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}.
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {dateFormater.format(new Date(user.dob))}
                    </TableCell>
                    <TableCell>
                      {DisableStatusLabel[user.status as DisableStatus]}
                    </TableCell>
                    <TableCell>
                      <UserAction
                        user={user}
                        fetchListUser={fetchListUser}
                        setSelectedUser={setSelectedUser}
                        setOpenUserAction={setOpenUserAction}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <PaginationAnsyc
            totalPage={totalPage}
            currentPage={currentPage}
            loadList={(page, size) => {
              fetchListUser(page, size);
            }}
          />
        </div>
      </div>
      {loading && <LoadingOverlay />}
    </ScrollArea>
  );
}

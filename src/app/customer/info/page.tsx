import { Breadcrumbs } from "@/components/breadcrumbs";
import AdministrativeForm from "@/components/customer/info/administrative-form";

import { cn } from "@/lib/utils";

const breadcrumbItems = [
  { title: "Hồ sơ bệnh án", link: "" },
  { title: "Hành chính", link: "/customer/info" },
];
export default function page() {
  return (
    <>
      <div className="flex-1 p-4 pt-1 w-full h-full">
        {/* <div className={cn('block lg:!hidden')}></div> */}
        <AdministrativeForm />
      </div>
    </>
  );
}

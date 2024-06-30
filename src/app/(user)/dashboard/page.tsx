import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb";
import { TableView } from "@/components/table-view";

export default function Dashboard() {
  const breadcrumbItems = [
    {
      label: "Home",
      url: "/"
    },
    {
      label: "Dashboard",
      url: "/dashboard"
    }
  ]

  return (
    <div className="flex flex-col">
      <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
      <div className="p-5 md:p-20 bg-white rounded-md">
        <h1 className="my-5 font-bold text-[15pt]">Suppliers Managment</h1>
        <TableView />
      </div>
    </div>
  )
}
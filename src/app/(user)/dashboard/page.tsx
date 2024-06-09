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
      <div className="ml-20 mr-20 mt-10 mb-20 bg-white p-5 rounded-md">
        <h1 className="mt-5 mb-5 font-bold text-[15pt]">Suppliers Managment</h1>
        <TableView />
      </div>
    </div>
  )
}
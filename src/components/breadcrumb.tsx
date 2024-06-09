import { Slash } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import BreadcrumbProps from "@/interfaces/breadcrumb-props"

export function BreadcrumbWithCustomSeparator(props: BreadcrumbProps) {
  return (
    <div className="p-5 border-b shadow-md">
      <Breadcrumb>
        <BreadcrumbList>
          {props.items.map((item, index) => (
            <div className="flex" key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink href={item.url}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="ml-1 mt-1">
                <Slash />
              </BreadcrumbSeparator>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

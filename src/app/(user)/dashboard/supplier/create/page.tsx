'use client';
import BackButton from "@/components/back-button";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb";
import { InputForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import * as React from "react";

export default function Supplier() {
  const breadcrumbItems = [
    {
      label: "Home",
      url: "/"
    },
    {
      label: "Dashboard",
      url: "/dashboard"
    },
    {
      label: "Supplier",
      url: ""
    },
    {
      label: "Create",
      url: "/dashboard/supplier/create"
    }
  ]

  return (
    <div className="flex flex-col shadow-md">
      <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
      <div className="flex flex-col my-10 p-5 justify-center self-center border md:p-20">
        <div className="flex items-center mb-5 md:mb-10">
          <BackButton />
          <h1 className="font-bold text-[12pt] ml-5 mt-3 md:text-[18pt]">Add New Supplier</h1>
        </div>
        <InputForm />
      </div>
    </div>
  )
}
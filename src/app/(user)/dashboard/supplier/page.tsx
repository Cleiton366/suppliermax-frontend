'use client';
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import SupplierMaxService from "@/services/supplier-max-services";
import * as React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { IoArrowBackOutline } from "react-icons/io5";
import BackButton from "@/components/back-button";

export default function Supplier() {
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  var [data, setData] = useState({} as any);
  var [image, setImage] = useState({} as any);
  var [viewOnly, setViewOnly] = useState(true);
  var [address, setAddress] = useState({} as any);

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
      label: data ? `${data.name}` : "Supplier",
      url: ""
    }
  ]

  const FormSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(1, {
      message: "Phone number is required.",
    }),
    address: z.string().min(1, {
      message: "Address is required.",
    }),
    isActive: z.boolean(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      setId(idParam);
    }
    fetchSupplier();
  }, [id]);

  async function fetchSupplier() {
    if (id) {
      const response = await SupplierMaxService.getSupplier(id);
      setData(response);
      setImage(bufferToBase64(response.image.file.buffer, response.image.file.mimetype));
      setIsLoading(false);
      setAddress(response.address);
    }
  }

  function bufferToBase64(buffer: any, mimeType: string) {
    return `data:${mimeType};base64,${Buffer.from(buffer).toString('base64')}`;
  }

  async function handleUpdateSupplier(data: z.infer<typeof FormSchema>) {
    try {
      await SupplierMaxService.updateSupplier(id, data);
      setAddress(data.address);
      toast({
        title: "Supplier Information Updated",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      setViewOnly(true);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error While Updating Information",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      })
    }
  }

  return (
    isLoading ? (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      <div className="flex flex-col">
        <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
        <div className="px-20 p-5 rounded-md">
          <BackButton />
          <h1 className="mb-5 font-bold text-center mr-10 text-[16pt] md:text-[25pt]">{data.name}</h1>
          <div className="flex flex-col md:flex-row align-middle justify-center border p-3 shadow-md min-h-[46rem] container">
            <div className="flex flex-col align-middle justify-center mr-24">
              <div className="flex self-center justify-center ml-10">
                <img
                  className="rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48"
                  src={image || "/default-picture.png"}
                  alt={data.name}
                />
              </div>
              <div className="flex flex-col justify-center mt-5">
                <div className="ml-10">
                  <Form {...form}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                      className="space-y-6"
                    >
                      <FormField
                        disabled={viewOnly}
                        control={form.control}
                        name="email"
                        defaultValue={data.email}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={viewOnly}
                        control={form.control}
                        name="phone"
                        defaultValue={data.phone}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={viewOnly}
                        control={form.control}
                        name="address"
                        defaultValue={data.address}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={viewOnly}
                        control={form.control}
                        name="isActive"
                        defaultValue={data.isActive}
                        render={({ field }) => (
                          <FormItem className="flex flex-row">
                            <FormLabel className={viewOnly ? 'text-gray-500 self-end' : 'text-black self-end'}>Active</FormLabel>
                            <FormControl>
                              <Checkbox
                                className="ml-4"
                                defaultChecked={data.isActive}
                                disabled={viewOnly}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        {viewOnly ? (
                          <Button
                            variant="outline"
                            size="default"
                            className="ml-5 shadow-md"
                            onClick={() => setViewOnly(!viewOnly)}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="default"
                            className="ml-5 shadow-md"
                            onClick={() => handleUpdateSupplier(form.getValues())}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
            <div className="p-3 mt-10 relative overflow-hidden">
              <label className="font-bold">Supplier Location:</label>
              <iframe
                className="w-[450px] h-[300px] md:w-[600px] md:h-[500px] rounded-md"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              &q=${address}`}>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
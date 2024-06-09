import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function BackButton () {
  const router = useRouter();
  
  return(
    <IoArrowBackOutline className="w-7 md:w-10 h-10 cursor-pointer mt-3" onClick={() => router.push("/dashboard")}/>
  )
}
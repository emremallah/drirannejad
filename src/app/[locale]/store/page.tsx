import { zizaaStoreUrl } from "@/lib/content";
import { redirect } from "next/navigation";

export default function StorePage() {
  redirect(zizaaStoreUrl);
}

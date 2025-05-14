
// Re-export the useToast and toast functions from the actual implementation
import { useToast as useToastImpl, toast as toastImpl } from "@/hooks/use-toast";

export const useToast = useToastImpl;
export const toast = toastImpl;

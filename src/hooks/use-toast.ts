
// Export the existing hooks implementation from src/hooks
import * as ToastPrimitives from "@/components/ui/toast";
export { ToastPrimitives as Toast };

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Toast>;
export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.ToastAction>;

export const useToast = () => {
  return {
    toast: ToastPrimitives.toast,
    toasts: ToastPrimitives.useToast(),
    dismiss: ToastPrimitives.dismiss,
  };
};

export { toast } from "@/components/ui/toast";

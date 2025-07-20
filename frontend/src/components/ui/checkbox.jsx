// frontend/src/components/ui/checkbox.jsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
const Checkbox = React.forwardRef((props, ref) => (<CheckboxPrimitive.Root ref={ref} className={cn("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", props.className)} {...props}><CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}><Check className="h-4 w-4" /></CheckboxPrimitive.Indicator></CheckboxPrimitive.Root>));
export { Checkbox };
"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#060606] group-[.toaster]:border-[#E2E8F9] group-[.toaster]:shadow-xl group-[.toaster]:rounded-[14px] font-lexend py-4 px-5",
          description: "group-[.toast]:text-[#8E98A8] group-[.toast]:text-xs",
          actionButton: "group-[.toast]:bg-[#005C32] group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-[#F1F5F9] group-[.toast]:text-[#060606] group-[.toast]:font-medium group-[.toast]:rounded-lg",
          success: "group-[.toast]:border-l-4 group-[.toast]:border-l-[#005C32]",
          error: "group-[.toast]:border-l-4 group-[.toast]:border-l-[#DC2626]",
          info: "group-[.toast]:border-l-4 group-[.toast]:border-l-[#3B82F6]",
          warning: "group-[.toast]:border-l-4 group-[.toast]:border-l-[#F59E0B]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

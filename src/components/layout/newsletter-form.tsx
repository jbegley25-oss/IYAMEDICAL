"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="email"
        placeholder="Enter your email"
        className="h-10 flex-1 rounded-full border-gray-700 bg-gray-800/50 px-4 text-sm text-white placeholder:text-gray-500 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
      />
      <Button className="h-10 rounded-full bg-teal-600 px-5 text-sm font-semibold text-white shadow-none hover:bg-teal-700">
        Subscribe
      </Button>
    </form>
  );
}

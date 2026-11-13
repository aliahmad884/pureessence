import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-5 text-center bg-white">
      <div className="text-8xl font-bold text-[#dfb434] leading-none mb-2">404</div>
      <AlertCircle className="w-12 h-12 text-[#dfb434] mb-4" />
      <h1 className="mt-4 mb-2 text-3xl font-semibold text-[#111]">
        Page Not Found
      </h1>
      <p className="mb-6 text-[#555] max-w-[500px] mx-auto">
        Sorry, we couldn&rsquo;t find the page you are looking for. It may have been moved or deleted.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#dfb434] rounded hover:bg-[#c49a2e] transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}

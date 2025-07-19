import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          404 - صفحة غير موجودة
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            العودة للصفحة الرئيسية
          </Link>
          <Link href="/contact" className="rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}

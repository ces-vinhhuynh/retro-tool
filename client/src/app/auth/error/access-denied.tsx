import Link from 'next/link';

interface AccessDeniedProps {
  message: string;
  redirectUrl: string;
  linkText: string;
}

const AccessDenied = ({
  message,
  redirectUrl,
  linkText,
}: AccessDeniedProps) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mb-6 whitespace-pre-line text-gray-600">{message}</p>
        <Link
          href={redirectUrl}
          className="bg-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;

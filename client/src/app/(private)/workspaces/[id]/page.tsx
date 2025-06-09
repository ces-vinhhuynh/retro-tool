'use client';

const WorkspacePage = () => {
  return (
    <div className="flex flex-col gap-3 p-3 sm:px-4 md:px-8 md:py-8 lg:px-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Track your team health and recent health checks
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;

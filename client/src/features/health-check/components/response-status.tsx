interface ResponseStatusProps {
  respondedCount: number;
  teamSize: number;
}

export function ResponseStatus({
  respondedCount,
  teamSize,
}: ResponseStatusProps) {
  if (respondedCount === teamSize) {
    return (
      <span className="border-b-2 border-green-500 font-medium">
        All participants responded!
      </span>
    );
  }

  if (respondedCount > 0) {
    return (
      <>
        <span className="border-b-2 border-blue-500 font-medium">
          {respondedCount}/{teamSize}
        </span>{' '}
        participants responded
      </>
    );
  }

  return <span>No participants responded</span>;
}

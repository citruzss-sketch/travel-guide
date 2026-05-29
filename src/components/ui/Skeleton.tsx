interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      className={`inline-block animate-pulse rounded bg-muted/20 ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonBlock({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-muted/20 ${className}`}
      aria-hidden
    />
  );
}

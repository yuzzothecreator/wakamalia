import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-secondary", className)}
      {...props}
    />
  )
}

export { Skeleton }

// Shadcn/ui Progress component (basic)
import * as React from "react";

const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => {
  return (
    <div ref={ref} className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className ?? ''}`} {...props}>
      <div
        className="h-full bg-gray-800 transition-all"
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };

import React from "react";

interface Props {
  children: React.ReactNode;
}

export function AppContainer({ children }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {children}
    </div>
  )
}

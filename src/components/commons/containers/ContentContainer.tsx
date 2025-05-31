import React, { type ReactNode } from "react";

interface ContentContainersProps {
  children: ReactNode;
}


const ContentContainer: React.FC<ContentContainersProps> = ({children}) => {
  return <div className="max-w-[900px] mx-auto p-[20px]">{children}</div>;
};

export default ContentContainer;

import React from "react";

// Define the allowed HTML tags explicitly to exclude SVG elements
type HtmlTag = "h1" | "h2" | "h3" | "h4" | "p" | "small" | "span";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "small" | "caption";

interface ThemedTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  className?: string;
  numberOfLines?: number;
  multiline?: boolean;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = "body",
  className,
  numberOfLines,
  multiline = false,
  children,
  ...rest
}) => {
  const getVariantStyle = (variant: TextVariant): string => {
    const baseStyles = "text-neutral-text-secondary";
    switch (variant) {
      case "h1":
        return `${baseStyles} text-3xl font-bold leading-9`;
      case "h2":
        return `${baseStyles} text-2xl font-semibold leading-7`;
      case "h3":
        return `${baseStyles} text-lg font-semibold leading-6`;
      case "h4":
        return `${baseStyles} text-base font-semibold leading-5`;
      case "body":
        return `${baseStyles} text-sm font-normal leading-5`;
      case "small":
        return `text-neutralTextTertiary text-xs font-normal leading-4.5`;
      case "caption":
        return `text-neutralTextTertiary text-xs font-normal leading-4 tracking-wider`;
      default:
        return `${baseStyles} text-sm font-normal leading-5`;
    }
  };

  const textStyle = `${getVariantStyle(variant)} ${
    multiline ? "text-left" : ""
  } ${className || ""}`.trim();

  const getElementTag = (variant: TextVariant): HtmlTag => {
    switch (variant) {
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      case "h3":
        return "h3";
      case "h4":
        return "h4";
      case "body":
        return "p";
      case "small":
        return "small";
      case "caption":
        return "span";
      default:
        return "p";
    }
  };

  const Tag = getElementTag(variant);

  return (
    <Tag
      style={{ WebkitLineClamp: multiline ? undefined : numberOfLines }}
      className={textStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default ThemedText;

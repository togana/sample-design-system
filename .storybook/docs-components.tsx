import type { ComponentPropsWithoutRef } from "react";
import { styled } from "@styled/jsx";

const DocsContainerBase = styled("div", {
  base: {
    maxWidth: "[48rem]",
    paddingBlock: "8",
    display: "flex",
    flexDirection: "column",
    gap: "5",
  },
});

export function DocsContainer({
  className,
  color: _color,
  translate: _translate,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <DocsContainerBase
      {...props}
      className={`sb-unstyled${className ? ` ${className}` : ""}`}
    />
  );
}

export const DocsTitle = styled("h1", {
  base: { fontSize: "threeExtraLarge", fontWeight: "bold", color: "surface.on" },
});

export const DocsHeading = styled("h2", {
  base: { fontSize: "extraLarge", fontWeight: "bold", color: "surface.on" },
});

export const DocsCaption = styled("p", {
  base: { color: "surface.onVariant", fontSize: "small" },
});

export const DocsDivider = styled("hr", {
  base: {
    borderBlockStart: "[1px solid]",
    borderColor: "outline",
    marginBlock: "10",
  },
});

export const DocsLabel = styled("span", {
  base: {
    color: "surface.onVariant",
    fontSize: "medium",
    fontWeight: "regular",
    flexShrink: "0",
  },
});

export const DocsSizeLabel = styled("span", {
  base: {
    color: "surface.onVariant",
    fontSize: "medium",
    fontWeight: "regular",
    width: "8",
    textAlign: "right",
    flexShrink: "0",
  },
});

export const DocsRow = styled("div", {
  base: { display: "flex", alignItems: "center", gap: "6" },
});

export const DocsStateRow = styled("div", {
  base: { display: "flex", alignItems: "center", gap: "8" },
});

export const DocsVariantGroup = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "5" },
});

export const DocsText = styled("p", {
  base: { color: "surface.on", fontSize: "medium", lineHeight: "relaxed" },
});

export const DocsList = styled("ul", {
  base: {
    color: "surface.on",
    fontSize: "medium",
    lineHeight: "relaxed",
    paddingInlineStart: "6",
    display: "flex",
    flexDirection: "column",
    gap: "3",
    listStyleType: "disc",
  },
});

export const DocsTable = styled("table", {
  base: {
    fontSize: "medium",
    width: "full",
    borderCollapse: "collapse",
    "& th, & td": {
      padding: "2",
      textAlign: "left",
      borderBlockEnd: "1px solid",
      borderColor: "outline",
    },
    "& th": {
      fontWeight: "bold",
      color: "surface.on",
    },
    "& td": {
      color: "surface.onVariant",
    },
  },
});

export const DocsSubheading = styled("h3", {
  base: { fontSize: "large", fontWeight: "bold", color: "surface.on" },
});

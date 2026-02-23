import { styled } from "../styled-system/jsx";

export const DocsContainer = styled("div", {
  base: {
    maxWidth: "48rem",
    paddingBlock: "8",
    display: "flex",
    flexDirection: "column",
    gap: "2",
  },
});

export const DocsTitle = styled("h1", {
  base: { fontSize: "2xl", fontWeight: "bold", color: "text.primary" },
});

export const DocsHeading = styled("h2", {
  base: { fontSize: "lg", fontWeight: "bold", color: "text.primary" },
});

export const DocsCaption = styled("p", {
  base: { color: "text.secondary", fontSize: "sm" },
});

export const DocsDivider = styled("hr", {
  base: {
    borderBlockStart: "1px solid",
    borderColor: "border",
    marginBlock: "6",
  },
});

export const DocsLabel = styled("span", {
  base: {
    color: "text.secondary",
    fontSize: "xs",
    fontWeight: "medium",
    flexShrink: "0",
  },
});

export const DocsSizeLabel = styled("span", {
  base: {
    color: "text.secondary",
    fontSize: "xs",
    fontWeight: "medium",
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
  base: { display: "flex", flexDirection: "column", gap: "4" },
});

export const DocsText = styled("p", {
  base: { color: "text.primary", fontSize: "sm", lineHeight: "relaxed" },
});

export const DocsList = styled("ul", {
  base: {
    color: "text.primary",
    fontSize: "sm",
    lineHeight: "relaxed",
    paddingInlineStart: "6",
    display: "flex",
    flexDirection: "column",
    gap: "1",
    listStyleType: "disc",
  },
});

export const DocsTable = styled("table", {
  base: {
    fontSize: "sm",
    width: "100%",
    borderCollapse: "collapse",
    "& th, & td": {
      padding: "2",
      textAlign: "left",
      borderBlockEnd: "1px solid",
      borderColor: "border",
    },
    "& th": {
      fontWeight: "bold",
      color: "text.primary",
    },
    "& td": {
      color: "text.secondary",
    },
  },
});

export const DocsSubheading = styled("h3", {
  base: { fontSize: "md", fontWeight: "bold", color: "text.primary" },
});

import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const themeVariables = {
  darkMode: false,
  background: "#ffffff", // Keep background white
  fontFamily: "helvetica neue, helvetica, arial, sans-serif",
  fontSize: "16px",
  primaryColor: "#fff4dd", // This can be adjusted based on your design
  primaryTextColor: "#300266", // Dark Purple for primary text
  secondaryColor: "#c9c4ef", // Light Purple for secondary elements
  primaryBorderColor: "#300266", // Dark Purple for borders
  secondaryBorderColor: "#ffd4bc", // Light Orange for secondary borders
  noteBkgColor: "#ffe5b4", // Light Orange for note background
  noteTextColor: "#333333", // Keep note text black for readability
  noteBorderColor: "#ffa524", // Orange for note borders
  lineColor: "#300266", // Dark Purple for lines
  textColor: "#300266", // Dark Purple for text
  mainBkg: "#c9c4ef", // Light Purple for main background
  errorBkgColor: "#f8d3e8", // Light Pink for error background
  errorTextColor: "#91186e", // Dark Pink for error text
  actorBkg: "#c9c4ef", // Light Purple for actor background
  actorBorder: "#300266", // Dark Purple for actor border
  actorTextColor: "#300266", // Dark Purple for actor text
  actorLineColor: "#f8d3e8", // Light Pink for actor line
  signalColor: "#300266", // Dark Purple for signal color
  signalTextColor: "#300266", // Dark Purple for signal text
  labelBoxBkgColor: "#ffe0b2", // Lighter shade of Light Orange for label box background
  labelBoxBorderColor: "#ffd4bc", // Light Orange for label box border
  labelTextColor: "#300266", // Dark Purple for label text
  loopTextColor: "#300266", // Dark Purple for loop text
  activationBorderColor: "#91186E", // Dark Pink for activation border
  activationBkgColor: "#f8d3e8", // Light Pink for activation background
  sequenceNumberColor: "#300266", // Dark Purple for sequence number
  boxBorderOpacity: 0.1,
};

// Attach mermaid to the window object
window.mermaid = mermaid;

mermaid.initialize({
  theme: "default",
  themeVariables: themeVariables,
  startOnLoad: false, // Prevent automatic rendering on load
});

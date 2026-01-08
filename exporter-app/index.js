import * as monaco from "monaco-editor";
export var editor;

// Function to initialize the Monaco Editor
document.addEventListener("DOMContentLoaded", () => {
  // Initialize monaco-mermaid
  if (window.monacoMermaid) {
    window.monacoMermaid(monaco);
  }

  // Create the editor instance
  editor = monaco.editor.create(document.getElementById("editor-input"), {
    language: "mermaid",
    theme: "mermaid",
    wordWrap: "on",
    wrappingIndent: "indent",
    automaticLayout: true,
  });

  onEditorReady();
});

var originalSvgData = ""; // Variable to store the original SVG data
var panzoomInstance;

function onEditorReady() {
  // Function to update the Mermaid diagram
  window.updateDiagram = async function () {
    const input = editor.getValue();
    const diagramContainer = document.getElementById("mermaidDiagram");

    // Store the Mermaid code in local storage
    localStorage.setItem("mermaidCode", input);

    // Clear the previous diagram
    diagramContainer.innerHTML = "";

    // Render the new diagram using mermaid.render
    try {
      const { svg } = await mermaid.render("diagramId", input);
      diagramContainer.innerHTML = svg;
      originalSvgData = svg;
      
      // Select the SVG inside the div
      const svgElement = diagramContainer.querySelector("svg");
      if (!svgElement) {
        throw new Error("SVG element not found after rendering");
      }

      // Set the SVG to fill the container
      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");

      // Initialize Panzoom on the newly rendered SVG element
      panzoomInstance = Panzoom(svgElement, {
        maxScale: 5,
        minScale: 0.5,
        contain: "outside",
        startScale: 1,
        startX: 0,
        startY: 0,
        step: 0.2,
      });

      // Add event listeners for zooming and panning
      diagramContainer.addEventListener("wheel", panzoomInstance.zoomWithWheel);
    } catch (error) {
      console.error("Error rendering diagram:", error);
      diagramContainer.innerHTML = `<div style="color: red; padding: 20px;">Error rendering diagram: ${error.message}</div>`;
    }
  };

  // Function to get Mermaid code from URL parameter or localStorage
  function getMermaidCode() {
    // First, check for URL parameter (takes precedence)
    const urlParams = new URLSearchParams(window.location.search);
    let encodedCode = urlParams.get("code");
    
    if (encodedCode) {
      try {
        // URLSearchParams may not fully decode, so decode again to handle +, /, = characters
        // that might be URL-encoded in the Base64 string
        encodedCode = decodeURIComponent(encodedCode);
        // Now decode Base64
        const decodedCode = atob(encodedCode);
        return decodedCode;
      } catch (error) {
        console.error("Error decoding diagram from URL:", error);
        // Fall back to localStorage if decoding fails
      }
    }
    
    // Fall back to localStorage if no URL parameter
    return localStorage.getItem("mermaidCode");
  }

  // Retrieve the Mermaid code and set it in the editor
  const storedCode = getMermaidCode();
  if (storedCode) {
    editor.setValue(storedCode);
    updateDiagram();
  }

  // Retrieve the font size from local storage and set it in the dropdown
  const storedFontSize = localStorage.getItem("fontSize");
  if (storedFontSize) {
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    fontSizeSelect.value = storedFontSize; // Set the dropdown to the stored font size
    updateFontSize(); // Update the editor font size
  }

  document
    .getElementById("renderButton")
    .addEventListener("click", updateDiagram);
  document
    .getElementById("exportSvgButton")
    .addEventListener("click", exportSvg);
  document
    .getElementById("exportPngButton")
    .addEventListener("click", exportPng);

  // Add event listener for font size dropdown
  document
    .getElementById("fontSizeSelect")
    .addEventListener("change", updateFontSize);

  // Add event listeners to the buttons
  document.getElementById("zoomIn").addEventListener("click", zoomIn);
  document.getElementById("zoomOut").addEventListener("click", zoomOut);

  // Function to zoom in
  function zoomIn() {
    const scaleFactor = 1.25; // Adjust the scale factor as needed
    panzoomInstance.zoomIn({ scale: scaleFactor });
  }

  // Function to zoom out
  function zoomOut() {
    const scaleFactor = 0.75; // Adjust the scale factor as needed
    panzoomInstance.zoomOut({ scale: scaleFactor });
  }

  // Function to export diagram as SVG
  function exportSvg() {
    if (!originalSvgData) {
      alert("No diagram to export! Please render a diagram first.");
      return;
    }
    const blob = new Blob([originalSvgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Function to export diagram as PNG
  function exportPng() {
    if (!originalSvgData) {
      alert("No diagram to export! Please render a diagram first.");
      return;
    }

    // Create an image element
    const img = new Image();

    // Set the SVG string as the source of the image
    img.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(originalSvgData);

    img.onload = function () {
      // Create a temporary SVG element to extract dimensions
      const tempSvg = new DOMParser().parseFromString(
        originalSvgData,
        "image/svg+xml"
      ).documentElement;

      // Extract the viewBox attribute
      const viewBox = tempSvg.getAttribute("viewBox");
      if (!viewBox) {
        console.error("No viewBox found in SVG!");
        return;
      }

      // Parse the viewBox values
      const [minX, minY, viewBoxWidth, viewBoxHeight] = viewBox
        .split(" ")
        .map(Number);

      // Define the scale factor for higher resolution
      const scaleFactor = 3;

      // Calculate scaled dimensions
      const width = viewBoxWidth * scaleFactor;
      const height = viewBoxHeight * scaleFactor;

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions to the scaled dimensions
      canvas.width = width;
      canvas.height = height;

      // Scale the context to the desired resolution
      context.scale(scaleFactor, scaleFactor);

      // Draw the image onto the canvas using viewBox dimensions
      context.drawImage(img, minX, minY, viewBoxWidth, viewBoxHeight);

      // Convert the canvas to a PNG data URL
      canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "diagram.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    img.onerror = function () {
      console.error("Failed to load SVG as image");
    };
  }

  // Function to update the font size of the editor input
  function updateFontSize() {
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const newFontSize = fontSizeSelect.value;
    editor.updateOptions({ fontSize: newFontSize });
    localStorage.setItem("fontSize", newFontSize);
  }
}

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
    // Check for mermaid (could be window.mermaid or just mermaid depending on build)
    const mermaidLib = window.mermaid || (typeof mermaid !== 'undefined' ? mermaid : null);
    
    if (!mermaidLib) {
      const diagramContainer = document.getElementById("mermaidDiagram");
      diagramContainer.innerHTML = `<div style="color: red; padding: 20px;">Error: Mermaid library not loaded. Please refresh the page.</div>`;
      console.error("Mermaid library not available. Check browser console for loading errors.");
      return;
    }

    const input = editor.getValue();
    const diagramContainer = document.getElementById("mermaidDiagram");

    // Store the Mermaid code in local storage
    localStorage.setItem("mermaidCode", input);

    // Clear the previous diagram
    diagramContainer.innerHTML = "";

    // Render the new diagram using mermaid.render
    try {
      const { svg } = await mermaidLib.render("diagramId", input);
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
    // Wait a bit for mermaid to be ready before auto-rendering
    setTimeout(() => {
      const mermaidLib = window.mermaid || (typeof mermaid !== 'undefined' ? mermaid : null);
      if (mermaidLib) {
        updateDiagram();
      } else {
        console.warn("Mermaid not ready yet, diagram will render when you click 'Render Diagram'");
      }
    }, 500);
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

    const diagramContainer = document.getElementById("mermaidDiagram");
    const svgElement = diagramContainer.querySelector("svg");
    
    if (!svgElement) {
      alert("SVG element not found. Please render the diagram first.");
      return;
    }

    // Detect diagram type by checking the SVG structure
    // Sequence diagrams typically have a viewBox and work better with the original method
    // Flowcharts may have foreignObject elements and need html2canvas
    const viewBox = svgElement.getAttribute("viewBox");
    const hasForeignObject = svgElement.querySelector("foreignObject") !== null;
    
    // For sequence diagrams (have viewBox, no foreignObject), use original method
    // For flowcharts (may have foreignObject), use html2canvas
    if (viewBox && !hasForeignObject) {
      // Use original method for sequence diagrams - more accurate dimensions
      tryOriginalPngExport();
    } else if (typeof html2canvas !== 'undefined') {
      // Use html2canvas for flowcharts with foreignObject
      // Ensure the container is visible and in viewport
      diagramContainer.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      
      // Wait a moment for any layout changes
      setTimeout(() => {
        // Use html2canvas to capture the SVG element directly (not container)
        // This avoids capturing extra whitespace
        const rect = svgElement.getBoundingClientRect();
        
        html2canvas(svgElement, {
          backgroundColor: '#ffffff',
          scale: 3, // Higher resolution
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: rect.width,
          height: rect.height
        }).then(function(canvas) {
          canvas.toBlob(function(blob) {
            if (!blob) {
              // Fallback to original method
              tryOriginalPngExport();
              return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "diagram.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, "image/png", 1.0);
        }).catch(function(error) {
          console.error("html2canvas failed, trying fallback:", error);
          tryOriginalPngExport();
        });
      }, 100);
    } else {
      // Fallback to original method
      tryOriginalPngExport();
    }

    // Original method - works well for sequence diagrams
    function tryOriginalPngExport() {
      try {
        const tempSvg = new DOMParser().parseFromString(
          originalSvgData,
          "image/svg+xml"
        ).documentElement;

        const viewBox = tempSvg.getAttribute("viewBox");
        if (!viewBox) {
          alert("Unable to export as PNG. This diagram type may not support PNG export.\n\nPlease export as SVG instead.");
          return;
        }

        const [minX, minY, viewBoxWidth, viewBoxHeight] = viewBox
          .split(" ")
          .map(Number);

        const scaleFactor = 3;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewBoxWidth * scaleFactor;
        canvas.height = viewBoxHeight * scaleFactor;

        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.scale(scaleFactor, scaleFactor);

        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = function () {
          context.drawImage(img, minX, minY, viewBoxWidth, viewBoxHeight);
          canvas.toBlob(function (blob) {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "diagram.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            } else {
              alert("PNG export failed. This may be due to browser security restrictions.\n\nPlease export as SVG instead.");
            }
          }, "image/png", 1.0);
        };
        
        img.onerror = function (error) {
          alert("PNG export is not supported for this diagram type (flowcharts with complex styling).\n\nPlease export as SVG instead.");
          console.error("Failed to load SVG as image:", error);
        };
        
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(originalSvgData);
      } catch (error) {
        alert("PNG export failed: " + error.message + "\n\nPlease export as SVG instead.");
        console.error("Error in PNG export:", error);
      }
    }
  }

  // Function to update the font size of the editor input
  function updateFontSize() {
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const newFontSize = fontSizeSelect.value;
    editor.updateOptions({ fontSize: newFontSize });
    localStorage.setItem("fontSize", newFontSize);
  }
}

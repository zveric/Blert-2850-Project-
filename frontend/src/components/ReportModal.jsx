import { useState } from "react";
import jsPDF from "jspdf"; //used ClaudeAI to find the documentation for this library & learn to implement functions in the library
import html2canvas from "html2canvas"; //used ClaudeAI to find the documentation for this library & learn to implement functions in the library

function ReportModal({
  onClose,
  tempChartRef,
  activityChartRef,
  scatterChartRef,
  ActivityPatternRef,
  GrazingHeatmapRef,
}) {
  const [options, setOptions] = useState({
    map: true,
    temperatureChart: true,
    activityChart: true,
    scatterChart: true,
    ActivityPattern: true,
    GrazingHeatmap: true,
    farmerNotes: true,
  });

  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  const toggle = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  async function generateReport() {
    console.log("generatereport called");
    setGenerating(true);
    console.log("tempChartRef:", tempChartRef);
    console.log("tempChartRef.current: ", tempChartRef?.current);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      let y = 15;

      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text("BLERT Livestock Report", pageWidth / 2, y, { align: "center" });
      y += 8;

      pdf.setFontSize(13);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, y, {
        align: "center",
      });
      y += 12;

      const addChart = async (ref, label) => {
        if (y > 220) {
          pdf.addPage();
          y = 15;
        }
        pdf.setFontSize(13);
        pdf.setTextColor(40, 40, 40);
        pdf.text(label, 14, y);
        y += 5;

        try {
          const Canvas = ref.current.querySelector("canvas");
          console.log("canvas found:", Canvas);
          console.log("canvas width:", Canvas?.width);
          const imgData = Canvas.toDataURL("image/png");
          console.log("imgData length:", imgData?.length);
          const imgWidth = pageWidth - 28;
          const imgHeight = Math.min(
            (Canvas.height * imgWidth) / Canvas.width,
            80,
          );
          pdf.addImage(imgData, "PNG", 14, y, imgWidth, imgHeight);
          y += imgHeight + 8;
        } catch {
          pdf.text("Chart could not be captured.", 14, y);
          y += 8;
        }
      };

      if (options.map && GrazingHeatmapRef?.current) {
        if (y > 220) {
          pdf.addPage();
          y = 15;
        }
        pdf.setFontSize(13);
        pdf.setTextColor(40, 40, 40);
        pdf.text("Grazing Heatmap", 14, y);
        y += 5;

        try {
          const mapEl =
            GrazingHeatmapRef.current.querySelector(".leaflet-container");
          mapEl.scrollIntoView();
          await new Promise((r) => setTimeout(r, 500));
          console.log("mapEl found:", mapEl); // used claudeAI to aid debugging
          console.log("grazingheatmapRef.current:", GrazingHeatmapRef.current); //used claudeAI to aid debugging
          //used claude to understand CORS, and how it effects html2canvas to take the screenshot of the heatmap
          const canvas = await html2canvas(mapEl, {
            useCORS: true,
            allowTaint: true,
            logging: false,
            scale: 2,
            width: mapEl.offsetWidth,
            height: mapEl.offsetHeight,
          });

          console.log("canvas generated: ", canvas); //used claudeAI to aid debugging

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = pageWidth - 28;
          const imgHeight = 130;
          if (y + imgHeight > 270) {
            pdf.addPage();
            y = 15;
          }
          pdf.addImage(imgData, "PNG", 14, y, imgWidth, imgHeight);
          y += imgHeight + 8;
        } catch (err) {
          console.error(" Map capture error:", err); //used claudeAI to aid debugging
          pdf.text(" Map could not be captured.", 14, y);
          y += 8;
        }
      }

      if (options.temperatureChart && tempChartRef?.current)
        await addChart(tempChartRef, "Ambient Temperature");

      if (options.activityChart && activityChartRef?.current)
        await addChart(activityChartRef, "Activity and Acceleration");

      if (options.scatterChart && scatterChartRef?.current)
        await addChart(scatterChartRef, "Temperature vs Activity Level");

      if (options.ActivityPattern && ActivityPatternRef?.current)
        await addChart(ActivityPatternRef, "Avg Activity Level by Hour");

      if (options.farmerNotes && notes.trim()) {
        if (y > 220) {
          pdf.addPage();
          y = 15;
        }
        pdf.setFontSize(13);
        pdf.setTextColor(40, 40, 40);
        pdf.text("Additional Notes", 14, y);
        y += 6;
        pdf.setFontSize(10);

        const lines = pdf.splitTextToSize(notes, pageWidth - 28);
        pdf.text(lines, 14, y);
      }

      pdf.save("Blert Livestock Report.pdf");
    } catch (err) {
      console.error("Report Generation Failed:", err);
      alert("Report generation failed. Please Try Again.");
    }
    setGenerating(false);
    onClose();
  }
  //used ClaudeAI to generate the style
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const modalStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    width: "420px",
    boxShadow: " 0 8px 32px rgba(0,0,0,0.2)",
  };

  const checkboxRow = (label, key) => (
    <label
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={options[key]}
        onChange={() => toggle(key)}
      />
      {label}
    </label>
  );

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "16px" }}> Generate Report </h2>

        <p style={{ fontWeight: 600, marginBottom: "8px" }}>
          Include in report:
        </p>
        {checkboxRow("Temperature Chart", "temperatureChart")}
        {checkboxRow("Activity Chart", "activityChart")}
        {checkboxRow("Temperature vs Activity", "scatterChart")}
        {checkboxRow("Activity by Hour", "ActivityPattern")}
        {checkboxRow("Grazing Heatmap", "map")}
        {checkboxRow("Additional Notes", "farmerNotes")}
        {options.farmerNotes && (
          <textarea
            placeholder="Additional Information:"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              marginTop: "8px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "13px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #dddddd",
              background: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={generateReport}
            disabled={generating}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#000000",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {generating ? "Generating..." : " Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;

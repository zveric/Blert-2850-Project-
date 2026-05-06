import {useEffect, useState} from 'react'
import jsPDF from 'jspdf'
import { getReadings } from '../api';  


function ReportModal ({ onClose, tempChartRef, activityChartRef}) {
     
    const [options, setOptions] = useState( {


        map: true, 
        temperatureChart: true, 
        activityChart: true, 
        farmerNotes: true, 
    }); 


    const [notes, setNotes] = useState('');
    const [generating, setGenerating] = useState(false); 
    const [readingsA, setReadingsA] = useState(([])); 
    const [readingsB, setReadingsB] = useState([]); 

    useEffect(() => {
        Promise.all([getReadings(50,1), getReadings(50,2)])
        .then (([dataA, dataB]) => {
        if (dataA) setReadingsA(dataA);
        if (dataB) setReadingsB(dataB); 

    }); 
    }, []); 

    const readings = [...readingsA, ...readingsB];

    const toggle = (key) => setOptions(prev => ({ ...prev, [key]: !prev[key]})); 

    
    async function generateReport() { 
        console.log('generatereport called'); 
        setGenerating(true); 
        console.log('tempChartRef:', tempChartRef); 
        console.log('tempChartRef.current: ', tempChartRef?.current);

        try{
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            const pageWidth = pdf.internal.pageSize.getWidth(); 
            let y = 15; 


            pdf.setFontSize(20); 
            pdf.setTextColor(40,40,40); 
            pdf.text("BLERT Livestock Report", pageWidth / 2, y, {align: 'center'}); 
            y+=8; 

            pdf.setFontSize(13); 
            pdf.setTextColor(100, 100, 100); 
            pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth/ 2, y,{ align: 'center'})
            y+=12; 


            //for heatmap 
            // if (options.map && mapRef?.current) {
            //     if (y > 220) { pdf.addPage() ; y = 15; } 
            //     pdf.setFontSize(13); 
            //     pdf.text('Ambient Temperature', 14, y); 
            //     y+=5; 

            //     try { 
            //         const chartCanvas = tempChartRef.current.querySelector('canvas');
            //         const imgData = chartCanvas.toDataURL('image/png'); 
            //         const imgWidth = pageWidth - 28; 
            //         const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width; 
            //         pdf.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight); 
            //         y+= imgHeight + 8; 
            //     } catch (err) {
            //         pdf.text ('Chart could not be captured.', 14, y); ;
            //         y+=8; 
            //     }
            // }


            //for temperature charts
            if (options.temperatureChart && tempChartRef?.current) { 

                if (y > 220) { pdf.addPage() ; y = 15; } 
                pdf.setFontSize(13); 
                pdf.text('Ambient Temperature', 14, y); 
                y+=5; 

                try { 
                    const chartCanvas = tempChartRef.current.querySelector('canvas');
                    console.log('canvas found:', chartCanvas); 
                    console.log('canvas width:', chartCanvas?.width);
                    const imgData = chartCanvas.toDataURL('image/png'); 
                    console.log('imgData length:', imgData?.length); 
                    const imgWidth = pageWidth - 28; 
                    const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width; 
                    pdf.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight); 
                    y+= imgHeight + 8; 
                } catch (err) {
                    pdf.text ('Chart could not be captured.', 14, y); ;
                    y+=8; 
                }
            }

            //for acitvity charts 

            if (options.activityChart && activityChartRef?.current) {
                if (y > 220) { pdf.addPage() ; y = 15; } 
                pdf.setFontSize(13); 
                pdf.text('Activity and Acceleration', 14, y); 
                y+=5; 

                try { 
                    const chartCanvas = activityChartRef.current.querySelector('canvas');
                    console.log('canvas found:', chartCanvas); 
                    console.log('canvas width:', chartCanvas?.width);
                    const imgData = chartCanvas.toDataURL('image/png'); 
                    console.log('imgData length:', imgData?.length); 
                    const imgWidth = pageWidth - 28; 
                    const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width; 
                    pdf.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight); 
                    y+= imgHeight + 8; 
                } catch (err) {
                    pdf.text ('Chart could not be captured.', 14, y); ;
                    y+=8; 
                }
            }


            if(options.farmerNotes && notes.trim()) {
                if (y> 220) {pdf.addPage(); y = 15;}
                pdf.setFontSize(13); 
                pdf.setTextColor(40,40,40); 
                pdf.text('Additional Notes', 14, y); 
                y+=6; 
                pdf.setFontSize(10); ;

                const lines = pdf.splitTextToSize(notes, pageWidth - 28);
                pdf.text(lines, 14,y);

            }


            pdf.save('Blert Livestock Report.pdf'); 
        } catch(err) {
            console.error('Report Generation Failed:', err ); 
            alert('Report generation failed. Please Try Again.'); 
        }
        setGenerating(false); 
        onClose(); 
    }

    const overlayStyle = {
        position: 'fixed', top:0, left: 0, 
        width: '100vw', height : '100vh',
        background: "rgba(0,0,0,0.5)", 
        display: 'flex', alignItems: 'center', 
        justifyContent: 'center', zIndex: 9999, 
    }

    const modalStyle = {
        background: 'white', borderRadius: '16px', 
        padding: '28px', width: '420px',
        boxShadow: ' 0 8px 32px rgba(0,0,0,0.2)', 
    }; 

    const checkboxRow = (label, key) => (
        <label key= {key} style= {{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer'}}> 
            <input type = "checkbox" checked = {options[key]} onChange = {() => toggle(key)}/> 
            {label}
        </label>
    ); 

    return(

        <div style={overlayStyle} onClick = {onClose}> 
            <div style= {modalStyle} onClick = {e => e.stopPropagation()}>
                <h2 style = {{marginBottom: '16px'}} > Generate Report </h2> 

                <p style = {{ fontWeight: 600, marginBottom: '8px'}}> Include in report: </p>
                {/* {checkboxRow( "Heatmap", 'map')} */}
                {checkboxRow( "Temperature Chart", "temperatureChart")}
                {checkboxRow( "Activity Chart", "activityChart")}
                {checkboxRow( "Additional Notes", "farmerNotes")}
                {options.farmerNotes && (

                    <textarea 
                        placeholder='Additional Information:'
                        value = {notes} 
                        onChange = {e => setNotes(e.target.value)}
                        style = {{
                            width: '100%', height: '100px', 
                            marginTop: '8px', padding: '10px', 
                            borderRadius: '8px', border: '1px solid #ddd', 
                            fontSize: '13px', resize: 'vertical', 
                            boxSizing: 'border-box'
                        }}
                    />
                )}

                <div style = {{display: 'flex', gap: '10px', marginTop: '20px'}} > 
                    <button onClick = {onClose} style = {{
                        flex: 1, padding: '10px', borderRadius: '8px',
                        border: '1px solid #dddddd', background: 'white',
                        cursor: 'pointer', fontSize: '14px'
                    }}> 
                        Cancel
                    </button>
                    <button onClick = {generateReport} disabled = {generating} style = {{

                        flex: 1, padding: '10px', borderRadius: '8px', 
                        border: 'none', background: '#000000', 
                        color: 'white', cursor: 'pointer', fontSize: '14px'
                    }}> 
                        {generating? 'Generating...' : ' Download PDF'}
                    </button>

                </div>
            </div> 
        </div>
    );  

}

export default ReportModal; 
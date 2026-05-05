import {useState} from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'


function ReportModal ({ onClose, mapRef, temperatureChartRef, activityChartRef, readings}) {
     
    const [options, setOptions] = useState( {


        map: true, 
        temperatureChart: true, 
        activityChart: true, 
        breachSummary: true, 
        rawDataTable: true, 
        farmerNotes: true, 
    }); 


    const [notes, setNotes] = useState('');
    const [generate, setGenerate] = useState(false); 

    const toggle = (key) => setOptions(prev => ({ ...prev, [key]: !prev[key]})); 

    async function generateReport() { 

        setGenerating(true); 
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

        if (options.map && mapRef?.current) {
            pdf.setFontSize(13); 
            pdf.setTextColor(40,40,40); 
            pdf.text(`Movement Map`, 14, y); 
            y+=5; 


            try { 
                const canvas = await html2canvas(mapRef.current, {useCORS: true}); 
                const imgData = canvas.toDataURL('image/png'); 
                const imgWidth = pageWidth - 28; 
                const imgHeight = (canvas.height * imgWidth) / canvas.width; 
                pdf.addImage(imgData, 'PNG', 14, y, imgWidth,imgHeight);
                y+=imgHeight + 8; 

            }catch (err) {
                pdf.text("Map could not be captured.", 14,y); 
                y+=8; 
            }
        }

        if (options.temperatureChart && temperatureChartRef?.current) { 

            if (y > 220) { pdf.addPage() ; y = 15; } 
            pdf.setFontSize(13); 
            pdf.text('Ambient Temperature', 14, y); 
            y+=5; 

            try { 
                const canvas = await html2canvas(temperatureChartRef.current); 
                const imgData = canvas.toDataURL('image/png'); 
                const imgWidth = pageWidth - 28; 
                const imgHeight = (canvas.height * imgWidth) / canvas.width; 
                pdf.addImage(imgData, 'PNG', 14, y, imgWidth, imgHeight); 
                y+= imgHeight + 8; 
            } catch (err) {
                pdf.text ('Chart could not be captured.', 14, y); ;
                y+=8; 
            }

        }

         if (options.breachSummary && readings) { 

            if (y > 220) { pdf.addPage() ; y = 15; } 
            pdf.setFontSize(13); 
            pdf.text('Breach Event Summary', 14, y); 
            y+=6; 
            pdf.setFontSize(10);  

            const breaches = readings.filter(r => r.status ! ==  ' normal'); 
            if (breaches.length === 0) {

                pdf.text('No Breach Events Recorded', 14, y);
                y+=6; 

            }else { 
                breaches.forEach(b => { 
                    pdf.text(` ${b.timestamp} - Status : ${b.status}`, 14, y); 
                    y+=5;

                });
            }
            y += 4; 
        }

        if (options.rawDataTable && readings0 { 
            if (y > 220) {pdf.addPage(); y = 15; } 
            pdf.setFontSize(13); 
            pdf.text ('Raw Data' , 14, y); 
            y+=6; 
            pdf.setFontSize(13); 
            pdf.text('Raw Data', 14, y); 
            y+=6; 
            pdf.setFontSize(8); 
            pdf.setTextColor(80, 80, 80); 
            pdf.text(' Timestamp', 14, y); 
            pdf.text('Accel (g)', 80,y); 
            pdf.text('Temp (Celcius)', 120, y); 
            pdf.text('Status', 160, y); 
            y+=4; 

            pdf.line(14, y, pageWidth = 14, y); 
            y+=3; 
            readings.slice(0,30).forEach(r => {
                if( y > 270) {pdf.addPage(); y = 15; }
                pdf.text(r.timestamp?.slice(0,19) ?? '-', 14, y); 
                pdf.text(String.apply(r.accel_mag_g ?? '-'), 80, y); 
                pdf.text(String.apply(r.ambient_temperature_c ?? '-'), 120, y); 
                pdf.text(r.status ?? '-', 160, y); 
                y+=5; 
            }); 
            y+=4;
        }


        if(options.farmerNotes & notes.trim()) {
            if (y> 220) {pdf.addPage(); y = 15;}
            pdf.setFontSize(13); 
            pdf.setTextColor(40,40,40); 
            pdf.text('Farmer Notes', 14, y); 
            y+=6; 
            pdf.setFontSize(10); ;

            const lines = pdf.splitTextToSize(notes, pageWidth - 28);
            pdf.text(lines, 14,y);

        }


        pdf.save('Blert Livestock Report.pdf'); 
        setGenerating(false); 
        onClose(); 
    }

    const overlayStyle = {
        position: 'fixed', top:0, left: 0, 
        width: '100vw'
    }

}
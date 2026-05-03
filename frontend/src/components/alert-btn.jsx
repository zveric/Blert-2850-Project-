import {useState} from 'react'; 

function AlertBtn() {

    const scrollRef = useState(null)[0]; 
    const [alerts, setAlerts] = useState([]);

    const handleAlert = () => {
        const newAlert = {
            dateTime: new Date().toLocaleString(), 
            message : "Manual Alert Triggered",
        };  
        setAlerts((prev) => [newAlert, ...prev]); 

        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0; 
        }
    }; 
        
    return (
        <div style = {cardStyle}>
            <p style = {{fontSize: "18px", fontWeight: "bold", marginBottom: "8px"}}>
                PRESS TO TRIGGER ALERT
            </p>

            <div style = {{display: "flex", alignItems: "flex-start", gap: "16px"}}>
                <button 
                    onClick={handleAlert}
                    style = {buttonStyle}
                />
                
            <div style = {{maxHeight: "150px", overflowY: "auto", width: "100%"}}>
                <table style = {{borderCollapse: "collapse", width: "100%"}}>
                    <thead> 
                        <tr> 
                            <th style = {thStyle}>Date & Time</th>
                            <th style = {thStyle}>Alerts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.length == 0 ? (
                            <tr> 
                                <td colSpan="2" style = {{textAlign: "center", padding: "16px", color: "#888"}}>
                                    No Alerts Triggered Yet
                                </td>
                            </tr>
                        ) : ( 
                            alerts.map((alert, i) => (
                                <tr key= {i}>
                                    <td style = {tdStyle}>{alert.dateTime}</td>
                                    <td style = {tdStyle}>{alert.message}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
        </div>
    </div>
    </div>
    );
}

const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    padding: "20px",
    display: "inline-block",
    minWidth: "360px",
    maxHeight: "250px",
    overflow: "hidden",
}; 

const buttonStyle = {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    backgroundColor: "#e53935",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    fontSize: "28px",
    boxShadow: "0 4px 12px rgba(229,57,53,0.5)", 
    transition: "transform 0.1s, box-shadow 0.1s",
};

const thStyle = {
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    paddingBottom: "4px",
    paddingRight: "12px",
    color: "#888",
    fontWeight: "500",
    fontSize: "12px",
}; 

const tdStyle = {
    paddingTop: "6px",
    paddingRight: "12px",
    verticalAlign: "top",
    fontSize: "12px",
    borderBottom: "1px solid #eee",
}; 

export default AlertBtn
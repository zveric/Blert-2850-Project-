import { useState, useEffect, useRef } from "react";
import { getReadings } from "../api";


const check_interval = 5000 
const livestock_id = [1,2]
const readings_limit = 10 


export default function AlertSystem() {

    const [smsModal, setSmsModal] = useState(null)
    const[phoneNumber, setPhoneNumber] = useState("")
    const[smsMessage, setSmsMessage] = useState("")
    const[smsSending, setSmsSending] = useState(false)
    const[smsSent, setSmsSent] = useState(false) 
    const[smsError, setSmsError] = useState("")

    const[alertModal, setAlertModal] = useState(null)

    const triggeredSMS = useRef(new Set()) 
    const triggeredAlert = useRef(new Set())


    useEffect(() => { 

        
    })
    
}
import { useState, useEffect, useRef } from "react";
import { getReadings, getToken } from "../api";

const check_interval = 5000;
const livestock_id = [1, 2];
const readings_limit = 10;

export default function AlertSystem({ manualTrigger, onManualClose }) {
  const [smsModal, setSmsModal] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState("");

  const [alertModal, setAlertModal] = useState(null);

  const triggeredSMS = useRef(new Set());
  const triggeredAlert = useRef(new Set());

  // FIX: Use a ref to track the previous value of manualTrigger so we can
  // detect a rising edge (false -> true) inside a useEffect, keeping all
  // setState calls and ref reads/writes out of the render path.
  const prevManualTrigger = useRef(false);
  useEffect(() => {
    if (manualTrigger && !prevManualTrigger.current) {
      setSmsModal({
        latitude: -32.778657,
        longitude: 26.836552,
        livestockId: "2",
      });
      setSmsMessage(
        `MANUAL ALERT: Livestock activity requires attention.\n` +
          `Location: Lat -32.778657, Lng 26.836552\n` +
          `Time: ${new Date().toLocaleString()}`,
      );
      onManualClose();
    }
    prevManualTrigger.current = manualTrigger;
  }, [manualTrigger, onManualClose]);

  useEffect(() => {
    const poll = async () => {
      for (const id of livestock_id) {
        try {
          const readings = await getReadings(readings_limit, id);
          if (!Array.isArray(readings)) continue;

          for (const reading of readings) {
            if (
              reading.alert &&
              !triggeredSMS.current.has(reading.id) &&
              !triggeredAlert.current.has(reading.id)
            ) {
              try {
                const alertRes = await fetch(reading.alert, {
                  headers: { Authorization: `Token ${getToken()}`},
                });
                const alertData = await alertRes.json();

                const isFlee = alertData.alert_flee === 1;
                const isGeofence = alertData.alert_geofence === 1;
                //const isTriggered = alertData.alert_triggered === 1

                if (
                  (isFlee || isGeofence) &&
                  !triggeredAlert.current.has(reading.id)
                ) {
                  triggeredAlert.current.add(reading.id);

                  setAlertModal(
                    (prev) =>
                      prev ?? {
                        type: isFlee ? "flee" : "geofence",
                        latitude: reading.latitude,
                        longitude: reading.longitude,
                        livestockId: id,
                        timestamp: reading.timestamp,
                      },
                  );
                }
              } catch (e) {
                console.error("Failed to fetch alert details:", e);
              }
            }
          }
        } catch (err) {
          console.error(`AlertSystem pollling error for livestock ${id}:`, err);
        }
      }
    };

    poll();
    const timer = setInterval(poll, check_interval);
    return () => clearInterval(timer);
  }, []);

  const handleSendSMS = async () => {
    if (!phoneNumber.trim() || !smsMessage.trim()) return;
    setSmsSending(true);
    setSmsError("");

    try {
      const res = await fetch("/api/sms/send/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          "Authorization": `Token ${getToken()}` ,
        },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          message: smsMessage.trim(),
        }),
      });

      if (res.ok) {
        setSmsSent(true);
        setTimeout(() => {
          setSmsModal(null);
          setSmsSent(false);
          setPhoneNumber("");
          setSmsMessage("");
        }, 2500);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSmsError(
          errData.detail || "Failed to send SMS. Check you connection.",
        );
      }
    } catch (err) {
      setSmsError("Network error. Backend Running?");
      console.error("SMS send error:", err);
    } finally {
      setSmsSending(false);
    }
  };

  const closeAlert = () => setAlertModal(null);
  const closeSMS = () => {
    setSmsModal(null);
    setPhoneNumber("");
    setSmsMessage("");
    setSmsError("");
    setSmsSent(false);
  };

  return (
    <>
      {alertModal && (
        <div style={s.backdrop} onClick={closeAlert}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                ...s.modalHeader,
                background: alertModal.type === "flee" ? "#7c2d12" : "#1e3a5f",
              }}
            >
              <span style={s.headerIcon}>{alertModal.type === "Flee"}</span>
              <span style={s.headerTitle}>
                {alertModal.type === "flee"
                  ? "Flee Detected"
                  : "Geofence Breach"}
              </span>
              <button style={s.xBtn} onClick={closeAlert}>
                {" "}
                X{" "}
              </button>
            </div>

            <div style={s.modalBody}>
              <p style={s.bodyText}>
                Livestock{" "}
                <strong style={s.highlight}> # {alertModal.livestockId}</strong>{" "}
                has triggered a{" "}
                <strong style={s.highlight}>{alertModal.type} </strong> alert.
              </p>
              <div style={s.coordinateBox}>
                <span style={s.coordinateLabel}>Location</span>
                <span style={s.coordinateValue}>
                  {alertModal.latitude.toFixed(6)},{" "}
                  {alertModal.longitude.toFixed(6)}
                </span>
              </div>
              {alertModal.timestamp && (
                <div style={s.coordinateBox}>
                  <span style={s.coordinateLabel}> Time </span>
                  <span style={s.coordinateValue}>
                    {new Date(alertModal.timestamp)}
                  </span>
                </div>
              )}

              <button style={s.acknowledgeBtn} onClick={closeAlert}>
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {smsModal && (
        <div style={s.backdrop} onClick={closeSMS}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.modalHeader, background: "#78350f" }}>
              <span style={s.headerTitle}>Alert Triggered!</span>
              <button style={s.xBtn} onClick={closeSMS}>
                {" "}
                X{" "}
              </button>
            </div>

            <div style={s.modalBody}>
              {smsSent ? (
                <div style={s.successBox}>
                  <span style={{ fontSize: "2rem" }}> Yes </span>
                  <p
                    style={{
                      color: "#4ade80",
                      fontWeight: "bold",
                      marginTop: "0.5rem",
                    }}
                  >
                    SMS Sent Succesfully!
                  </p>
                </div>
              ) : (
                <>
                  <p style={s.bodyText}>
                    Livestock{" "}
                    <strong style={s.highlight}>
                      {" "}
                      #{smsModal.livestockId}{" "}
                    </strong>
                    has triggered an alert. Send an SMS now?
                  </p>
                  <div style={s.coordinateBox}>
                    <span style={s.coordinateLabel}> Location </span>
                    <span style={s.coordinateValue}>
                      {smsModal.latitude.toFixed(6)},{" "}
                      {smsModal.longitude.toFixed(6)}
                    </span>
                  </div>

                  <label style={s.label}> Phone Number </label>
                  <input
                    style={s.input}
                    type="Telephone Number"
                    placeholder="Insert a Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />

                  <label style={s.label}> Message </label>
                  <textarea
                    style={s.textarea}
                    rows={5}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                  />

                  {smsError && <p style={s.errorText}> {smsError} </p>}

                  <div style={s.btnRow}>
                    <button
                      style={s.cancelBtn}
                      onClick={closeSMS}
                      disabled={smsSending}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        ...s.sendBtn,
                        opacity: smsSending ? 0.7 : 1,
                        cursor: smsSending ? "not-allowed" : "pointer",
                      }}
                      onClick={handleSendSMS}
                      disabled={smsSending}
                    >
                      {smsSending ? "Sending..." : "Send SMS"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

//===========Styling is Fully generated by Claude AI===============

const s = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#0f172a",
    borderRadius: "14px",
    width: "90%",
    maxWidth: "460px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "1rem 1.25rem",
  },
  headerIcon: { fontSize: "1.3rem" },
  headerTitle: { flex: 1, color: "#fff", fontWeight: 700, fontSize: "1rem" },
  xBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.6)",
    fontSize: "1.1rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0.2rem 0.4rem",
    borderRadius: "4px",
  },
  modalBody: { padding: "1.5rem 1.5rem 1.75rem" },
  bodyText: {
    color: "#cbd5e1",
    fontSize: "0.95rem",
    marginBottom: "1rem",
    lineHeight: 1.6,
  },
  highlight: { color: "#f1f5f9" },
  coordinateBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    padding: "0.6rem 0.9rem",
    marginBottom: "0.75rem",
  },
  coordinateLabel: { color: "#94a3b8", fontSize: "0.82rem" },
  coordinateValue: {
    color: "#e2e8f0",
    fontSize: "0.85rem",
    fontFamily: "monospace",
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "0.8rem",
    marginBottom: "0.3rem",
    marginTop: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9",
    fontSize: "0.88rem",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: 1.5,
    fontFamily: "inherit",
  },
  errorText: { color: "#f87171", fontSize: "0.85rem", marginTop: "0.5rem" },
  btnRow: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "1.25rem",
  },
  cancelBtn: {
    padding: "0.55rem 1.2rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  sendBtn: {
    padding: "0.55rem 1.4rem",
    borderRadius: "8px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  acknowledgeBtn: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "#1d4ed8",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.95rem",
    marginTop: "1.25rem",
  },
  successBox: { textAlign: "center", padding: "2rem 1rem" },
};

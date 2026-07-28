import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/reception.css";
import { saveServiceRequest } from "../services/ServiceRequestService";

function Reception() {
const [customerName, setCustomerName] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [source, setSource] = useState("Phone");
const [callType, setCallType] = useState("Fresh Booking");
const [sector, setSector] = useState("Ex-USA");
const [requestedAgent, setRequestedAgent] = useState("");
const [remarks, setRemarks] = useState("");
async function handleSave() {
  try {
    const result = await saveServiceRequest({
      customer_name: customerName,
      phone_number: phoneNumber,
      source: source,
      request_type: callType,
      travel_type: sector,
      requested_agent: requestedAgent,
      remarks: remarks,
    });

    console.log("Saved Successfully:", result);

    alert("Service Request Saved Successfully!");

  } catch (error) {
    console.error(error);
    alert("Error saving service request.");
  }
}
 return (
    <Layout title="Reception Dashboard">
      <div className="stats-container">

        <div className="stat-card">
          <h3>Today's Calls</h3>
          <h1>128</h1>
        </div>

        <div className="stat-card">
          <h3>Fresh Calls</h3>
          <h1>72</h1>
        </div>

        <div className="stat-card">
          <h3>Pending Dispatch</h3>
          <h1>18</h1>
        </div>

        <div className="stat-card">
          <h3>Returning Customers</h3>
          <h1>56</h1>
        </div>

      </div>

      <div className="reception-form">

        <h2>Create Service Request</h2>

        <input
  type="text"
  placeholder="Customer Name"
  value={customerName}
  onChange={(e) => setCustomerName(e.target.value)}
/>
      

        <input
  type="text"
  placeholder="Phone Number"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
/>

        <select
  value={source}
  onChange={(e) => setSource(e.target.value)}
>
  <option>Phone</option>
  <option>Email</option>
</select>

    <select
  value={callType}
  onChange={(e) => setCallType(e.target.value)}
>
  <option>Fresh Booking</option>
  <option>Name Call</option>
  <option>MAC Call</option>
  <option>Date Change</option>
  <option>Cancellation</option>
  <option>Schedule Change</option>
  <option>Fare Quote</option>
  <option>Itinerary Request</option>
</select>

        <select
  value={sector}
  onChange={(e) => setSector(e.target.value)}
>
  <option>Ex-USA</option>
  <option>Ex-India</option>
</select>

        <input
  type="text"
  placeholder="Requested Agent (Optional)"
  value={requestedAgent}
  onChange={(e) => setRequestedAgent(e.target.value)}
/>
        <textarea
  rows="4"
  placeholder="Remarks"
  value={remarks}
  onChange={(e) => setRemarks(e.target.value)}
></textarea>

        <button
  className="save-btn"
  onClick={handleSave}
>
  Save Service Request
</button>

      </div>
    </Layout>
  );
}


export default Reception;
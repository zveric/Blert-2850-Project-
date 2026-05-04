import Navbar from '../components/navbar'
import LineChart from "../components/Line-Chart.jsx";
import AccelerationGraph from "../components/acceleration-graph.jsx";


function Analysis() {
    return (
        <>

            <main style={{ padding: '2rem' }}>
                <h1>Analysis</h1>
                <p>This is the analysis page.</p>


                                <div style={{width : "30%"}}>


                    <LineChart />
                    <AccelerationGraph />
                                    </div>

            </main>
        </>
    )
}

export default Analysis
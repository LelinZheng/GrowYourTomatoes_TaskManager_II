import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tomatoes, setTomatoes] = useState(0);
  const [punishments, setPunishments] = useState(0);

  useEffect(() => {
    api.get("/tomatoes/count").then(res => setTomatoes(res.data));
    api.get("/punishments/active").then(res => setPunishments(res.data.length));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>Dashboard</h1>

        <div className="mt-4 d-flex gap-3">
          <div className="card p-3">
            <h4>🍅 Tomatoes</h4>
            <p className="fs-2">{tomatoes}</p>
          </div>

          <div className="card p-3">
            <h4>⚠️ Punishments</h4>
            <p className="fs-2">{punishments}</p>
          </div>
        </div>
      </div>
    </>
  );
}

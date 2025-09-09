export default function User() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">BusTracker</div>
      </nav>

      <section id="home">
        <h1>Track & Book Buses</h1>
        <p>Easy, fast, and reliable public transport tracking.</p>
      </section>

      <section id="map">
        <h2>Live Bus Map</h2>
        <div className="bus-cards">
          <div className="bus-card"><h3>Bus 101</h3><p>Route: A → B</p><span className="status on-time">On Time</span></div>
          <div className="bus-card"><h3>Bus 202</h3><p>Route: C → D</p><span className="status delayed">Delayed</span></div>
          <div className="bus-card"><h3>Bus 303</h3><p>Route: E → F</p><span className="status on-time">On Time</span></div>
        </div>
      </section>

      <section id="book">
        <h2>Book Your Ticket</h2>
        <div className="book-card">
          <input type="text" placeholder="Enter Bus Number" />
          <button>Book Now</button>
        </div>
      </section>
    </>
  );
}

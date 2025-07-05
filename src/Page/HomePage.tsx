import "../CSS/Page.css";

function HomePage() {
  return (
    <div className="home">
      <h2 style={{padding: '15px 10px'}}>Welcom to F1 Dash</h2>
      <p style={{padding: '10px'}}>
        This project uses the
        {" "}
        <span>
          <a href="https://api.jolpi.ca/ergast/" style={{color: 'white'}}>jolpi.ca F1 API</a>
        </span>{" "}
        to fetch Formula 1 data.
      </p>
      <a href="https://github.com/ImMasterSam/F1-Data" style={{padding: '10px', color: 'white'}}>Source Code</a>
    </div>
  );
}

export default HomePage;

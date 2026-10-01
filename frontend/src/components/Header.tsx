const HeaderBar = () => {
  const handleDownloadData = () => {
    fetch("http://localhost:8000/downloadData")
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to download data");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "database_tables.zip";
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => alert(error.message));
  };

  const handleGeneratePdf = () => {
    window.print();
  };

  return (
    <header>
      <div className="d-flex">
        <nav>
          <ul>
            <li>WEBSITE</li>
            <li>About</li>
          </ul>
        </nav>
        <button className="btn btn-primary m-2" onClick={handleGeneratePdf}>
          Generate PDF
        </button>
        <button className="btn btn-primary m-2" onClick={handleDownloadData}>
          Download Data
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;

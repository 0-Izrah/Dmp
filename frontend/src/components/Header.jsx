import React from 'react';

function Header() {
  const handleDownloadClick = (e) => {
    e.preventDefault();
    window.open('http://localhost:5000/download', '_blank');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#" className="logo">blackandblack</a>
          <a href="#" className="download-btn" onClick={handleDownloadClick}>Download Look Book</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
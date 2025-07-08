import './App.css';

function App() {
  
  const handleDownload = () => {
    window.open('http://localhost:5000/download', '_blank');
  }

  const openForm = () => {
    window.open('https://docs.google.com/forms/d/12JbaP2QkU8BPL4tP-SCD8yn1Za_0s6bnSkwOQD5mhUU/edit', '_blank')
  }

  return (
    <div>
      <button onClick={handleDownload}>Download Lookbook PDF</button>
      <button onClick={openForm}>Purchase this clothe</button>
    </div>
  )

}

export default App

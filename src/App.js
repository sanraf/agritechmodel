import React, { useState } from 'react';
import axios from 'axios';
import './Style/App.css'
import placeholder from './Style/1720984610717.jpg'
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const soilProperties = {
    "Vachellia tortilis": {
      pH: "6.0 - 8.5",
      texture: "Clay",
      drainage: "Well-drained"
    },
    "Erythrina caffra": {
      pH: "5.5 - 7.5",
      texture: "Clay, Loamy",
      drainage: "Well-drained"
    },
    "Fcus sur": {
      pH: "5.5 - 7.5",
      texture: "Clay, Loamy",
      drainage: "Well-drained"
    },
    "Syzygium cordatum": {
      pH: "5.5 - 6.5",
      texture: "Organic ",
      drainage: "Well-drained"
    },
    "Celtis africana": {
      pH: "5.5 - 7.5",
      texture: "Organic ",
      drainage: "Well-drained"
    },
    "Harpephyllum caffram": {
      pH: "5.5 - 7.5",
      texture: "Organic ",
      drainage: "Well-drained"
    },
    "Podocarpus falcatus": {
      pH: "5.0 - 6.5",
      texture: "Orgainic",
      drainage: "Well-drained"
    },
    "Pinus patula": {
      pH: "5.5 - 6.5",
      texture: "Loamy",
      drainage: "Well-drained"
    },


  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

 
    const fileURL = URL.createObjectURL(file);
    setSelectedFileURL(fileURL);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setResults([]);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const base64Image = reader.result.split(',')[1];

      const apiKey = 'API_KEY';
      const url = 'https://api.plant.id/v2/identify';

      
      const request = {
        api_key: apiKey,
        images: [base64Image],
        plant_language: 'en',
        modifiers: ['crops_fast', 'similar_images'], 
      };

      try {
        const response = await axios.post(url, request);
        setResults(response.data.suggestions);
        console.table(results)
      } catch (err) {
        setError('Error identifying plant. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="App">
      <h1>Plant Species Identifier</h1>
      <div className='btn_wrap'>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Identifying...' : 'Identify'}
      </button>
      </div>


      {selectedFileURL && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={selectedFileURL} alt="Uploaded Plant" style={{ width: '300px', margin: '10px 0' }} />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <h2>Identification Results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <strong>{result.plant_name}</strong> - Confidence: {Math.round(result.probability * 100)}%
                {result.similar_images && (
                  <div>
                    <h4>Similar Images:</h4>
                    {result.similar_images.map((image, i) => (
                      <img key={i} src={image.url} alt={`Similar ${i}`} style={{ width: '100px', margin: '5px' }} />
                    ))}
                  </div>
                )}
                {soilProperties[result.plant_name] && (
                  <div>
                    <h4>Soil Properties:</h4>
                    <p><strong>pH Level:</strong> {soilProperties[result.plant_name].pH}</p>
                    <p><strong>Soil Texture:</strong> {soilProperties[result.plant_name].texture}</p>
                    <p><strong>Drainage:</strong> {soilProperties[result.plant_name].drainage}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;




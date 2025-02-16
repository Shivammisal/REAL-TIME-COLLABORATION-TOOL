import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [documents, setDocuments] = useState([]);
    const [newDocument, setNewDocument] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/documents")
            .then(response => setDocuments(response.data))
            .catch(error => console.error("Error fetching documents:", error));
    }, []);

    const createDocument = () => {
        axios.post("http://localhost:5000/api/documents", { content: newDocument })
            .then(response => setDocuments([...documents, response.data]))
            .catch(error => console.error("Error creating document:", error));
    };

    return (
        <div>
            <h1>📄 Real-Time Collaboration Tool</h1>
            <input
                type="text"
                placeholder="Enter document content..."
                value={newDocument}
                onChange={(e) => setNewDocument(e.target.value)}
            />
            <button onClick={createDocument}>Create Document</button>

            <h2>📑 Documents</h2>
            <ul>
                {documents.map(doc => (
                    <li key={doc._id}>{doc.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;

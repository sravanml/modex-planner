import React, { useState } from "react";
import * as XLSX from "xlsx";

interface UploadResponse {
  status: string;
  supabase_response: any;
}

const DataUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  // Replace with logged-in user's id (later from Supabase Auth)
  const userId = "test-user-123";
  const runId = "run-001";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const parseFileToJSON = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSaveChanges = async () => {
    for (const file of files) {
      const jsonData = await parseFileToJSON(file);

      const response = await fetch("http://127.0.0.1:8000/upload-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          run_id: runId,
          filename: file.name,
          file_size: file.size,
          data: jsonData,
        }),
      });

      const result: UploadResponse = await response.json();
      console.log("Upload response:", result);
    }

    alert("Files saved to Supabase!");
  };

  const handleFetchData = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/get-data?user_id=${userId}&run_id=${runId}`
    );
    const result = await response.json();
    setRecords(result.records || []);
  };

  return (
    <div>
      <h2>Data Upload</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <ul>
        {files.map((file, idx) => (
          <li key={idx}>
            {file.name} ({file.size} bytes)
          </li>
        ))}
      </ul>
      <button onClick={handleSaveChanges}>Save Changes</button>
      <button onClick={handleFetchData}>Fetch Uploaded Data</button>

      {records.length > 0 && (
        <div>
          <h3>Fetched Records</h3>
          <table border={1}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Filename</th>
                <th>Uploaded At</th>
                <th>Data (first row)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={idx}>
                  <td>{rec.id}</td>
                  <td>{rec.filename}</td>
                  <td>{rec.uploaded_at}</td>
                  <td>
                    {rec.data && rec.data.length > 0
                      ? JSON.stringify(rec.data[0])
                      : "No data"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataUploader;

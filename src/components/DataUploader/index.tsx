import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import {
  parseFileToJSON,
  uploadFileToBackend,
  fetchUploadedData,
} from "./helpers";

// Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

const DataUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const runId = uuidv4(); // unique per planning session

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleSaveChanges = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first");
      return;
    }

    for (const file of files) {
      const jsonData = await parseFileToJSON(file);
      await uploadFileToBackend(user.id, runId, file, jsonData);
    }

    alert("Files saved to Supabase!");
  };

  const handleFetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first");
      return;
    }

    const data = await fetchUploadedData(user.id, runId);
    setRecords(data);
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

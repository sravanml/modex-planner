import * as XLSX from "xlsx";

// Parse Excel/CSV file to JSON
export const parseFileToJSON = (file: File): Promise<any[]> => {
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

// Save file data to backend
export const uploadFileToBackend = async (
  userId: string,
  runId: string,
  file: File,
  jsonData: any[]
) => {
  await fetch("http://localhost:8000/upload-data", {
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
};

// Fetch all files for a user + run
export const fetchUploadedData = async (userId: string, runId: string) => {
  const response = await fetch(
    `http://localhost:8000/get-data?user_id=${userId}&run_id=${runId}`
  );
  const result = await response.json();
  return result.records || [];
};

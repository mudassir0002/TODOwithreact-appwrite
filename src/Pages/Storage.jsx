import React, { useState, useEffect } from 'react';
import { storage } from '../appwrite/config';

const Storage = () => {
    const [pic, setPic] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [files, setFiles] = useState([]);
    const BUCKET_ID = import.meta.env.VITE_APP_BUCKET_ID;

    // Fetch files from storage
    const fetchFiles = async () => {
        try {
            const response = await storage.listFiles(BUCKET_ID);
            setFiles(response.files);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle file upload
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadStatus('');

        if (!pic) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        try {
            const response = await storage.createFile(BUCKET_ID, 'unique()', pic);
            console.log('File uploaded successfully:', response);
            setUploadStatus('File uploaded successfully!');
            fetchFiles(); // Refresh file list after upload
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Failed to upload the file. Please try again.');
        }
    };

    // Handle file deletion
    const handleDelete = async (fileId) => {
        try {
            await storage.deleteFile(BUCKET_ID, fileId);
            setUploadStatus('File deleted successfully!');
            fetchFiles(); // Refresh file list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
            setUploadStatus('Failed to delete the file. Please try again.');
        }
    };

    // Handle file download
    const handleDownload = async (fileId, fileName) => {
        try {
            const file = await storage.getFile(BUCKET_ID, fileId);
            const fileUrl = file.href; // File URL

            // Create a link and trigger the download
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName; // Specify the file name when downloading
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
            setUploadStatus('Failed to download the file. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">File Storage</h1>

            {/* File Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Select a file to upload:</label>
                    <input
                        type="file"
                        name="file"
                        onChange={(e) => setPic(e.target.files[0])}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Upload
                </button>
            </form>
            {uploadStatus && (
                <p
                    className={`text-center mt-4 ${
                        uploadStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                    {uploadStatus}
                </p>
            )}

            {/* Uploaded Files */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>
                {files.length > 0 ? (
                    <ul className="space-y-4">
                        {files.map((file) => (
                            <li key={file.$id} className="flex justify-between items-center border p-4 rounded-md">
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-gray-600">{(file.sizeOriginal / 1024).toFixed(2)} KB</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleDownload(file.$id, file.name)}
                                        className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.$id)}
                                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No files uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default Storage;

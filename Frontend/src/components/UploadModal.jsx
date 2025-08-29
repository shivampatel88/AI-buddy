import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, File, CheckCircle } from 'lucide-react';
import apiClient from '../services/api';
import './UploadModal.css';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError('');
    setIsSuccess(false);

    const formData = new FormData();
    formData.append('file', file); 
    try {
      await apiClient.post('/notes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsSuccess(true);
      onUploadSuccess();
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="modal-content professional-card modal-content">
            <div className="modal-header">
              <h3 className="text-lg font-semibold">Upload New Note</h3>
              <button onClick={handleClose} className="close-button">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {!isSuccess ? (
                <>
                  <div className="file-drop-zone">
                    <UploadCloud size={48} className="text-slate-400 mb-2" />
                    <input
                      type="file"
                      id="file-upload"
                      className="file-input"
                      onChange={handleFileChange}
                      accept=".pdf"/>
                    <label htmlFor="file-upload" className="file-label">
                      <span>Drag & drop or click to select a PDF</span>
                    </label>
                  </div>
                  {file && (
                    <div className="file-preview">
                      <File size={20} className="text-indigo-600" />
                      <span className="file-name">{file.name}</span>
                    </div>
                  )}
                  {error && <p className="error-text">{error}</p>}
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    className="upload-button">
                    {isUploading ? 'Uploading...' : 'Upload & Process'}
                  </button>
                </>
              ) : (
                <div className="success-view">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <h4 className="font-semibold">Upload Successful!</h4>
                  <p className="text-slate-500">Your note is being processed.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
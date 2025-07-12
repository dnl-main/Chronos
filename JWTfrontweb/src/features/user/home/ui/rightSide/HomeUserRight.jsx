// Dependencies imports
import React from 'react';
import Spinner from '../../../../../components/ui/Spinner';
import Cloud_Upload from '../../../../../assets/icons/Cloud_Upload.svg?react';
import File_Add from '../../../../../assets/icons/File_Add.svg?react';
import Folder_Open from '../../../../../assets/icons/Folder_Open.svg?react';
import Check from '../../../../../assets/icons/Check.svg?react';

// CSS Imports
import '../../homeUser.css';

// Logic hook import
import useHomeUserLogic from '../../useHomeUserLogic';

const HomeUserRight = ({
  certificateLoading,
  handleCertificateSubmit,
  file,
  setFile,
  primaryCertificateType,
  setPrimaryCertificateType,
  subCertificateType,
  setSubCertificateType,
  certificateName,
  setCertificateName,
  expirationDate,
  setExpirationDate,
  dateError,
  primaryTypes,
  certificateCategories,
}) => {
  return (
    <div className="homeUser-top-core-right">
      <div className="homeUser-top-core-right-header">
        <header>Certificate upload</header>
        <Cloud_Upload
          style={{
            width: '1.4rem',
            height: '1.4rem',
            '--stroke-color': 'var(--black-color-opacity-60)',
            '--stroke-width': '6px',
            '--fill-color': 'none',
          }}
        />
      </div>

      {certificateLoading ? (
        <div className="homeUser-top-core-right-loading" style={{ padding: '1rem', textAlign: 'center' }}>
          <Spinner />
        </div>
      ) : (
        <>
          <div className="homeUser-top-core-right-progress">
            <div className="homeUser-top-core-right-progress-text">
              <div className="homeUser-top-core-right-progress-text-box"></div>
            </div>
          </div>

          <form onSubmit={handleCertificateSubmit} className="homeUser-top-core-right-form">
            <div className="homeUser-top-core-right-form-file">
              <div className="homeUser-top-core-right-form-file-header">
                <div className="homeUser-top-core-right-form-file-header-heading">
                  <p className="homeUser-top-core-right-form-file-header-heading-medium">File upload</p>
                  <File_Add style={{ width: '1.4rem', height: '1.4rem', '--stroke-color': 'var(--black-color-opacity-60)', '--stroke-width': '6px' }} />
                </div>
                <p className="homeUser-top-core-right-form-file-header-light">Select the type of certificate</p>
              </div>

              <div className="homeUser-top-core-right-form-file-upload">
                <Cloud_Upload
                  style={{
                    width: '1.6rem',
                    height: '1.6rem',
                    '--stroke-color': 'var(--primary-color)',
                    '--stroke-width': '6px',
                    '--fill-color': 'none',
                  }}
                />
                <div className="homeUser-top-core-right-form-file-upload-text">
                  {file ? (
                    <div className="homeUser-top-core-right-form-file-upload-file">
                      <p className="homeUser-top-core-right-form-file-upload-text-bold">{file.name}</p>
                      <svg
                        onClick={() => setFile(null)}
                        className="homeUser-top-core-right-form-file-upload-remove"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--black-color-opacity-60)"
                        strokeWidth="2"
                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </div>
                  ) : (
                    <>
                      <p className="homeUser-top-core-right-form-file-upload-text-bold">Choose a file to upload</p>
                      <p className="homeUser-top-core-right-form-file-upload-text-light"> JPG, PNG and PDF only up to 30 MB</p>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  style={{ display: 'none' }}
                  id="certificate-upload"
                />

                <label htmlFor="certificate-upload" className="homeUser-top-core-right-form-file-upload-btn">
                  <Folder_Open style={{ width: '1.4rem', height: '1.4rem', '--stroke-color': 'var(--primary-color-opacity-60)', '--stroke-width': '6px' }} />
                  <p style={{ cursor: 'pointer' }}>Browse files</p>
                </label>
              </div>
            </div>

            <div className="homeUser-top-core-right-form-input">
              <div className="homeUser-top-core-right-form-input-fields">
                <div className="homeUser-top-core-right-form-input-fields-select">
                  <select
                    value={primaryCertificateType}
                    onChange={(e) => {
                      setPrimaryCertificateType(e.target.value);
                      setSubCertificateType('');
                    }}
                    required
                  >
                    <option value="" disabled>Select certificate type</option>
                    {primaryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {primaryCertificateType && (
                  <div className="homeUser-top-core-right-form-input-fields-select">
                    <select
                      value={subCertificateType}
                      onChange={(e) => setSubCertificateType(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select sub-type</option>
                      {certificateCategories[primaryCertificateType]?.length > 0 ? (
                        certificateCategories[primaryCertificateType].map((subType) => (
                          <option key={subType} value={subType}>
                            {subType}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No sub-types available</option>
                      )}
                    </select>
                  </div>
                )}

                <div className="homeUser-top-core-right-form-input-fields-text">
                  <input
                    type="text"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Certificate Name"
                    required
                  />
                </div>

                <div className="homeUser-top-core-right-form-input-fields-date">
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const today = new Date().toISOString().split('T')[0];
                      if (selectedDate === today) {
                        setExpirationDate('');
                        setDateError('Expiration date cannot be today. Please select a future date.');
                      } else {
                        setExpirationDate(selectedDate);
                        setDateError('');
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {dateError && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{dateError}</p>}
                </div>
              </div>

              <button className="homeUser-top-core-right-form-input-btn">
                <Check
                  style={{
                    width: '24px',
                    height: '40px',
                    '--stroke-color': 'var(--primary-color)',
                    '--stroke-width': '6px',
                    '--fill-color': 'none',
                  }}
                />
                <p style={{ cursor: 'pointer' }}>Upload now</p>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default HomeUserRight;

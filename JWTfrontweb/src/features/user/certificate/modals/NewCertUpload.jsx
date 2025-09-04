import { useState } from 'react';
import Spinner from '../../../../components/ui/Spinner';
import Cloud_Upload from '../../../../assets/icons/Cloud_Upload.svg?react';
import Folder_Open from '../../../../assets/icons/Folder_Open.svg?react';
import Check from '../../../../assets/icons/Check.svg?react';

// Logic hook (new one just for certificates)
import useCertificateUpload from './useCertificateUpload';

// CSS
import '../modals/newCertUpload.css';

const NewCertUpload = () => {
  const token = sessionStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const {
    handleSubmitCertificate,
    certificateName,
    setCertificateName,
    primaryCertificateType,
    setPrimaryCertificateType,
    subCertificateType,
    setSubCertificateType,
    certificateCategories,
    file,
    setFile,
    expirationDate,
    setExpirationDate,
    dateError,
  } =  useCertificateUpload(token, apiUrl);
  const [open, setOpen] = useState(false);

  const primaryTypes = Object.keys(certificateCategories);

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)} className="newcert-trigger">
        <Cloud_Upload className="newcert-trigger-icon" />
        Upload Certificate
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="newcert" onClick={() => setOpen(false)}>
          {/* Modal Box */}
          <div
            className="newcert-child1"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Header */}
            <div className="newcert-child1-box">
              <h2 className="newcert-child1-box-title">Certificate Upload</h2>
              <button
                onClick={() => setOpen(false)}
                className="newcert-child1-box-close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitCertificate} className="newcert-child2">
              {/* File Upload */}
              <div className="newcert-child2-file">
                {file ? (
                  <div className="newcert-child2-file-info">
                    <p className="newcert-child2-file-name">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="newcert-child2-file-remove"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="newcert-child2-file-name">
                      Choose a file to upload
                    </p>
                    <p className="newcert-child2-file-note">
                      JPG, PNG, PDF only (max 30MB)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  name="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  id="certificate-upload"
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="certificate-upload"
                  className="newcert-child2-file-btn"
                >
                  <Folder_Open className="newcert-child2-file-btn-icon" />
                  Browse files
                </label>
              </div>

              {/* Certificate Type */}
              <div>
                <select
                  name="primary_certificate_type"
                  value={primaryCertificateType}
                  onChange={(e) => {
                    setPrimaryCertificateType(e.target.value);
                    setSubCertificateType('');
                  }}
                  required
                  className="newcert-child2-select"
                >
                  <option value="" disabled>
                    Select certificate type
                  </option>
                  {primaryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {primaryCertificateType && (
                <div>
                  <select
                    name="sub_certificate_type"
                    value={subCertificateType}
                    onChange={(e) => setSubCertificateType(e.target.value)}
                    required
                    className="newcert-child2-select"
                  >
                    <option value="" disabled>
                      Select sub-type
                    </option>
                    {certificateCategories[primaryCertificateType]?.length > 0 ? (
                      certificateCategories[primaryCertificateType].map(
                        (subType) => (
                          <option key={subType} value={subType}>
                            {subType}
                          </option>
                        )
                      )
                    ) : (
                      <option value="" disabled>
                        No sub-types available
                      </option>
                    )}
                  </select>
                </div>
              )}

              {/* Certificate Name */}
              <div>
                <input
                  type="text"
                  name="certificate_name"
                  value={certificateName}
                  onChange={(e) => setCertificateName(e.target.value)}
                  placeholder="Certificate Name"
                  required
                  className="newcert-child2-input"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <input
                  type="date"
                  name="expiration_date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="newcert-child2-input"
                />
                {dateError && (
                  <p className="newcert-child2-error">{dateError}</p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="newcert-child2-submit">
                <Check className="newcert-child2-submit-icon" />
                Upload now
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewCertUpload;

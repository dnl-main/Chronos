import { useState } from 'react';
import Spinner from '../../../../components/ui/Spinner';
import Cloud_Upload from '../../../../assets/icons/Cloud_Upload.svg?react';
import Folder_Open from '../../../../assets/icons/Folder_Open.svg?react';
import Check from '../../../../assets/icons/Check.svg?react';
import Close_MD from '../../../../assets/icons/Close_MD.svg?react';

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
    isUploading,
  } =  useCertificateUpload(token, apiUrl);
  const [open, setOpen] = useState(false);

  const primaryTypes = Object.keys(certificateCategories);

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)} className="newCertUpload-trigger">
      <Cloud_Upload
        style={{
          width: '20px',
          height: '20px',
          color: 'var(--white-color)',        // will be used if --stroke-color not set
          '--stroke-width': 8,                // numbers or strings ('3' or '3px') both work in many setups
        }}
      />
        Upload Certificate
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="newCertUpd" onClick={() => setOpen(false)}>
          {/* Modal Box */}
          <div
            className="newCertUpd-box"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Header */}
            <div className="newCertUpd-box-header">
              <p>Certificate Upload</p>
              <button
                onClick={() => setOpen(false)}
                className="newCertUpd-box-header-close"
              >
                <Close_MD style={{ color: 'var(--black-color-opacity-60)', width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitCertificate} className="newCertUpd-form">
              {/* File Upload */}
              <div className="newCertUpd-form-file">
                {file ? (
                  <div className="newCertUpd-form-file-upload">
                    <p className="newCertUpd-form-file-upload-medium">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="newCertUpd-form-file-upload-remove"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="newCertUpd-form-file-desc">
                    <Cloud_Upload
                      style={{
                        width: '20px',
                        height: '20px',
                        color: 'var(--primary-color)',        // will be used if --stroke-color not set
                        '--stroke-width': 8,                // numbers or strings ('3' or '3px') both work in many setups
                      }}
                    />
                    <p className="newCertUpd-form-file-desc-main">
                      Choose a file to upload
                    </p>
                    <p className="newCertUpd-form-file-desc-sub">
                      JPG, PNG, PDF only (max 30MB)
                    </p>
                  </div>
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
                  className="newCertUpd-form-file-btn"
                >
                  
                  <Folder_Open
                    style={{
                      color: 'var(--primary-color)',    // controls stroke color
                      width: '20px',
                      height: '20px',
                      '--stroke-width': '5'             // <-- IMPORTANT: set CSS var here
                    }}
                  />



                  Browse files
                </label>
              </div>

              {/* Certificate Type */}

              <div className="newCertUpd-form-fields">
                <div className="newCertUpd-form-fields-type">
                  <article>
                    <label htmlFor="">Certificate</label>
                    <select
                      name="primary_certificate_type"
                      value={primaryCertificateType}
                      onChange={(e) => {
                        setPrimaryCertificateType(e.target.value);
                        setSubCertificateType('');
                      }}
                      required
                      className="newCertUpd-form-fields-select"
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
                  </article>
                  

                  {primaryCertificateType && (
                    <article>
                      <label htmlFor="">Certificate Type</label>
                      <select
                        name="sub_certificate_type"
                        value={subCertificateType}
                        onChange={(e) => setSubCertificateType(e.target.value)}
                        required
                        className="newCertUpd-form-fields-select"
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
                    </article>
                  )}
                </div> {/* newCertUpd-form-fields-type */}              

                {/* Certificate Name */}
                <article>
                  <label htmlFor="">Certificate name</label>
                  <input
                    type="text"
                    name="certificate_name"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Certificate Name"
                    required
                    className="newCertUpd-form-fields-input"
                  />
                </article>

                {/* Expiration Date */}
                <article>
                  <label htmlFor="">Expiration date</label>
                  <input
                    type="date"
                    name="expiration_date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="newCertUpd-form-fields-input"
                  />
                  {dateError && (
                    <p className="newCertUpd-form-fields-error">{dateError}</p>
                  )}
                </article>

              </div> {/* newCertUpd-form-fields */}              

              {/* Submit */}
              <button 
                type="submit" 
                className="newCertUpd-form-submit"
                disabled={isUploading}   // 👈 prevent double clicks
              >
                {isUploading ? (
                  <Spinner />  // or "Uploading..."
                ) : (
                  <>
                    <Check style={{ color: 'var(--white-color)', width: '20px', height: '20px', '--stroke-width': 8 }} />
                    Upload now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewCertUpload;

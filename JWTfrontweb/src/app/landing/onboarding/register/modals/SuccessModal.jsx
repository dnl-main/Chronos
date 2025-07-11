import React, { useEffect, useState, memo, lazy, Suspense } from 'react';
import './SuccessModal.css';

// Lazy import
const Party_Popper = lazy(() => import('../../../../../assets/icons/Party_Popper.svg?react'));

const capitalizeFirstLetter = (name) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1) : 'There';

const SuccessModal = ({ type = 'signup', userFirstName = 'there', message, onConfirm, countdownStart = 5 }) => {
  const [countdown, setCountdown] = useState(countdownStart);
  const [showPartyPopper, setShowPartyPopper] = useState(false);

  useEffect(() => {
    // Trigger countdown
    if (countdown <= 0) {
      onConfirm();
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onConfirm]);

  useEffect(() => {
    // Delay Party_Popper rendering until after initial render
    const showTimeout = setTimeout(() => setShowPartyPopper(true), 0); // `0` means next tick
    return () => clearTimeout(showTimeout);
  }, []);

  const headingText =
    type === 'signup'
      ? `Welcome on board, ${capitalizeFirstLetter(userFirstName)}!`
      : `Ready to explore, ${capitalizeFirstLetter(userFirstName)}?`;

  return (
    <div className="success-modal">
      <div className="success-modal-box">
        <div className="success-modal-box-in">
          <div className="success-modal-box-in-header">
            {showPartyPopper ? (
              <Suspense fallback={<div style={{ height: '28vh' }} />}>
                <Party_Popper style={{ width: '28vh', height: '28vh', color: 'var(--primary-color)' }} />
              </Suspense>
            ) : (
              <div style={{ height: '28vh' }} />
            )}
            <p>{headingText}</p>
          </div>

          <div className="success-modal-box-in-text">
            <p className="success-modal-box-in-text-regular">{message}</p>
            <p className="success-modal-box-in-text-light">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          <div className="success-modal-box-in-button">
            <button onClick={onConfirm}>
              <p>Let's go!</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SuccessModal);

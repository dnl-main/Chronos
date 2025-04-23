import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="animate-spin rounded-full h-10 w-10 border-4 border-solid border-transparent"
        style={{
          borderTopColor: '#00889a',
        }}
      />
    </div>
  );
};

export default Spinner;

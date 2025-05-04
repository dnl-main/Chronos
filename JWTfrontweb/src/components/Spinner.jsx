
const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-gray-200"
        style={{
          borderTopColor: '#00889a',
        }}
      />
    </div>
  );
};

export default Spinner;
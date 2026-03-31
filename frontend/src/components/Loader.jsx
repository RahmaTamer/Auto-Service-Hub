import './Loader.css';

const Loader = ({ loading, text = "Loading..." }) => {
  if (!loading) return null;

  return (
    <div className="loader-container">
      <div className="custom-spinner"></div> 
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
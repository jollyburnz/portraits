import React from 'react';
    import { useNavigate } from 'react-router-dom';

    function NoResults() {
      const navigate = useNavigate();

      const handleBack = () => {
        navigate('/');
      };

      return (
        <div>
          <button onClick={handleBack}>Back</button>
          <h2>No Results Found</h2>
          <p>Sorry, we couldn't find a portrait with that number.</p>
        </div>
      );
    }

    export default NoResults;

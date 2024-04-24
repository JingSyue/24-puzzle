import React from 'react';

const LevelSelector = ({ setLevel }) => (
  <div className="level-selector">
    <button onClick={() => setLevel('easy')}>初級</button>
    <button onClick={() => setLevel('hard')}>高級</button>
  </div>
);

export default LevelSelector;

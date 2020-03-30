import React from 'react';
import './App.css';
import Editor from './components/Editor';
import Timeline from './components/Timeline';

function App() {
  let styles = {
    margin: '0 auto',
    width: '75%'
  }
  return (
    <div style={styles}>
      <Timeline user="plaguera" repo="tfm-testing" number={1} />
      <Editor user="plaguera" repo="tfm-testing" number={1} />
    </div>
  )
}

export default App;

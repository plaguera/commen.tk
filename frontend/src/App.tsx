import React from 'react';
import './App.css';
import Editor from './components/Editor';

function App() {
  let styles = {
    margin: '0 auto',
    width: '50%'
  }
  return (
    <div style={styles}>
      <Editor />
    </div>
  )
}

export default App;

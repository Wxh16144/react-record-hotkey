import { useRecordHotkey } from 'react-use-record-hotkey';

const App = () => {
  const [inputRef, keys, { start, stop, isRecording }] = useRecordHotkey({
    onClean: () => {
      console.log('Clean');
    },
    onConfirm: (hotkey) => {
      console.log(`Hotkey: ${Array.from(hotkey).join('+')}`);
    },
  });

  return (
    <div>
      <input ref={inputRef} autoFocus readOnly />
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <p>Recording: {isRecording ? 'Yes' : 'No'}</p>
      <p>Hotkey: {Array.from(keys).join('+')}</p>
    </div>
  );
};

export default App;

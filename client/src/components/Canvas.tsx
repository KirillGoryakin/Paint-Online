import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import Store from 'Store/Store';

const Canvas = observer(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === 'KeyZ') {
      if(e.shiftKey) Store.redo();
      else Store.undo();
    }
  };
  
  useEffect(() => {
    if(canvasRef.current)
      Store.setCanvas(canvasRef.current);

    document.addEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <div
        style={{
          display: Store.clickable ? 'none' : 'block',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '650px',
          opacity: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '650px',
          touchAction: 'none',
        }}
      >
        Your browser does not support HTML canvas.
      </canvas>
    </>
  )
});

export { Canvas };
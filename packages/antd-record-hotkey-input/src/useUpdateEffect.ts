import React from 'react';

const useUpdateEffect: typeof React.useEffect = (effect, deps) => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;

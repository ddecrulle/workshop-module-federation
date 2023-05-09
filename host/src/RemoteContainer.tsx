import { useEffect, useRef } from "react";
import { mount } from "remoteApp/bootstrap";
import { useLocation } from "react-router-dom";

const RemoteContainer = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isFirstRunRef = useRef(true);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const unmountRef = useRef(() => { });

  // Mount remote MFE
  useEffect(
    () => {
      if (!isFirstRunRef.current) {
        return;
      }
      unmountRef.current = mount({
        mountPoint: wrapperRef.current!,
        initialPathname: location.pathname.replace('', ''),
      });
      isFirstRunRef.current = false;
    },
    [location],
  );

  useEffect(() => unmountRef.current, []);

  return <div ref={wrapperRef} id="remote-mfe" />;
};

export default RemoteContainer;
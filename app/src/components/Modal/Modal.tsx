import React, { useEffect, useState } from 'react';

import './modal.scss';

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
}

const Modal = ({ children, visible }: ModalProps) => {
  const [hidden, setHidden] = useState<boolean>(false);
   
  useEffect(() => {
    setHidden(!visible);
  }, [visible]);

  const close = () => setHidden(true); // REMOVE!!!!!

  if (hidden) return <></>;

  return (
    <div className="modal-container" onClick={() => close()}>
      <div className="modal-window">
        {children}
      </div>
    </div>
  );
};

export default Modal;

import React, { MouseEvent, useEffect, useState } from 'react';

import './modal.scss';

interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  setVisible?: (value: boolean) => void;
  disabled?: boolean;
}

const Modal = ({ children, visible, setVisible, disabled }: ModalProps) => {
  const close = (evt: any) => {
    if (disabled) return;

    console.log(evt.target.id);
    if (evt.target.id == 'modal-container' && setVisible) {
      setVisible(false);
    }
  };

  if (!visible) return <></>;

  return (
    <div id="modal-container" className="modal-container" onClick={close}>
      <div className="modal-window">{children}</div>
    </div>
  );
};

export default Modal;

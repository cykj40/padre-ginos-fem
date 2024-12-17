import { createPortal } from 'react-dom';

export default function Modal({ children }) {
  return createPortal(
    <div id="modal">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.querySelector(".modal")
  );
}

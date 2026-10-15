import { ReactNode } from "react";
import { createRoot } from "react-dom/client";

type ConfirmAlertOptions = {
  customUI: (props: { onClose: () => void }) => ReactNode;
};

export const confirmAlert = (options: ConfirmAlertOptions) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  document.body.classList.add("react-confirm-alert-body-element");

  const root = createRoot(container);
  const onClose = () => {
    root.unmount();
    container.remove();
    document.body.classList.remove("react-confirm-alert-body-element");
  };

  root.render(
    <div className="react-confirm-alert-overlay">
      <div className="react-confirm-alert">
        <div className="react-confirm-alert-body">
          {options.customUI({ onClose })}
        </div>
      </div>
    </div>
  );
};

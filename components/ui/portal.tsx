// components/Portal.tsx
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
  /** Optional: id of an existing DOM node to render into */
  containerId?: string;
};

export function Portal({ children, containerId }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);

    if (containerId) {
      let el = document.getElementById(containerId);
      if (!el) {
        // Create the element if it doesn't exist
        el = document.createElement("div");
        el.id = containerId;
        document.body.appendChild(el);
      }
      setTimeout(() => {
        setContainer(el);
      }, 0);
    } else {
      // No id provided → use document.body
      setTimeout(() => {
        setContainer(document.body);
      }, 0);
    }

    return () => {
      setMounted(false);
    };
  }, [containerId]);

  // On the server, or before mounted, render nothing
  if (!mounted || !container) return null;

  return createPortal(children, container);
}

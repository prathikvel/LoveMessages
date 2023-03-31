import { useState, useCallback } from "react";

const useOpenDialog = <T>(cb?: Function) => {
  const [selected, setSelected] = useState<T | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = useCallback((selection: T) => {
    setSelected(selection);
    setOpen(true);
  }, []);
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };
  const handleOk = () => {
    setOpen(false);
    typeof cb === "function" && cb();
    setSelected(null);
  };

  return { selected, open, handleOpen, handleClose, handleOk };
};

export default useOpenDialog;

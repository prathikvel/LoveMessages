import { useState, useCallback } from "react";

const useOpenForm = <T>() => {
  const [selected, setSelected] = useState<T | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = useCallback((selection?: T) => {
    setSelected(selection);
    setOpen(true);
  }, []);
  const handleClose = () => {
    setOpen(false);
    setSelected(undefined);
  };

  return { selected, open, handleOpen, handleClose };
};

export default useOpenForm;

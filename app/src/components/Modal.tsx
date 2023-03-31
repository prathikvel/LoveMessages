import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactElement;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={{ ...style, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
        {children}
      </Box>
    </MuiModal>
  );
};

export default Modal;

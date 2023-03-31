import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface RemoveDialogProps {
  open: boolean;
  onOk: () => void;
  onClose: () => void;
  children: React.ReactElement;
}

const RemoveDialog = ({ open, onOk, onClose, children }: RemoveDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove Confirmation</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onOk}>Remove</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveDialog;

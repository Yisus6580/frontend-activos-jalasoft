import { Dialog, DialogTitle, Divider } from '@mui/material';
import { FC, ReactNode } from 'react';

type DialogProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
};

const DialogForm: FC<DialogProps> = ({
  title,
  children,
  isOpen,
  handleClose
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      {children}
    </Dialog>
  );
};

export default DialogForm;

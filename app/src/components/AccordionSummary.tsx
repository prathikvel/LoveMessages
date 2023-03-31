import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import MuiArrowIcon from "@mui/icons-material/ArrowForwardIosSharp";

const ArrowIcon = () => <MuiArrowIcon sx={{ fontSize: "0.9rem" }} />;

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowIcon />} {...props} />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": { marginLeft: theme.spacing(1) },
}));

export default AccordionSummary;

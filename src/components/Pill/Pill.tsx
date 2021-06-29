import { Pill as StyledPill } from "./style";

type Props = {
  label: string;
};

const Pill: React.FC<Props> = ({ label }) => {
  return <StyledPill>{label}</StyledPill>;
};

export default Pill;

export interface ButtonProps {
  children: React.ReactNode;
  type: "submit" | "reset" | "button";
  bgColor?: string;
  handleClick?: ()=>void;
}

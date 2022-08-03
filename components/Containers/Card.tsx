import type { ReactNode } from "react";
import cn from "classnames";

interface CardProps {
  className?: string;
  children: ReactNode;
  padding?: boolean;
  animation?: boolean;
}

function Card({ className, children, padding = true, animation = false }: CardProps): JSX.Element {
  return (
    <div className={cn({
      "p-4 ": padding,
      "hover:scale-110 transition-all ": animation,
    }) + (className ? (className + " ") : "") + "rounded-3xl"}>
      {children}
    </div>
  )
}

export default Card


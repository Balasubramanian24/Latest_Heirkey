import { HTMLAttributes } from "react";

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export function List({ children, className, ...props }: ListProps) {
  return (
    <ul className={className} {...props}>
      {children}
    </ul>
  );
}

export function ListItem({ children, className, ...props }: ListItemProps) {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
} 
import clsx from "clsx";

interface GridProps {
  className?: string;
  children?: React.ReactNode;
  symbol?: "X" | "O" | null;
  onClick?: () => void;
}
const Grid: React.FC<GridProps> = ({
  className,
  children,
  symbol,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        " border p-10 w-24 h-24 flex items-center justify-center cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <span className="font-bold text-4xl">{symbol}</span>
      {children}
    </div>
  );
};

export default Grid;

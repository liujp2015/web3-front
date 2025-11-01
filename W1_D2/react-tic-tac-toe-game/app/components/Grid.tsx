import clsx from "clsx";

interface GridProps {
  className?: string;
  children?: React.ReactNode;
}
const Grid: React.FC<GridProps> = ({ className, children }) => {
  return (
    <div className={clsx("inline-block border p-10", className)}>
      <button className="font-bold text-2xl w-5"></button>
      {children}
    </div>
  );
};

export default Grid;

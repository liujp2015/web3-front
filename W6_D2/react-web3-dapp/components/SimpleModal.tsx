import React from "react";

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simplified Modal
export default function SimpleModal({
  isOpen,
  onClose,
  children,
}: React.PropsWithChildren<SimpleModalProps>) {
  if (!isOpen) return null;

  return (
    // 👇 整个 Modal 区域（包括遮罩+内容）用一个容器
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose} // 点击 anywhere 关闭
    >
      {/* 内容区域：阻止冒泡 */}
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

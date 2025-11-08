import React from 'react';

interface SymbolSelectorProps {
  onSelect: (symbol: 'X' | 'O') => void;
  onClose: () => void;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">请选择你的符号</h2>
        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={() => onSelect('X')}
            className="w-20 h-20 text-4xl font-bold bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
          >
            X
          </button>
          <button
            onClick={() => onSelect('O')}
            className="w-20 h-20 text-4xl font-bold bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
          >
            O
          </button>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-4">选择后将开始游戏</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymbolSelector;
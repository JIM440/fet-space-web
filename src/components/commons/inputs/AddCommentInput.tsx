import React from 'react';

interface AddCommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  type_id?: string;
  type?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const AddCommentInput: React.FC<AddCommentInputProps> = ({
  value,
  onChangeText,
  onSubmit,
//   type_id,
//   type,
  placeholder = 'Add comment',
  style,
  disabled = false,
}) => {

  const inputStyle = {
    // backgroundColor: colors.backgroundNeutral,
    // color: colors.neutralTextSecondary,
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
        style={inputStyle}
        disabled={disabled}
      />
      {value.trim().length > 0 && (
        <button
          onClick={onSubmit}
          className="ml-2 p-2 rounded-full bg-blue-500 text-white flex items-center justify-center"
          disabled={disabled}
          style={{ width: 32, height: 32 }}
        >
          <span className="material-icons">send</span>
        </button>
      )}
    </div>
  );
};

export default AddCommentInput;
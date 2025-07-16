interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  text: string;
  startIcon?: any;
  endIcon?: any;
  onClick?: () => void;
}

const variantStyle = {
  primary: "bg-violet-600 text-white hover:bg-violet-700",
  secondary: "bg-violet-100 text-violet-700 hover:bg-violet-200",
};

const variantSize = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2',
};

const defaultStyle =
  'flex gap-2 rounded-lg text-lg items-center justify-center text-xl';

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`${variantStyle[props.variant]} ${
        variantSize[props.size]
      } ${defaultStyle}`}
    >
      {props.startIcon ? props.startIcon : null}
      {props.text}
      {props.endIcon ? props.endIcon : null}
    </button>
  );
};

export default Button;

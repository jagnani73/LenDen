export interface FieldClassnames {
  wrapper?: string;
  input?: string;
  label?: string;
  option?: string;
  description?: string;
}

export interface Validation {
  validationtype?: string;
  validations?: {
    type: string;
    params?: (string | number | RegExp | any)[];
  }[];
}

interface CustomFieldProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    Validation {
  name: string;
  id: string;
  placeholder?: string;
  type:
    | "text"
    | "textarea"
    | "date"
    | "select"
    | "email"
    | "number"
    | "password"
    | "checkbox"
    | "radio"
    | "file";
  description?: React.ReactNode;
  disabled?: boolean;
  label?: React.ReactNode;
  classnames?: FieldClassnames;
}

export interface CustomInputProps extends CustomFieldProps {
  type: "text" | "date" | "email" | "password" | "number" | "file";
}

export interface CustomTextareaProps extends CustomFieldProps {
  type: "textarea";
}

export interface CustomSelectProps extends CustomFieldProps {
  type: "select";
  choices: { value: string | number; content: React.ReactNode }[];
  placeholder?: string;
}

export interface CustomRadioBoxProps extends CustomFieldProps {
  type: "radio" | "checkbox";
  choices: { value: string | number; text: string }[];
}

export type CustomFieldTypes =
  | CustomInputProps
  | CustomTextareaProps
  | CustomSelectProps
  | CustomRadioBoxProps;

export interface DropdownProps {
  children: React.ReactNode;
  trigger: "hover" | "click";
  contentClassName?: string;
  dropdownClassname?: string;
  option?: string;
  options: React.ReactNode[];
  open: boolean;
  persist?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

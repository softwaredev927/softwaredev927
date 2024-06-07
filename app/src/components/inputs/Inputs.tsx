import {
  styled,
  Typography,
  Checkbox,
  IconButton,
  TextField,
} from "@mui/material";
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyledCreateAbout, StyledFlexColumn, StyledFlexRow } from "styles";
import { RiErrorWarningLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { BsFillTrash3Fill, BsUpload } from "react-icons/bs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { FormArgs, InputArgs } from "types";
import { FormikProps } from "formik";
import { AppTooltip } from "../Tooltip";
import _ from "lodash";
import { Markdown } from "../Markdown";
import { AiOutlinePlus } from "react-icons/ai";
import {
  StyledAddMoreButton,
  StyledChars,
  StyledContainer,
  StyledDatepicker,
  StyledError,
  StyledFormInput,
  StyledInputHeader,
  StyledListTextInput,
  StyledPreview,
  StyledPreviewBox,
  StyledPreviewButton,
  StyledUpload,
  StyledUploadContainer,
  StyledUploadImg,
  StyledTitle,
  StyledInputContainer,
  StyledDisplayText,
} from "./styles";
import { TitleContainer } from "components/TitleContainer";
import { NumericFormat } from "react-number-format";
import { useCreateDaoTranslations } from "i18n/hooks/useCreateDaoTranslations";
import { useCommonTranslations } from "i18n/hooks/useCommonTranslations";
import moment, { Moment, utc } from "moment";
import { useMobile } from "hooks/hooks";

interface TextInputProps {
  value?: string | number;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  onFocus?: () => void;
  rows?: number;
  onBlur?: () => void;
  placeholder?: string;
  title?: string;
  name?: string;
  className?: string;
  endAdornment?: React.ReactNode;
  tooltip?: string;
  required?: boolean;
  limit?: number;
  startAdornment?: ReactNode;
  disabled?: boolean;
  isMarkdown?: boolean;
  defaultValue?: any;
  hideRequired?: boolean;
}

export function TextInput({
  value = "",
  onChange,
  label,
  error,
  onFocus,
  rows,
  onBlur,
  placeholder,
  title,
  name,
  endAdornment,
  className = "",
  tooltip,
  required,
  limit,
  startAdornment,
  disabled,
  isMarkdown,
  defaultValue,
  hideRequired,
}: TextInputProps) {
  const translations = useCommonTranslations();
  const [preview, setPreview] = useState(false);

  const _onChange = (_value: string) => {
    if (!limit) {
      onChange(_value);
    } else if (_.size(value.toString()) < limit) {
      onChange(_value);
    } else if (_.size(_value) < _.size(value.toString())) {
      onChange(_value);
    }
  };

  return (
    <StyledContainer className={`${className} text-input`}>
      <InputHeader
        value={value.toString()}
        limit={limit}
        title={title}
        hideRequired={hideRequired}
        required={required}
        tooltip={tooltip}
      />
      <div style={{ position: "relative", width: "100%" }}>
        {isMarkdown && _.size(value.toString()) > 0 && (
          <StyledPreviewBox justifyContent="flex-end">
            <StyledPreviewButton onClick={() => setPreview(!preview)}>
              {preview ? translations.edit : translations.preview}
            </StyledPreviewButton>
            <StyledPreviewButton
              onClick={() =>
                window.open(
                  "https://www.markdownguide.org/basic-syntax/",
                  "_blank"
                )
              }
            >
              {translations.help}
            </StyledPreviewButton>
          </StyledPreviewBox>
        )}
        {preview ? (
          <PreviewInput md={value as string} />
        ) : (
          <StyledInputContainer
            markdown={isMarkdown ? 1 : 0}
            preview={preview ? 1 : 0}
          >
            <TextField
              placeholder={placeholder}
              onBlur={onBlur}
              name={name}
              rows={rows}
              disabled={disabled}
              multiline={rows ? true : false}
              onFocus={onFocus}
              variant="outlined"
              value={value}
              error={!!error}
              label={label}
              onChange={(e) => _onChange(e.target.value)}
              InputProps={{ endAdornment, startAdornment }}
            />
          </StyledInputContainer>
        )}
      </div>

      {error && (
        <StyledError>
          <RiErrorWarningLine />
          <Typography>{error}</Typography>
        </StyledError>
      )}
    </StyledContainer>
  );
}

const PreviewInput = ({ md }: { md: string }) => {
  return (
    <StyledPreview>
      <Markdown>{md}</Markdown>
    </StyledPreview>
  );
};

export const InputHeader = ({
  title,
  tooltip,
  limit,
  required,
  value,
  hideRequired,
}: {
  title?: string;
  tooltip?: string;
  limit?: number;
  required?: boolean;
  value?: string;
  hideRequired?: boolean;
}) => {
  const charsAmount = _.size(value || "");

  if (!title) return null;
  return (
    <StyledInputHeader>
      <StyledFlexRow justifyContent="flex-start" width="auto">
        <Title hideRequired={hideRequired} title={title} required={required} />
        {tooltip && <AppTooltip placement="right" info markdown={tooltip} />}
      </StyledFlexRow>

      {limit && (
        <StyledChars>
          {charsAmount}/{limit}
        </StyledChars>
      )}
    </StyledInputHeader>
  );
};

interface UploadInputProps {
  onChange: (file: File) => void;
  className?: string;
  value?: File;
  title: string;
}

export function UploadInput({
  onChange,
  className = "",
  value,
  title,
}: UploadInputProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <StyledUploadContainer>
      {title && <StyledTitle>{title}</StyledTitle>}
      <StyledUpload
        {...getRootProps()}
        className={`${className} upload-input`}
        active={isDragActive}
      >
        {value && <StyledUploadImg src={URL.createObjectURL(value)} />}
        <BsUpload />
        <input {...getInputProps()} />
      </StyledUpload>
    </StyledUploadContainer>
  );
}

const Title = ({
  title,
  required,
  className,
  hideRequired,
}: {
  title: string;
  required?: boolean;
  className?: string;
  hideRequired?: boolean;
}) => {
  return (
    <StyledTitle className={`input-title ${className}`}>
      <Markdown className="md">{title}</Markdown>
      {!hideRequired && (
        <small className="input-title-required" style={{ fontSize: 14 }}>
          {required ? " (required)" : " (optional)"}
        </small>
      )}
    </StyledTitle>
  );
};

interface DateRangeInputProps {
  className?: string;
  onChange: (value: number) => void;
  title?: string;
  error?: string;
  onFocus?: () => void;
  min?: number;
  max?: number;
  value?: number | string;
  required?: boolean;
  tooltip?: string;
}

export const DateRangeInput = ({
  className = "",
  onChange,
  title,
  error,
  onFocus,
  min,
  max,
  value = "",
  required,
  tooltip,
}: DateRangeInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StyledDatepicker
        className={`${className} date-input`}
        error={error ? 1 : 0}
      >
        <StyledInputHeader>
          {title && <Title title={title} required={required} />}
          {tooltip && <AppTooltip info markdown={tooltip} />}
        </StyledInputHeader>

        <DateTimePicker
          // maxDate={max && dayjs(max)}
          // minDate={min && dayjs(min)}

          value={value ? moment(value) : null}
          onOpen={onFocus}
          className="datepicker"
          onChange={(value: Moment | null) => onChange(moment(value).valueOf())}
          format={"YYYY-MM-DD HH:mm"}
        />
        {error && (
          <StyledError>
            <RiErrorWarningLine />
            <Typography>{error}</Typography>
          </StyledError>
        )}
      </StyledDatepicker>
    </LocalizationProvider>
  );
};

export function MapInput<T>({
  args,
  value,
  error,
  className,
  onChange,
  customInputHandler,
  clearError,
  formik,
}: {
  args: InputArgs<T>;
  value: any;
  error?: string;
  className?: string;
  onChange: (value: any) => void;
  customInputHandler?: (value: InputArgs<T>) => ReactElement;
  clearError?: () => void;
  formik: FormikProps<T>;
}) {
  const touchedRef = useRef(false);

  useEffect(() => {
    if (value) {
      touchedRef.current = true;
    }
  }, [value]);

  useEffect(() => {
    if (!value && args.default && !touchedRef.current) {
      onChange(args.default);
    }
  }, [args.default, value]);

  const name = args.name;
  const label = args.label;
  const EndAdornment = args.EndAdornment;

  const common = {
    required: args.required,
    title: args.label,
    tooltip: args.tooltip,
  };

  if (args.type === "date") {
    return (
      <DateRangeInput
        {...common}
        onChange={onChange}
        error={error as string}
        onFocus={clearError}
        className={className}
        min={args.min}
        max={args.max}
        value={value as any}
      />
    );
  }
  if (args.type === "upload") {
    return (
      <UploadInput title={label} onChange={onChange} value={value as File} />
    );
  }

  if (args.type === "number") {
    return (
      <NumberInput
        placeholder={args.placeholder}
        value={value}
        onChange={onChange}
        prefix={args.prefix}
        suffix={args.suffix}
        error={error}
        onFocus={clearError}
        {...common}
        endAdornment={
          EndAdornment && <EndAdornment name={name!} formik={formik} />
        }
      />
    );
  }
  if (args.type === "checkbox") {
    return (
      <CheckboxInput {...common} onChange={onChange} value={value as boolean} />
    );
  }
  if (args.type === "list") {
    return (
      <ListInputs
        limit={args.limit}
        title={label}
        onChange={onChange}
        values={(value as string[]) || [""]}
        required={args.required}
        disabled={args.disabled}
        tooltip={args.tooltip}
        placeholder={args.placeholder}
      />
    );
  }

  if (
    args.type === "text" ||
    args.type === "textarea" ||
    args.type === "address" ||
    args.type === "image" ||
    args.type === "url"
  ) {
    return (
      <TextInput
        {...args}
        defaultValue={args.default}
        onFocus={clearError}
        key={name}
        error={error}
        title={label}
        label=""
        value={value as string}
        name={name}
        onChange={onChange}
        endAdornment={
          EndAdornment && <EndAdornment name={name!} formik={formik} />
        }
      />
    );
  }
  if (args.type === "custom" && customInputHandler) {
    return customInputHandler(args);
  }
  if (args.type === "display-text") {
    return <StyledDisplayText>{args.text}</StyledDisplayText>;
  }
  return null;
}

export const CheckboxInput = ({
  title,
  onChange,
  value = false,
  required,
  tooltip,
  className = "",
}: {
  title: string;
  onChange: (value: boolean) => void;
  value: boolean;
  required?: boolean;
  tooltip?: string;
  className?: string;
}) => {
  return (
    <StycheckBoxInput className={className} justifyContent="flex-start" gap={2}>
      <Checkbox checked={value} onChange={() => onChange(!value)} />
      {title && <StyledCheckBoxTitle title={title} required={required} />}
      {tooltip && <AppTooltip placement="right" info markdown={tooltip} />}
    </StycheckBoxInput>
  );
};

const StyledCheckBoxTitle = styled(Title)({
  width: "unset",
  marginRight: 10,
});

const StycheckBoxInput = styled(StyledFlexRow)({});

interface ListProps {
  values: string[];
  onChange: (value: string[]) => void;
  title: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  placeholder?: string;
  max?: number;
  limit?: number;
}

export const ListInputs = ({
  values = [""],
  title,
  required,
  onChange,
  disabled,
  tooltip,
  placeholder = "",
  max = 7,
  limit,
}: ListProps) => {
  const onInputChange = (index: number, _value: string) => {
    const newValue = values.map((it, _index) => {
      if (index === _index) {
        return _value;
      }
      return it;
    });
    onChange(newValue);
  };

  const addOption = () => {
    const newValue = [...values, ""];
    onChange(newValue);
  };

  const deleteOption = (_index: number) => {
    const newValue = values.filter((it, index) => _index !== index);
    onChange(newValue);
  };

  return (
    <StyledContainer>
      <InputHeader tooltip={tooltip} title={title} required={required} />
      <StyledFlexColumn gap={15} alignItems="flex-start">
        {values &&
          values.map((it, index) => {
            const isLast = index === values.length - 1;
            return (
              <StyledFlexRow justifyContent="flex-start" key={index}>
                <StyledListTextInput disabled={disabled ? 1 : 0}>
                  <TextInput
                  hideRequired={true}
                    title={`option ${index + 1}`}
                    limit={limit}
                    placeholder={placeholder}
                    endAdornment={
                      !disabled &&
                      index > 0 && (
                        <AppTooltip text="Delete choice">
                          <IconButton onClick={() => deleteOption(index)}>
                            <BsFillTrash3Fill
                              style={{
                                width: 17,
                                height: 17,
                                cursor: "pointer",
                              }}
                            />
                          </IconButton>
                        </AppTooltip>
                      )
                    }
                    onChange={(value) => onInputChange(index, value)}
                    value={it}
                  />
                </StyledListTextInput>
                {!disabled && isLast && index < max - 1 && (
                  <AppTooltip text="Add option">
                    <StyledAddMoreButton onClick={addOption}>
                      <AiOutlinePlus style={{ width: 17, height: 17 }} />
                    </StyledAddMoreButton>
                  </AppTooltip>
                )}
              </StyledFlexRow>
            );
          })}
      </StyledFlexColumn>
    </StyledContainer>
  );
};

interface FormikInputsFormProps<T> {
  form: FormArgs<T>[] | FormArgs<T>;
  formik: FormikProps<T>;
  EndAdornment?: any;
  customInputHandler?: (value: InputArgs<T>) => ReactElement;
  children?: ReactNode;
}

export function FormikInputsForm<T>({
  form,
  formik,
  customInputHandler,
  children,
}: FormikInputsFormProps<T>) {
  const _form = _.isArray(form) ? form : [form];
  const mobile = useMobile();

  return (
    <StyledFlexColumn gap={15}>
      {_form.map((it, index) => {
        const isLast = _.size(_form) === index + 1;

        return (
          <TitleContainer
            className="formik-form"
            key={index}
            title={it.title}
            headerComponent={
              it.warning && (
                <StyledWarning>
                  <RiErrorWarningLine />
                  {it.warning}
                </StyledWarning>
              )
            }
          >
            <StyledFlexColumn gap={30}>
              {it.subTitle && (
                <StyledCreateAbout>{it.subTitle}</StyledCreateAbout>
              )}
              <StyledInputsContainer gap={20}>
                {it.inputs.map((input) => {
                  const clearError = () =>
                    formik.setFieldError(input.name as string, undefined);
                  return (
                    <StyledFormInput
                      key={input.name}
                      className="form-input"
                      style={{
                        width:
                          input.style?.width || mobile
                            ? "100%"
                            : it.inputsInRow
                            ? `calc(${100 / it.inputsInRow}% - ${
                                it.inputsInRow * 7
                              }px)`
                            : "100%",
                      }}
                    >
                      <MapInput<T>
                        customInputHandler={customInputHandler}
                        args={input}
                        value={formik.values[input.name as keyof T]}
                        error={formik.errors[input.name as keyof T] as string}
                        clearError={clearError}
                        onChange={(value: any) => {
                          formik.setFieldValue(input.name as string, value);
                          clearError();
                        }}
                        formik={formik}
                      />
                    </StyledFormInput>
                  );
                })}
              </StyledInputsContainer>
            </StyledFlexColumn>
            {it.bottomText && <StyledMarkdown>{it.bottomText}</StyledMarkdown>}
            {isLast && children}
          </TitleContainer>
        );
      })}
    </StyledFlexColumn>
  );
}

const StyledMarkdown = styled(Markdown)({
  marginTop: 20,
  p: {
    fontSize: 15,
    fontWeight: 500,
  },
});

const StyledWarning = styled(Typography)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.primary,
  svg: {
    position: "relative",
    top: 2,
    marginRight: 4,
  },
}));

const StyledInputsContainer = styled(StyledFlexRow)({
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

interface NumberInputProps {
  value: number;
  placeholder?: string;
  onChange: (value: any) => void;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  title?: string;
  tooltip?: string;
  endAdornment?: React.ReactNode;
  error?: string;
  onFocus?: () => void;
}

export const NumberInput = ({
  value,
  placeholder = "",
  onChange,
  prefix = "",
  suffix = "",
  required,
  title,
  tooltip,
  endAdornment,
  error,
  onFocus,
}: NumberInputProps) => {
  return (
    <StyledInputContainer>
      <InputHeader title={title} required={required} tooltip={tooltip} />
      <NumericFormat
        prefix={prefix}
        suffix={suffix}
        value={value}
        onFocus={onFocus}
        placeholder={placeholder}
        customInput={TextField}
        thousandSeparator=","
        onValueChange={(value) => {
          onChange(value.floatValue);
        }}
        InputProps={{ endAdornment }}
      />
      {error && (
        <StyledError>
          <RiErrorWarningLine />
          <Typography>{error}</Typography>
        </StyledError>
      )}
    </StyledInputContainer>
  );
};

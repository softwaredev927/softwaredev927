import { Typography } from "@mui/material";
import { Button, FormikInputsForm } from "components";
import { FormikProps, useFormik } from "formik";
import _ from "lodash";
import { useAppParams } from "hooks/hooks";

import { useRolesForm } from "./form";
import { DaoRolesForm } from "types";
import { StyledEndAdornment } from "styles";
import { useDaoQuery } from "query/getters";
import { useSetDaoOwnerQuery, useSetDaoPublisherQuery } from "query/setters";

export function RolesForm() {
  const form = useRolesForm(EndAdornment);
      const { daoAddress } = useAppParams();

  const dao = useDaoQuery(daoAddress).data;

  const formik = useFormik<DaoRolesForm>({
    initialValues: {
      ownerAddress: dao?.daoRoles.owner || "",
      proposalOwner: dao?.daoRoles.proposalOwner || "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {},
  });

  return (
    <FormikInputsForm<DaoRolesForm>
      form={form}
      formik={formik}
    ></FormikInputsForm>
  );
}

export const EndAdornment = ({
  name,
  formik,
}: {
  name: string;
  formik: FormikProps<DaoRolesForm>;
}) => {
  const { mutateAsync: setOwner, isLoading: setOwnerLoading } =
    useSetDaoOwnerQuery();
  const { mutateAsync: setPublisher, isLoading: setPublisherloading } =
    useSetDaoPublisherQuery();
  const value = formik.values[name as keyof DaoRolesForm];
  const initialValue = formik.initialValues[name as keyof DaoRolesForm];

  const update = () => {
    const args = {
      newOwner: value,
      onError: (error: string) => formik.setFieldError(name, error),
    };

    if (name === "ownerAddress") {
      return setOwner(args);
    }
    if (name === "proposalOwner") {
      return setPublisher(args);
    }
  };

  const isLoading =
    name === "ownerAddress" ? setOwnerLoading : setPublisherloading;

  if (initialValue === value) return null;

  return (
    <StyledEndAdornment>
      <Button onClick={update} isLoading={isLoading}>
        <Typography>Update</Typography>
      </Button>
    </StyledEndAdornment>
  );
};

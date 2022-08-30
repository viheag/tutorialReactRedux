import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { userService, alertService } from "../../_services";

const AddEdit = ({ history }) => {  
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate()
  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .concat(isAddMode ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .when("password", (password, schema) => {
        if (password || isAddMode)
          return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, setValue, formState } =
    useForm({
      resolver: yupResolver(validationSchema),
    });

  function onSubmit(data) {
    return isAddMode ? createUser(data) : updateUser(id, data);
  }

  function createUser(data) {
    console.log("Entre",data);
    return userService
      .create(data)
      .then(() => { 
        alertService.success("User added", { keepAfterRouteChange: true });
        navigate("/users")
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    return userService
      .update(id, data)
      .then(() => {
        alertService.success("User updated", { keepAfterRouteChange: true });
       navigate("/")
      })
      .catch(alertService.error);
  }

  useEffect(() => {
    if (!isAddMode) { 
      userService.getById(id).then((user) => {
        const fields = ["title", "firstName", "lastName", "email", "role"];
        fields.forEach((field) => setValue(field, user[field]));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1>{isAddMode ? "Add User" : "Edit User"}</h1> 
        <div className="form-row">
          <div className="form-group col">
            <label>Title</label>
            <select
              name="title"
              {...register("title")}
              className="form-control"
            >
              <option value=""></option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Ms">Ms</option>
            </select> 
          </div>
          <div className="form-group col-5">
            <label>First Name</label>
            <input
              name="firstName"
              type="text"
              {...register("firstName")}
              className="form-control"
            /> 
          </div>
          <div className="form-group col-5">
            <label>Last Name</label>
            <input
              name="lastName"
              type="text"
              {...register("lastName")}
              className="form-control"
            /> 
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-7">
            <label>Email</label>
            <input
              name="email"
              type="text"
              {...register("email")}
              className="form-control"
            /> 
          </div>
          <div className="form-group col">
            <label>Role</label>
            <select
              name="role"
              {...register("role")}
              className="form-control"
            >
              <option value=""></option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select> 
          </div>
        </div>
        {!isAddMode && (
          <div>
            <h3 className="pt-3">Change Password</h3>
            <p>Leave blank to keep the same password</p>
          </div>
        )}
        <div className="form-row">
          <div className="form-group col">
            <label>Password</label>
            <input
              name="password"
              type="password"
              {...register("password")}
              className="form-control"
            /> 
          </div>
          <div className="form-group col">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="form-control"
            /> 
          </div>
        </div>
        <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
            </div>
      </form>
    </>
  );
};

export default AddEdit;

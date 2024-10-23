import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Loading from "./Loding";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import { toast } from "sonner";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, 
  } = useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        password: data.password,
      }).unwrap();

      toast.success("Password changed successfully");
      reset(); 
      setOpen(false); 
    } catch (err) {
      console.error(err);
      // Provide specific feedback based on the error
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("An error occurred while changing the password.");
      }
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          Change Password
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="New Password"
            type="password"
            label="Password"
            name="password"
            className="w-full rounded"
            register={register("password", {
              required: "New Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={errors.password ? errors.password.message : null}
          />
          <Textbox
            placeholder="Confirm New Password"
            type="password"
            label="Confirm Password"
            name="cpass"
            register={register("cpass", {
              required: "Confirm Password is required",
            })}
            error={errors.cpass ? errors.cpass.message : ""}
          />
        </div>

        {isLoading ? (
          <div className="py-5">
            <Loading />
          </div>
        ) : (
          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-500 sm:w-auto"
              label="Save"
            />
            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;

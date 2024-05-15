import { useForm } from "react-hook-form";
import { signup } from "../lib/pocketbase";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";


export default function LoginPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    }
  });

  const mutation = useMutation({
    mutationFn: signup,
    onMutate: () => {
      toast.message("Signing up");
    },
    onSuccess: () => {
      toast.success("Signed up successful");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  function onSubmit(value) {
    if (!value.email || !value.password) {
      window.alert("Invalid Signup Credentials");
      return;
    }

    if (value.password !== value.passwordConfirm) {
      window.alert("Password doesn't match");
      return;
    }

    value.username.trim() === ""
      ? mutation.mutate({ email: value.email, password: value.password, passwordConfirm: value.passwordConfirm })
      : mutation.mutate(value);
  }

  return (
    <section className="max-w-md mx-auto space-y-4 p-4">
      <h4 className="text-lg font-bold">Create a new account</h4>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label>
          <span>Username (A-Z, a-z, 0-9, - and _)</span>
          <input type="text" {...register("username")} placeholder="john-smith - Leave empty to create automatically" />
          {errors.username && <span className="text-red-700">* required</span>}
        </label>

        <label>
          <span>Email</span>
          <input type="text" {...register("email", { required: true })} placeholder="user@example.com" />
          {errors.email && <span className="text-red-700">* required</span>}
        </label>

        <label>
          <span>Password</span>
          <input type="password" {...register("password", { required: true })} />
          {errors.password && <span className="text-red-700">* required</span>}
        </label>

        <label>
          <span>Confirm Password</span>
          <input type="password" {...register("passwordConfirm", { required: true })} />
          {errors.passwordConfirm && <span className="text-red-700">* required</span>}
        </label>

        <button className="main-btn bg-co-base text-co-lavender">
          Signup
        </button>
      </form>

      <Link to="/login" className="underline inline-block mt-4">
        Already have an account? Login here!
      </Link>

      <Toaster richColors />
    </section>
  );
}



import { useForm } from "react-hook-form";
import { login } from "../lib/pocketbase";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { useState } from "react";


export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const mutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      toast.message("Logging in!");
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      window.location.replace("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(value) {
    if (!value.email || !value.password) {
      window.alert("Invalid Login Credentials");
      return;
    }

    mutation.mutate(value);
  }

  const [ eye, setEye ] = useState(false);

  return (
    <section className="max-w-md mx-auto space-y-4 p-4">
      <h4 className="text-lg font-bold">Login</h4>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label>
          <span>Email</span>
          <input type="text" {...register("email", { required: true })} placeholder="user@example.com" />
          {errors.email && <span className="text-red-700">* required</span>}
        </label>

        {eye
          ? (
            <>
              <label>
                <span>Password</span>
                <input type="text" {...register("password", { required: true })} />
                {errors.password && <span className="text-red-700">* required</span>}
              </label>

              <button className="flex gap-4 items-center main-btn" type="button" onClick={() => setEye(false)}>
                <img src="/assets/eye-off.asset.svg" alt="eye-off icon" className="w-5" />
                <span>Hide password</span>
              </button>
            </>
          ) : (
            <>
              <label>
                <span>Password</span>
                <input type="password" {...register("password", { required: true })} />
                {errors.password && <span className="text-red-700">* required</span>}
              </label>

              <button className="flex gap-4 items-center main-btn" type="button" onClick={() => setEye(true)}>
                <img src="/assets/eye.asset.svg" alt="eye-in icon" className="w-5" />
                <span>Show password</span>
              </button>
            </>
          )
        }

        <button className="main-btn bg-co-base text-co-lavender">
          Login
        </button>
      </form>

      <Link to="/signup" className="underline inline-block mt-4">
        Didn't have an account? Sign up here!
      </Link>

      <Toaster richColors />
    </section>
  );
}



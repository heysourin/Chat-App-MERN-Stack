import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("data :>> ", data);
    e.preventDefault();
    const res = await fetch(
      `http://localhost:5000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.status === 400) {
      alert("Invalid credentials");
    } else {
      const resData = await res.json();
      if (resData.token) {
        localStorage.setItem("user:token", resData.token);
        localStorage.setItem("user:detail", JSON.stringify(resData.user));
        navigate("/");
      }
    }
  };

  return (
    <div className="bg-white w-[400px] h-[600px] shadow-lg flex flex-col justify-center items-center mx-auto">
      <div className="text-4xl font-bold">
        Welcome {isSignInPage && "Back"}{" "}
      </div>
      <div className="text-xl font-light mb-14">
        {isSignInPage ? "Sign in to explore" : "Sign up"}
      </div>
      <form
        action=""
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col items-center w-full"
      >
        {!isSignInPage && (
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            className="mb-6 w-2/3"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
          />
        )}

        <Input
          label="Email"
          name="email"
          placeholder="Enter your password"
          className="mb-6 w-2/3"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="mb-6 w-2/3"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <Button
          label={isSignInPage ? "Sign In" : "Sign Up"}
          className="w-1/2 mb-2"
          type="submit"
        />
      </form>

      <div>
        {isSignInPage ? "Not a member? " : "Already a member? "}
        <span
          className="text-primary cursor-pointer"
          onClick={() =>
            navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`)
          }
        >
          Sign {isSignInPage ? "Up" : "In"}
        </span>{" "}
      </div>
    </div>
  );
};

export default Form;

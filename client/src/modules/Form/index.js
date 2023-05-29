import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Form = ({ isSingInPage = true }) => {
  const [data, setData] = useState({
    ...(!isSingInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    console.log("Data:", data);
    e.preventDefault();
  };
  return (
    <div className="bg-white w-[400px] h-[600px] shadow-lg flex flex-col justify-center items-center">
      <div className="text-4xl font-bold">
        Welcome {isSingInPage && "Back"}{" "}
      </div>
      <div className="text-xl font-light mb-14">
        {isSingInPage ? "Sign in to explore" : "Sign up"}
      </div>
      <form
        action=""
        onSubmit={(e) => handleSubmit}
        className="flex flex-col items-center w-full"
      >
        {!isSingInPage && (
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
          label={isSingInPage ? "Sign In" : "Sign Up"}
          className="w-1/2 mb-2"
          type="submit"
        />
      </form>

      <div>
        {isSingInPage ? "Not a member? " : "Already a member? "}
        <span className="text-primary">
          Sign {isSingInPage ? "Up" : "In"}
        </span>{" "}
      </div>
    </div>
  );
};

export default Form;

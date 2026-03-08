import { Checkbox, Form, Input, Typography, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import brandlogo from "../../../assets/image/logo_yard.png";
import { useAuthStore } from "../../../stores/use-auth-store";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showpassword, setShowpassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isInitializing);

  const togglePasswordVisibility = () => {
    setShowpassword(!showpassword)
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    }
  }, [isAuthenticated, location.state, navigate, user]);

  const onFinish = async (values) => {
    try {
      const session = await login(values);

      if (session.user?.role !== "admin") {
        await logout();
        message.error("This account does not have admin access.");
        return;
      }

      message.success("Signed in successfully.");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to sign in. Please try again."
      );
    }
  };

  return (
    <div className="bg-[#f9fafb]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between w-full gap-2 mx-auto md:max-w-screen-md md:flex-row md:gap-20">
          <div className="md:h-[100vh] w-full  flex items-center justify-center ">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              className="py-5 md:py-12 mx-2 md:mx-0 px-6 md:px-10 rounded-2xl w-[580px] h-[525px] bg-white border-2 border-[#eef6ff] "
            >
         <div className="flex justify-center ">
           <img src={brandlogo} className="w-auto" alt="brandlogo"/>
         </div>
              <div className="text-center ">
                <Typography.Text className="text-base text-center text-black ">
                  Please enter your email and password to continue
                </Typography.Text>
              </div>
              <Form.Item
                name="email"
                label={<p className=" text-md">Email</p>}
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  className=" text-md"
                  placeholder="Your Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={<p className=" text-md">Password</p>}
                rules={[{ required: true, message: "Password is required" }]}
              >
                <div className="relative flex items-center justify-center">
                  <Input
                    className=" text-md"
                    type={showpassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <div className="absolute right-0 flex justify-center px-3">
                    <button onClick={togglePasswordVisibility} type="button">
                      {showpassword ? (
                        <FaRegEyeSlash className="" />
                      ) : (
                        <FaRegEye className="" />
                      )}
                    </button>
                  </div>
                </div>
              </Form.Item>
              <div className="flex items-center justify-between my-2">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-black text-md hover:text-black">
                    Remember Password
                  </Checkbox>
                </Form.Item>
                <Link to="/forgate-password" className="">
                  <p className="text-red-600 hover:text-red-600 text-md ">
                    Forgate Password
                  </p>
                </Link>
              </div>
              <Form.Item className="my-5 text-center">
                <button
                  className="bg-[#0A3019] text-center w-full   p-2 font-semibold  text-white px-20 py-3 rounded-md "
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

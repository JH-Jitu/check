"use client";

import { useState } from "react";
import { Form, Input, Button, Spin, Alert, Modal } from "antd";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore/authStore";

const LoginPage = () => {
  const login = useAuthStore((state) => state.login);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const res = await login(values);
      if (res === "error") {
        setError(
          "Your id and password is wrong! Please press the 'Hint' Button"
        );
      } else {
        router.push("/projects");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto text-[#5356FF]">
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-sm md:max-w-md bg-[#DFF5FF] rounded-lg shadow-2xl p-6 shadow-[#5356FF] drop-shadow-lg">
          {error && (
            <Alert
              className="mb-6"
              message={error}
              type="error"
              showIcon
              closable
            />
          )}
          <Form name="login" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="Username"
                className="ant-input-lg rounded-md shadow-sm"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Password"
                className="ant-input-lg rounded-md shadow-sm"
              />
            </Form.Item>
            <Form.Item className="mb-4">
              <Button
                type="default"
                onClick={() => setIsModalOpen((prevState) => !prevState)}
                className="w-full rounded-md shadow-sm"
              >
                Show Username and Password
              </Button>
            </Form.Item>
            <Form.Item className="mb-4">
              <Button
                type="primary"
                style={{ background: "#5356FF", color: "#DFF5FF" }}
                htmlType="submit"
                block
                loading={loading}
                className="rounded-md shadow-sm bg-[#948979]"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Modal
          title="User Auth information"
          open={isModalOpen}
          onOk={() => setIsModalOpen((prevState) => !prevState)}
          onCancel={() => setIsModalOpen((prevState) => !prevState)}
          className="rounded-lg"
        >
          <div>
            <p>Username: admin</p>
            <p>Password: password</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;

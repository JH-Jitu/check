// app/auth/login/page.jsx
"use client";

import { useState } from "react";
import { Form, Input, Button, Spin, Alert, Modal } from "antd";
import { useRouter } from "next/navigation";
import useStore from "@/store/authStore/authStore";

const LoginPage = () => {
  const login = useStore((state) => state.login);

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
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
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
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Button
            className="mb-5"
            type="default"
            onClick={() => setIsModalOpen((prevState) => !prevState)}
          >
            Hint
          </Button>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
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
      >
        <p>Username: admin</p>
        <p>Password: password</p>
      </Modal>
    </div>
  );
};

export default LoginPage;

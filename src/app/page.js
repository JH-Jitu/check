"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, Spin, Alert, Modal } from "antd";
import { useRouter } from "next/navigation";
import useStore from "@/store/authStore/authStore";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "./api/fetchAPI";

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

  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  // useEffect(() => {
  //   const fetchProject = async () => {
  //     // Fetch project details from your mock API or data source
  //     const response = await fetch(`/api/mock-api?resource=projects`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const result = await response.json();
  //     console.log({ result });
  //   };
  //   fetchProject();
  // }, []);

  console.log({ projects });

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-sm md:max-w-md">
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
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                onClick={() => setIsModalOpen((prevState) => !prevState)}
              >
                Show Username and Password
              </Button>
            </Form.Item>
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
    </div>
  );
};

export default LoginPage;

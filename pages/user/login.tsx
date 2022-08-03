import Layout from '../../components/Containers/Layout';
import { axiosInstance } from '../../hooks/useRequest';
import useRequest from '../../hooks/useRequest';
import { FormEvent, useEffect, useId, useState } from 'react';
import { AuthLoginBody, AuthLoginResponse } from '../../api-types/src/routes/auth';
import { isFailedResponse, isSuccessfulResponse } from '../../api-types/src';
import { AxiosError } from "axios";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FaExclamationTriangle } from 'react-icons/fa';
import Router from 'next/router';
import { UserInfoResponse } from '../../api-types/src/routes/user';
import Link from 'next/link';

function Login(): JSX.Element {
  const emailId = useId();
  const passwdId = useId();

  const [error, setError] = useState<string>();
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  const { data } = useRequest<UserInfoResponse>({ url: "/user/info", headers: { "Authorization": `Bearer ${token}` } });
  useEffect(() => {
    if (data && isSuccessfulResponse(data))
      Router.push("/dashboard");
  }, [data]);

  const invalidCredentialsErrorMsg = "Invalid credentials!";

  async function handleForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };

    const data: AuthLoginBody = {
      email: target.email.value,
      password: target.password.value,
    };

    try {
      const resp = await axiosInstance.request<AuthLoginResponse>({
        url: "/auth/login",
        method: "POST",
        data: data
      });

      if (resp && isSuccessfulResponse(resp.data)) {
        setToken(resp.data.token);
        location.reload();
      }
    }
    catch (e) {
      if (e instanceof AxiosError) {
        const data = e.response?.data;
        if (isFailedResponse<AuthLoginResponse>(data)) {
          if (data.error.code === "InvalidCredentialsError") {
            setError(invalidCredentialsErrorMsg);
          }
          else {
            setError(JSON.stringify(data.error));
          }
        }
      }
    }
  }

  return (
    <Layout title="Login" className='overflow-hidden'>
      <div className='flex items-center justify-center w-screen h-screen'>
        <form onSubmit={handleForm}>
          <p className='text-3xl mb-3'>Log in</p>
          <p className='text-2xl mb-3'>Welcome back!</p>

          <label htmlFor={emailId} className="text-xl">Email:</label><br />
          <input
            type="email"
            id={emailId}
            name="email"
            className={(error ? "bg-red-500" : "bg-slate-600") + " text-lg rounded-md mb-2"}
            required
          />

          <br />

          <label htmlFor={passwdId} className="text-xl">Password:</label><br />
          <input
            type="password"
            id={passwdId}
            name="password"
            className={(error ? "bg-red-500" : "bg-slate-600") + " text-lg rounded-md mb-2"}
            required
          />

          <br />

          {
            error &&
            <div className='bg-red-600 mt-2 w-fit p-2 rounded-xl mb-2'>
              <FaExclamationTriangle className='inline mr-1' />
              <span>{error}</span>
            </div>
          }

          <button type="submit" className='text-xl bg-orange-600 rounded-xl py-1 px-2 mb-2'>Submit</button>

          <br />

          <Link href="/user/register">
            <a className='text-blue-600 underline'>
              Don't have an account?
            </a>
          </Link>
        </form>
      </div>
    </Layout >
  );
}

export default Login



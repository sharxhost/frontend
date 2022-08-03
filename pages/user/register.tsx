import Layout from '../../components/Containers/Layout';
import { axiosInstance } from '../../hooks/useRequest';
import useRequest from '../../hooks/useRequest';
import { FormEvent, useEffect, useId, useState } from 'react';
import { AuthCreateBody, AuthCreateResponse, AuthLoginBody, AuthLoginResponse } from '../../api-types/src/routes/auth';
import { isFailedResponse, isSuccessfulResponse } from '../../api-types/src';
import { AxiosError } from "axios";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FaExclamationTriangle } from 'react-icons/fa';
import Router from 'next/router';
import { UserInfoResponse } from '../../api-types/src/routes/user';
import Link from 'next/link';
import FormInput from '../../components/Elements/FormInput';
import { isNormalError, TooShortFieldError } from '../../api-types/src/errors';
import { ServiceInfoResponse } from '../../api-types/src/routes/service';

function Register({ serviceInfo }: { serviceInfo: ServiceInfoResponse }): JSX.Element {
  const [error, setError] = useState<{ msg: string, fields: string[] }>({ msg: "", fields: [] });
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  const { data } = useRequest<UserInfoResponse>({ url: "/user/info", headers: { "Authorization": `Bearer ${token}` } });
  useEffect(() => {
    if (data && isSuccessfulResponse(data))
      Router.push("/dashboard");
  }, [data]);

  async function handleForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      username: { value: string };
      email: { value: string };
      password: { value: string };
      rptPassword: { value: string };
    };

    if (target.password.value != target.rptPassword.value) {
      setError({
        msg: "Passwords don't match!",
        fields: ["password", "rptPassword"],
      });
      return;
    }

    const data: AuthCreateBody = {
      username: target.username.value,
      email: target.email.value,
      password: target.password.value,
    };

    try {
      const resp = await axiosInstance.request<AuthCreateResponse>({
        url: "/auth/create",
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
        if (isFailedResponse<AuthCreateResponse>(data)) {
          const fields: string[] =
            (isNormalError(data.error) && data.error.data && "field" in data.error.data) ?
              (data.error.data.field === "password" ? ["password", "rptPassword"] : [data.error.data.field]) :
              ["username", "email", "password", "rptPassword"];

          if (isNormalError(data.error)) {
            switch (data.error.code) {
              case ("TooShortFieldError"): {
                setError({ msg: `Too short! Minimum length is ${data.error.data.minLength}`, fields: fields });
                break;
              }
              case ("TooLongFieldError"): {
                setError({ msg: `Too long! Maximum length is ${data.error.data.maxLength}`, fields: fields });
                break;
              }
              case ("IllegalCharacterError"): {
                setError({ msg: `Illegal character <code>${data.error.data.character}</code>!`, fields: fields });
                break;
              }
              case ("UserAlreadyRegisteredError"): {
                setError({ msg: `This user already exists!`, fields: fields });
                break;
              }
              default: {
                setError({
                  msg: JSON.stringify(data.error),
                  fields: ["username", "email", "password", "rptPassword"],
                });
                break;
              }
            }
          }
          else {
            setError({
              msg: JSON.stringify(data.error),
              fields: ["username", "email", "password", "rptPassword"],
            });
          }
        }
      }
    }
  }

  return (
    <Layout title="Register" className='overflow-hidden'>
      <div className='flex items-center justify-center w-screen h-screen'>
        <form onSubmit={handleForm}>
          <p className='text-3xl mb-3'>Register</p>
          {
            isSuccessfulResponse(serviceInfo) &&
            <p className='text-2xl mb-3'>Thanks for choosing {serviceInfo.name}!</p>
          }

          <FormInput
            title='Username'
            name="username"
            error={error}
            required={true}
            type="text"
          />

          <br />

          <FormInput
            title='Email'
            name="email"
            error={error}
            required={true}
            type="email"
          />

          <br />

          <FormInput
            title='Password'
            name="password"
            error={error}
            required={true}
            type="password"
          />

          <br />

          <FormInput
            title='Password again'
            name="rptPassword"
            error={error}
            required={true}
            type="password"
          />

          <br />

          {
            error.msg &&
            <div className='bg-red-600 mt-2 w-fit p-2 rounded-xl mb-2'>
              <FaExclamationTriangle className='inline mr-1' />
              <span>{error.msg}</span>
            </div>
          }

          <button type="submit" className='text-xl bg-orange-600 rounded-xl py-1 px-2 mb-2'>Submit</button>

          <br />

          <Link href="/user/login">
            <a className='text-blue-600 underline'>
              Already have an account?
            </a>
          </Link>
        </form>
      </div>
    </Layout >
  );
}

export async function getStaticProps() {
  const res = await axiosInstance.get("/service/info");

  return {
    props: {
      serviceInfo: res.data
    }
  }
}

export default Register



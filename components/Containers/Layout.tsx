import axios from "axios";
import Head from "next/head";
import Router from "next/router";
import { ReactNode, useEffect } from "react";
import { SWRConfig } from "swr";
import { isSuccessfulResponse } from "../../api-types/src";
import { UserInfoResponse } from "../../api-types/src/routes/user";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import useRequest from "../../hooks/useRequest";

import NavBar from "../Elements/NavBar";

type PageProps = {
  title: string | false | undefined;
  children: ReactNode;
  className?: string;
  navBar?: boolean;
  background?: boolean;
  auth?: boolean;
}

// eslint-disable-next-line promise/prefer-await-to-then
const fetcher = (url: string) => axios.get(url).then(res => res.data);

function Layout({ title, children, className, navBar = true, background = true, auth = false }: PageProps): JSX.Element {
  if (auth) {
    const [token] = useLocalStorage<string | null>("token", null);
    const { data } = useRequest<UserInfoResponse>({ url: "/user/info", headers: { "Authorization": `Bearer ${token}` } });
    useEffect(() => {
      if (!data || !isSuccessfulResponse(data))
        Router.push("/user/login");
    }, [data]);
  }
  return (
    <div>
      <SWRConfig value={{ fetcher }}>
        {title &&
          <Head>
            <title>{title}</title>
          </Head>
        }
        <div className={`${background ? "bg-slate-800 " : ""}text-white h-screen w-screen${className ? ` ${className}` : ""}`}>
          {navBar && <NavBar />}
          <div className="h-full w-full">
            {children}
          </div>
        </div>
      </SWRConfig>
    </div>
  )
}

export default Layout

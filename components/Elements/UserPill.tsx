import { FiLogIn, FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useEffect, useState } from "react";
import { UserInfoResponse } from "../../api-types/src/routes/user";
import useRequest, { axiosInstance } from "../../hooks/useRequest";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { isSuccessfulResponse } from "../../api-types/src";
import Link from "next/link";
import { AuthLogoutResponse } from "../../api-types/src/routes/auth";

interface UserPillProps {
  className?: string;
  goToDashboard?: boolean;
  decorations?: boolean;
}

function UserPill({ className, goToDashboard = false, decorations = true }: UserPillProps): JSX.Element {
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [user, setUser] = useState<UserInfoResponse | null>(null);

  const { data } = useRequest<UserInfoResponse>({ url: "/user/info", headers: { "Authorization": `Bearer ${token}` } });
  useEffect(() => {
    if (data && isSuccessfulResponse(data))
      setUser(data);
    else
      setUser(null);
  }, [data]);

  async function logOut() {
    const { data } = await axiosInstance.request<AuthLogoutResponse>({
      url: "/auth/logout",
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    setToken(null);
    setUser(null);
    if (isSuccessfulResponse(data)) {
      alert("Logged out successfully!");
      location.reload();
    }
  }

  return (
    <div className={"h-20 overflow-hidden grid grid-flow-col place-items-center gap-4" + (decorations ? " bg-slate-600 p-3 m-1" : "") + (className ? (" " + className) : "")} >
      {
        user !== null && isSuccessfulResponse(user) ?
          <>
            <div>
              <strong className="text-lg">{user.username}</strong>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>

            <div className="grid grid-flow-row gap-3 text-xl">
              <button className="hover:scale-110 transition-all" onClick={logOut}>
                <FiLogOut title="Log out" />
              </button>
              {
                goToDashboard &&
                <div className="hover:scale-110 transition-all">
                  <Link href="/dashboard">
                    <a>
                      <MdDashboard title="Go to dashboard" />
                    </a>
                  </Link>
                </div>
              }
            </div>
          </>
          :
          <>
            <p>
              Not logged in
            </p>
            <div className="hover:scale-110 transition-all">
              <Link href="/user/login">
                <a>
                  <FiLogIn title="Log in" />
                </a>
              </Link>
            </div>
          </>
      }
    </div>
  )
}

export default UserPill
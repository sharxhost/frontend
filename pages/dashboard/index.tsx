import { ServiceInfoResponse, ServiceStatsResponse } from '../../api-types/src/routes/service';
import Layout from '../../components/Containers/Layout';
import { axiosInstance } from '../../hooks/useRequest';
import useRequest from '../../hooks/useRequest';
import { useState, useEffect } from 'react';
import { isSuccessfulResponse } from '../../api-types/src';
import { UserInfoResponse } from '../../api-types/src/routes/user';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import TextCard from '../../components/Elements/TextCard';

function Dashboard(): JSX.Element {
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [user, setUser] = useState<UserInfoResponse | null>(null);

  const { data } = useRequest<UserInfoResponse>({ url: "/user/info", headers: { "Authorization": `Bearer ${token}` } });
  useEffect(() => {
    if (data && isSuccessfulResponse(data))
      setUser(data);
    else
      setUser(null);
  }, [data]);

  return (
    <Layout title="Dashboard" className='overflow-hidden' auth={true}>
      <div className='flex items-center justify-center w-screen h-screen'>
        {user && isSuccessfulResponse(user) &&
          <div className='grid grid-flow-row justify-items-center'>
            <p className='text-3xl'>Welcome back, <strong>{user.username}</strong>!</p>
            <div>
              <TextCard title="Your UUID" text={user.uuid} animation={true} code={true} />
            </div>
          </div>
        }
      </div>
    </Layout >
  );
}

export default Dashboard


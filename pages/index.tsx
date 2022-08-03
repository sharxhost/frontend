import { isSuccessfulResponse } from '../api-types/src';
import { ServiceInfoResponse, ServiceStatsResponse } from '../api-types/src/routes/service';
import Layout from '../components/Containers/Layout';
import { axiosInstance } from '../hooks/useRequest';
import Image from 'next/image';
import Card from '../components/Containers/Card';
import ParticleBackground from '../components/Elements/ParticleBackground';
import TextCard from '../components/Elements/TextCard';
import useRequest from '../hooks/useRequest';
import ms from 'ms';
import UserPill from '../components/Elements/UserPill';

function Home({ serviceInfo }: { serviceInfo: ServiceInfoResponse }): JSX.Element {
  const { data } = useRequest<ServiceStatsResponse>({ url: "/service/stats" });

  return (
    <Layout title={isSuccessfulResponse(serviceInfo) ? serviceInfo.name : "Home"} className='overflow-hidden' navBar={false} background={false}>
      <ParticleBackground />
      <UserPill className='absolute right-0 
                          mt-4 mr-0
                          rounded-l-3xl' goToDashboard={true} />
      <div className='w-full h-full flex items-center justify-center'>
        <Card className='grid grid-flow-row justify-items-center bg-slate-700' padding={false}>
          <Card className='grid grid-flow-col place-items-center bg-purple-900' padding={false}>
            <div className="bg-purple-800
                        rounded-3xl rounded-r-none
                        flex items-center justify-center
                        p-4 h-full">
              <div className='z-10'>
                <Image
                  src="/favicon.svg"
                  alt="Logo"
                  width={128}
                  height={128}
                />
              </div>
              <div className='absolute z-0 blur-sm'>
                <Image
                  src="/favicon.svg"
                  alt="Logo"
                  width={133}
                  height={133}
                />
              </div>
            </div>
            <div className='grid grid-flow-row justify-items-center m-4 ml-7'>
              {
                isSuccessfulResponse(serviceInfo) ?
                  <>
                    <p className="text-2xl mb-3">
                      Welcome to
                    </p>

                    <p className="text-7xl font-bold text-red-600 mb-1">
                      {serviceInfo.name}
                    </p>

                    <p className="text-4xl text-red-400">
                      {serviceInfo.desc}
                    </p>
                  </>
                  : <p className='text-7xl text-red-700'>Error</p>
              }
            </div>
          </Card>

          <div className="m-2 grid grid-flow-col place-items-center">
            <div>
              <p className="text-4xl font-bold">
                Still not convinced?!
              </p>

              <p className="text-2xl italic text-gray-400">
                Just look at those juicy stats...
              </p>
            </div>

            {!!data && isSuccessfulResponse(data) ?
              <div className="grid grid-cols-2 grid-rows-2 gap-3 ml-7">
                <TextCard title={data.images.toString()} text={`image${data.images == 1 ? "" : "s"}`} animation={true} />
                <TextCard title={data.users.toString()} text={`user${data.users == 1 ? "" : "s"}`} animation={true} />
                <TextCard title={data.sessions.toString()} text={`dash session${data.sessions == 1 ? "" : "s"}`} animation={true} />
                <TextCard title={ms(data.uptime * 1000)} text="uptime" animation={true} />
              </div>
              : <p className='text-3xl text-red-700'>Error</p>
            }
          </div>
        </Card>
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

export default Home

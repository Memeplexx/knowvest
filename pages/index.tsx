import { CenterContent, Divider, LoginButton, Title, Wrapper } from '@/utils/pages/landing/styles'
import { useEvents } from '@/utils/pages/landing/events';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Snackbar } from '@/components/snackbar';


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    }
  }
  return {
    props: {}
  };
}

export default function Index() {
  const events = useEvents();

  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.query['session-expired']) {
      setMessage('Your session expired. Please sign in again');
    }
  }, [router.query]);

  return (
    <>
      <Wrapper
        children={
          <CenterContent
            children={
              <>
                <Title
                  children="know-vest"
                />
                <Divider />
                <LoginButton
                  onClick={events.onClickSignIn}
                  children="sign in"
                />
              </>
            }
          />
        }
      />
      <Snackbar
        message={message}
        status='error'
        onMessageClear={() => setMessage('')}
      />
    </>
  )
}

import { CenterContent, Divider, LoginButton, Title, Wrapper } from '@/utils/pages/landing/styles'
import { useOutputs } from '@/utils/pages/landing/outputs';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { Snackbar } from '@/components/snackbar';
import { useInputs } from '@/utils/pages/landing/inputs';
import { Loader } from '@/components/loader';


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
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state } = inputs;
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
                  onClick={outputs.onClickSignIn}
                  children="sign in"
                  aria-label='Sign in'
                />
              </>
            }
          />
        }
      />
      <Loader 
        show={state.showLoader}
      />
      <Snackbar
        message={state.message}
        status='error'
        onMessageClear={() => state.set({ message: '' })}
      />
    </>
  )
}

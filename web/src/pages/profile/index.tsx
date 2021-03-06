import { Helmet } from 'react-helmet-async';

import GlobalLayout from '../../components/layout';

const TITLE = 'Profile | CK';

export default function Profile() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <GlobalLayout>
        This is the profile
      </GlobalLayout>
    </>
  )
}
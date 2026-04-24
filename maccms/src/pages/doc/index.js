// pages/tools/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Redirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/doc/v10');
  });
  
  return null;
};

export default Redirect;

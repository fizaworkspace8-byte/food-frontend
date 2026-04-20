import React, { Suspense, lazy } from 'react';
import HeroCanvas from '../components/HeroCanvas';
const ArticlesSection = lazy(() => import('../components/ArticlesSection'));

const Home = () => {
  return (
    <>
      <HeroCanvas />
      <Suspense fallback={<div className="h-screen bg-black" />}>
        <ArticlesSection />
      </Suspense>
    </>
  );
};

export default Home;
